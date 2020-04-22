const createAzureFunctionHandler = require('azure-function-express')
	.createAzureFunctionHandler;
const express = require('express');
const azure = require('azure-storage');
const R = require('ramda');
const Queue = require('better-queue');
require('dotenv').config();

var cors = require('cors');

const TABLE = {
	Scans: 'Scans',
	Subscriptions: 'Subscriptions',
	ScanResults: 'ScanResults',
};

const app = express();
app.use(express.json());
app.use(cors());

app.get('/api/config/:api', async (req, res) => {
	const config = await getConfig(req.params.api);
	res.json(config);
});

app.get('/api/scanresult/:api', async (req, res) =>
	res.json(await getSummary(req.params.api))
);

app.get('/api/scanresult/:api/:buildId', async (req, res) =>
	res.json(await getBuildDetails(req.params.api, req.params.buildId))
);

app.post('/api/scanresult/:api/:buildId', async (req, res) => {
	const { badUrls, totalScanned, scanDuration, url } = req.body;
	const apikey = req.params.api;
	const buildId = req.params.buildId;
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
	await insertScanSummary(apikey, buildId, buildDate, payload);

	// insert each row
	var q = new Queue(
		async (task, cb) => {
			data = await insertScanResult(apikey, buildId, task, buildDate);
			cb(data);
		},
		{ concurrent: 10 }
	);
	q.on('drain', () => res.json('OK'));
	badUrls.forEach((d) => q.push(d));
});

const getService = () =>
	azure.createTableService(
		process.env.AZURE_STORAGE_ACCOUNT,
		process.env.AZURE_STORAGE_ACCOUNT
	);

const getConfig = (api) =>
	new Promise((resolve, reject) => {
		getService().retrieveEntity(TABLE.Subscriptions, api, api, function (
			error,
			result,
			response
		) {
			if (!error) resolve(response.body);
			else reject(error);
		});
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

const insertScanResult = (api, buildId, data, buildDate) => {
	const entGen = azure.TableUtilities.entityGenerator;
	let entity = {
		PartitionKey: entGen.String(api),
		RowKey: entGen.String(`${api}-${newGuid()}`),
		buildId: entGen.String(buildId),
		buildDate: entGen.DateTime(buildDate),
	};
	return new Promise((resolve, reject) => {
		getService().insertEntity(
			TABLE.ScanResults,
			replaceProp(data, entity),
			function (error, result, response) {
				if (!error) resolve(response.statusCode);
				else reject(error);
			}
		);
	});
};

const insertScanSummary = (api, buildId, buildDate, data) => {
	var entGen = azure.TableUtilities.entityGenerator;
	var entity = {
		PartitionKey: entGen.String(api),
		RowKey: entGen.String(`${api}-${buildId}-${newGuid()}`),
		buildId: entGen.String(buildId),
		buildDate: entGen.DateTime(buildDate),
	};
	return new Promise((resolve, reject) => {
		getService().insertEntity(
			TABLE.Scans,
			replaceProp(data, entity),
			function (error, result, response) {
				if (!error) resolve(response.statusCode);
				else reject(error);
			}
		);
	});
};

const getBuildDetails = (api, buildId) =>
	getTableRows(
		TABLE.ScanResults,
		new azure.TableQuery()
			.where('PartitionKey eq ?', api)
			.and('buildId eq ?', buildId)
	);

const getSummary = (api) =>
	getTableRows(
		TABLE.Scans,
		new azure.TableQuery().where('PartitionKey eq ?', api)
	);

const getTableRows = (table, query) =>
	new Promise((resolve, reject) => {
		getService().queryEntities(table, query, null, function (
			error,
			result,
			response
		) {
			if (!error) resolve(response.body.value);
			else reject(error);
		});
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

// locally
if (process.argv.includes('--debug')) {
	console.log('running locally');
	app.listen(3000, () =>
		console.log(`Example app listening at http://localhost:${3000}`)
	);
}

// Binds the express app to an Azure Function handler
module.exports = createAzureFunctionHandler(app);
