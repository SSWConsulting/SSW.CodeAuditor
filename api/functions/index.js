const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const R = require('ramda');
const Queue = require('better-queue');
require('dotenv').config();

const {
	addIgnoreUrl,
	insertScanSummary,
	insertScanResult,
	updateConfig,
} = require('./commands');
const {
	getSummary,
	getSummaryById,
	getConfig,
	getScanDetails,
	getIgnoredUrls,
} = require('./queries');
const { newGuid } = require('./utils');
const { updateLastBuild, getUserIdFromApiKey } = require('./firestore');

var cors = require('cors');
admin.initializeApp();

const app = express();
// middlewares
app.use(express.json());
app.use(cors());

// routes
app.get('/healthz', async (req, res) => res.json('ok'));

app.get('/config/:api', async (req, res) =>
	res.json(await getConfig(req.params.api))
);

app.get('/config/:api/ignore', async (req, res) =>
	res.json(await getIgnoredUrls(req.params.api))
);

app.put('/config/:api', async (req, res) =>
	res.json(await updateConfig(req.params.api, req.body))
);

app.post('/config/:api/ignore', async (req, res) => {
	const { ignoreOn, ignoreDuration, urlToIgnore } = req.body;
	const api = req.params.api;

	await addIgnoreUrl(api, {
		ignoreOn,
		ignoreDuration,
		urlToIgnore,
		effectiveFrom: new Date(),
	});

	res.json(await getIgnoredUrls(api));
});

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
	const buildId = req.params.buildId;
	const runId = newGuid();
	const buildDate = new Date();

	const uid = await getUserIdFromApiKey(apikey);
	if (!uid) {
		res.send(401, 'Invalid token');
		return;
	}

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

exports.api = functions.https.onRequest(app);
