const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const R = require('ramda');
const fetch = require('node-fetch');
const Queue = require('better-queue');
require('dotenv').config();

const {
	addIgnoreUrl,
	insertScanSummary,
	insertScanResult,
	deleteIgnoreUrl,
	updateConfig,
	uploadLighthouseReport,
	uploadHtmlHintReport,
	addPerformanceThreshold,
	uploadCodeAuditorReport,
} = require('./commands');
const {
	getSummary,
	getSummaryById,
	getConfig,
	getPerformanceThreshold,
	getScanDetails,
	getIgnoredUrls,
} = require('./queries');
const {
	newGuid,
	getCodeErrorSummary,
	getErrorAndWarnCount,
	getErrorsName,
} = require('./utils');
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

app.delete('/config/:api/ignore/:url', async (req, res) =>
	res.json(await deleteIgnoreUrl(req.params.api, req.params.url))
);

app.put('/config/:api', async (req, res) =>
	res.json(await updateConfig(req.params.api, req.body))
);

app.put('/config/:api/perfthreshold', async (req, res) =>
	res.json(await addPerformanceThreshold(req.params.api, req.body))
);

app.get('/config/:api/perfthreshold/:url', async (req, res) =>
	res.json(await getPerformanceThreshold(req.params.api, req.params.url))
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

app.get('/scanresult/:api', async (req, res) => {
	console.log('GET ScanResults for', req.params.api);
	res.json(await getSummary(req.params.api));
});

app.get('/viewsource', async (req, res) => {
	const resp = await fetch(req.query.url);
	const source = await resp.text();
	res.send(source);
});

app.get('/run/:runId', async (req, res) => {
	const summary = await getSummaryById(req.params.runId);
	const brokenLinks = await getScanDetails(req.params.runId);
	res.json({
		summary,
		brokenLinks,
	});
});

app.post('/scanresult/:api/:buildId', async (req, res) => {
	const {
		badUrls,
		totalScanned,
		scanDuration,
		url,
		lhr,
		whiteListed,
		cloc,
		code,
		htmlIssuesSummary,
		htmlIssues,
	} = req.body;
	let lhrSummary;
	if (lhr) {
		lhrSummary = {
			performanceScore: lhr.categories.performance.score,
			accessibilityScore: lhr.categories.accessibility.score,
			bestPracticesScore: lhr.categories['best-practices'].score,
			seoScore: lhr.categories.seo.score,
			pwaScore: lhr.categories.pwa.score,
		};
	}
	const apikey = req.params.api;
	const buildId = req.params.buildId;
	const runId = newGuid();
	const buildDate = new Date();

	const uid = await getUserIdFromApiKey(apikey);
	if (!uid) {
		res.send(401, 'Invalid token');
		return;
	}

	let htmlWarnings;
	let htmlErrors;
	let htmlIssuesList;

	if (htmlIssuesSummary) {
		const { warn, error } = getErrorAndWarnCount(htmlIssuesSummary);
		htmlWarnings = warn;
		htmlErrors = error;
		htmlIssuesList = getErrorsName(htmlIssuesSummary);
	}

	// insert summary first
	const payload = {
		...lhrSummary,
		totalScanned,
		whiteListed,
		scanDuration,
		url,
		cloc,
		totalBrokenLinks: badUrls.length,
		uniqueBrokenLinks: R.uniqBy(R.prop('dst'), badUrls).length,
		pagesWithBrokenLink: R.uniqBy(R.prop('src'), badUrls).length,
		totalUnique404: R.uniqBy(
			R.prop('dst'),
			badUrls.filter((x) => x.statuscode === '404')
		).length,
		htmlWarnings,
		htmlErrors,
		codeIssues: getCodeErrorSummary(code),
		htmlIssuesList,
	};

	console.log('adding summary', payload);
	await insertScanSummary(apikey, buildId, runId, buildDate, payload);
	if (lhr) {
		console.log('uploading to Blob storage');
		await uploadLighthouseReport(runId, lhr);
		console.log('uploading to Blob storage - completed');
	}

	if (htmlIssues) {
		console.log('uploading list of HTML hint issues to blob storage');
		await uploadHtmlHintReport(runId, htmlIssues);
		console.log('uploading HtmlHint to Blob storage - completed');
	}

	if (code) {
		console.log('uploading list of Code Auditor issues to blob storage');
		await uploadCodeAuditorReport(runId, code);
		console.log('uploading Code Auditor to Blob storage - completed');
	}

	// insert each row
	const writeAllQueued = () =>
		new Promise((resolve) => {
			var q = new Queue(
				async (brokenLinkData, cb) => {
					console.log(`adding ..... ${brokenLinkData}`);
					const data = await insertScanResult(
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

exports.api = functions.region('asia-east2').https.onRequest(app);
exports.api2 = functions.region('asia-northeast1').https.onRequest(app);
