const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const azure = require('azure-storage');
const R = require('ramda');
const Queue = require('better-queue');
require('dotenv').config();

var cors = require('cors');

// initialize firestore database
admin.initializeApp();
const db = admin.firestore();

const TABLE = {
	Scans: 'Scans',
	Subscriptions: 'Subscriptions',
	ScanResults: 'ScanResults',
};

const app = express();
// middlewares
app.use(express.json());
app.use(cors());

// routes
app.get('/config/:api', async (req, res) =>
	res.json(await getConfig(req.params.api))
);

app.get('/scanresult/:api', async (req, res) =>
	res.json(await getSummary(req.params.api))
);

app.get('/run/:runId', async (req, res) => {
	const summary = await getSummaryById(req.params.runId);
	const brokenLinks = await getScanDetails(req.params.runId);
	res.json({
		summary,
		brokenLinks,
	});
});

app.post('/scanresult/:api/:buildId', async (req, res) => {
	const { badUrls, totalScanned, scanDuration, url } = req.body;
	const apikey = req.params.api;

	// check api
	const uid = await getUserIdFromApiKey(apikey);
	if (!uid) {
		console.log('invalid key provided');
		res.send(401, 'Invalid token');
		return;
	}
	const buildId = req.params.buildId;
	const runId = newGuid(); // unique
	const buildDate = new Date();

	// insert summary first
	const payload = {
		totalScanned,
		scanDuration,
		url,
		totalBrokenLinks: badUrls.length,
		uniqueBrokenLinks: R.uniqBy(R.prop('dst'), badUrls).length,
		pagesWithBrokenLink: R.uniqBy(R.prop('src'), badUrls).length,
		totalUnique404: R.uniqBy(
			R.prop('src'),
			badUrls.filter((x) => x.statuscode === '404')
		).length,
	};
	console.log('adding summary', payload);
	await insertScanSummary(apikey, buildId, runId, buildDate, payload);

	// insert each row
	const writeAllQueued = () =>
		new Promise((resolve) => {
			var q = new Queue(
				async (brokenLinkData, cb) => {
					console.log(`adding ..... ${brokenLinkData}`);
					data = await insertScanResult(
						apikey,
						buildId,
						runId,
						brokenLinkData,
						buildDate
					);
					cb(data);
				},
				{ concurrent: 10 }
			);

			badUrls.forEach((d) => q.push(d));
			q.on('drain', () => {
				console.log(`done all`);
				resolve();
			});
		});

	if (badUrls.length === 0) {
		await updateLastBuild(uid, apikey, runId);
	} else {
		console.log('adding detailed rows');
		await writeAllQueued();
		await updateLastBuild(uid, apikey, runId);
	}
	res.json(runId);
});

// methods
const updateLastBuild = (userId, apikey, runId) => {
	return db
		.collection('users')
		.doc(userId)
		.update({
			lastBuild: new Date(),
			runId,
		})
		.then(() =>
			db.collection('runs').doc(runId).set({
				apikey,
				runId,
			})
		);
};

const getUserIdFromApiKey = (api) => {
	return db
		.collection('users')
		.where('apiKey', '==', api)
		.get()
		.then((x) => (x.docs.length === 1 ? x.docs[0].id : null));
};

const getService = () => {
	return azure.createTableService(
		process.env.AZURE_STORAGE_ACCOUNT ||
			functions.config().azurestorage.account,
		process.env.AZURE_STORAGE_ACCESS_KEY ||
			functions.config().azurestorage.key
	);
};

const getConfig = (api) =>
	new Promise((resolve, reject) => {
		getService().retrieveEntity(
			TABLE.Subscriptions,
			api,
			api,
			(error, result, response) => {
				if (!error) resolve(response.body);
				else reject(error);
			}
		);
	});

const replaceProp = (data, entity) => {
	let toreturn = { ...entity };
	const entGen = azure.TableUtilities.entityGenerator;
	Object.keys(data).forEach((k) => {
		toreturn = {
			...toreturn,
			[k]: R.is(Number, data[k])
				? entGen.Int32(data[k])
				: entGen.String(data[k]),
		};
	});
	return toreturn;
};

const insertScanResult = (api, buildId, runId, brokenLinkData, buildDate) => {
	const entGen = azure.TableUtilities.entityGenerator;
	let entity = {
		PartitionKey: entGen.String(api),
		RowKey: entGen.String(`${api}-${newGuid()}`),
		buildId: entGen.String(buildId),
		runId: entGen.String(runId),
		buildDate: entGen.DateTime(buildDate),
	};
	return new Promise((resolve, reject) => {
		getService().insertEntity(
			TABLE.ScanResults,
			replaceProp(brokenLinkData, entity),
			(error, result, response) => {
				if (!error) resolve(response.statusCode);
				else reject(error);
			}
		);
	});
};

const insertScanSummary = (api, buildId, runId, buildDate, data) => {
	var entGen = azure.TableUtilities.entityGenerator;
	var entity = {
		PartitionKey: entGen.String(api),
		RowKey: entGen.String(`${api}-${buildId}-${newGuid()}`),
		buildId: entGen.String(buildId),
		runId: entGen.String(runId),
		buildDate: entGen.DateTime(buildDate),
	};
	return new Promise((resolve, reject) => {
		getService().insertEntity(
			TABLE.Scans,
			replaceProp(data, entity),
			(error, result, response) => {
				if (!error) resolve(response.statusCode);
				else reject(error);
			}
		);
	});
};

const getScanDetails = (runId) =>
	getRun(runId).then((doc) =>
		getTableRows(
			TABLE.ScanResults,
			new azure.TableQuery()
				.top(50)
				.where('PartitionKey eq ?', doc.apikey)
				.and('runId eq ?', doc.runId)
		)
	);

const getRun = (runId) =>
	db
		.collection('runs')
		.doc(runId)
		.get()
		.then((doc) => doc.data());

const getSummary = (api) =>
	getTableRows(
		TABLE.Scans,
		new azure.TableQuery().where('PartitionKey eq ?', api)
	);

const getSummaryById = (runId) =>
	getRun(runId).then((doc) =>
		getTableRows(
			TABLE.Scans,
			new azure.TableQuery()
				.where('PartitionKey eq ?', doc.apikey)
				.and('runId eq ?', doc.runId)
		)
	);

const getTableRows = (table, query) =>
	new Promise((resolve, reject) => {
		getService().queryEntities(
			table,
			query,
			null,
			(error, result, response) => {
				if (!error) resolve(response.body.value);
				else reject(error);
			}
		);
	});

const newGuid = () => {
	const S4 = () =>
		(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	return (
		S4() +
		S4() +
		'-' +
		S4() +
		'-4' +
		S4().substr(0, 3) +
		'-' +
		S4() +
		'-' +
		S4() +
		S4() +
		S4()
	).toLowerCase();
};

exports.api = functions.https.onRequest(app);
