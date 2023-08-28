const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const R = require('ramda');
const fetch = require('node-fetch');
const Queue = require('better-queue');
const { unscannableLinks } = require('./consts');
require('dotenv').config();

const {
	addIgnoreUrl,
	insertScanSummary,
	insertScanResult,
	deleteIgnoreUrl,
	updateConfig,
	uploadLighthouseReport,
	uploadArtilleryReport,
	uploadHtmlHintReport,
	addPerformanceThreshold,
	addLoadThreshold,
	addHTMLHintRules,
	uploadCodeAuditorReport,
	addHTMLHintRulesForEachRun,
	addAlertEmailAddresses,
	removeAlertEmailAddress,
} = require('./commands');
const {
	getPersonalSummary,
	getAllPublicSummary,
	getSummaryById,
	getConfig,
	getPerformanceThreshold,
	getLoadThreshold,
	getHTMLHintRules,
	getScanDetails,
	getIgnoredUrls,
	getHTMLHintRulesByRunId,
	getLatestSummaryFromUrlAndApi,
	getAlertEmailAddressesFromTokenAndUrl,
	getAllScanSummaryFromUrl,
	getUnscannableLinks,
} = require('./queries');
const {
	newGuid,
	getCodeErrorSummary,
	getErrorAndWarnCount,
	getErrorsName,
} = require('./utils');
const {
	updateLastBuild,
	getUserIdFromApiKey,
	getAlertEmailConfig
} = require('./firestore');

var cors = require('cors');
admin.initializeApp();

const app = express();
// middlewares
app.use(express.json());
app.use(cors());

// routes
app.get('/healthz', async (req, res) => res.json('ok'));

app.get('/config/:api', async (req, res) =>
	res.json(await getConfig(req.params.api)));

app.get('/:api/alertEmailConfig', async (req, res) => {
	const uid = await getUserIdFromApiKey(req.params.api);
	if (!uid) {
		res.send(401, 'Invalid token');
		return;
	} else {
		res.json(await getAlertEmailConfig())
	}
});

app.get('/config/:api/ignore', async (req, res) =>
	res.json(await getIgnoredUrls(req.params.api)));

app.delete('/config/:api/ignore/:url', async (req, res) =>
	res.json(await deleteIgnoreUrl(req.params.api, req.params.url)));

app.put('/config/:api', async (req, res) =>
	res.json(await updateConfig(req.params.api, req.body)));

app.put('/config/:api/perfthreshold', async (req, res) =>
	res.json(await addPerformanceThreshold(req.params.api, req.body)));

app.get('/config/:api/perfthreshold/:url', async (req, res) =>
	res.json(await getPerformanceThreshold(req.params.api, req.params.url)));

app.put('/config/:api/loadthreshold', async (req, res) =>
	res.json(await addLoadThreshold(req.params.api, req.body)));

app.get('/config/:api/loadthreshold/:url', async (req, res) =>
	res.json(await getLoadThreshold(req.params.api, req.params.url)));

app.put('/config/:api/htmlhintrules', async (req, res) =>
	res.json(await addHTMLHintRules(req.params.api, req.body)));

app.put('/config/:api/addhtmlhintruleseachrun', async (req, res) =>
	res.json(await addHTMLHintRulesForEachRun(req.params.api, req.body)));

app.get('/config/:api/htmlhintrules/:url', async (req, res) =>
	res.json(await getHTMLHintRules(req.params.api, req.params.url)));

app.get('/config/htmlhintrulesbyrunid/:runId', async (req, res) =>
	res.json(await getHTMLHintRulesByRunId(req.params.runId)));

app.post('/config/:api/ignore', async (req, res) => {
	const {
		ignoreOn,
		ignoreDuration,
		urlToIgnore
	} = req.body;
	const api = req.params.api;
	await addIgnoreUrl(api, {
		ignoreOn,
		ignoreDuration,
		urlToIgnore,
		effectiveFrom: new Date(),
	});

	res.json(await getIgnoredUrls(api));
});

app.put('/:api/addalertemailaddresses', async (req, res) =>
	res.json(await addAlertEmailAddresses(req.params.api, req.body)));

app.get('/getalertemailaddresses/:api/:url', async (req, res) =>
	res.json(await getAlertEmailAddressesFromTokenAndUrl(req.params.api, req.params.url)));

app.delete('/deletealertemailaddress', async (req, res) =>
	res.json(await removeAlertEmailAddress(req.body.api, req.body.rowkey)));

app.get('/scanresult/:api', async (req, res) => {
	res.json(await getPersonalSummary(req.params.api, req.query.showAll));
});

app.get('/allscans', async (req, res) => {
	res.json(await getAllPublicSummary(req.query.showAll));
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

app.get('/latest/:api/:url', async (req, res) => {
	const summary = await getLatestSummaryFromUrlAndApi(req.params.url, req.params.api);
	const brokenLinks = await getScanDetails(summary[0].runId);
	res.json({
		summary,
		brokenLinks
	});
});

app.get('/scanSummaryFromUrl/:api/:url', async (req, res) => {
	res.json(await getAllScanSummaryFromUrl(req.params.url, req.params.api));
});

app.get('/unscannableLinks', async (req, res) => {
	res.json(await getUnscannableLinks());
});

app.post('/scanresult/:api/:buildId', async (req, res) => {
	const {
		badUrls,
		totalScanned,
		scanDuration,
		url,
		lhr,
		atr,
		whiteListed,
		cloc,
		code,
		htmlIssuesSummary,
		htmlIssues,
		isPrivate,
		finalEval,
		buildVersion
	} = req.body;
	let lhrSummary;
	if (lhr) {
		lhrSummary = {
			performanceScore: lhr.categories.performance.score,
			accessibilityScore: lhr.categories.accessibility.score,
			bestPracticesScore: lhr.categories['best-practices'].score,
			seoScore: lhr.categories.seo.score
		};
	}

	let atrSummary;
	if (atr) {
		atrSummary = {
			timestamp: atr.aggregate.timestamp,
			scenariosCreated: atr.aggregate.scenariosCreated,
			scenariosCompleted: atr.aggregate.scenariosCompleted,
			requestsCompleted: atr.aggregate.requestsCompleted,
			rpsCount: atr.aggregate.rps.count,
			latencyMax: atr.aggregate.latency.max,
			latencyMin: atr.aggregate.latency.min,
			latencyMedian: atr.aggregate.latency.median,
			latencyP95: atr.aggregate.latency.p95,
			latencyP99: atr.aggregate.latency.p99,
			scenarioDurationMedian: atr.aggregate.scenarioDuration.median,
			scenarioDurationP95: atr.aggregate.scenarioDuration.p95,
			scenarioDurationP99: atr.aggregate.scenarioDuration.p99,
			errors: Object.keys(atr.aggregate.errors).length
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
		const {
			warn,
			error
		} = getErrorAndWarnCount(htmlIssuesSummary);
		htmlWarnings = warn;
		htmlErrors = error;
		htmlIssuesList = getErrorsName(htmlIssuesSummary);
	}

	// insert summary first
	const payload = {
		...lhrSummary,
		...atrSummary,
		totalScanned,
		whiteListed,
		scanDuration,
		url,
		cloc,
		totalBrokenLinks: badUrls.length,
		uniqueBrokenLinks: R.uniqBy(R.prop('dst'), badUrls.filter((x) => !unscannableLinks.some(link => x.dst.includes(link.url)))).length,
		pagesWithBrokenLink: R.uniqBy(R.prop('src'), badUrls.filter((x) => !unscannableLinks.some(link => x.dst.includes(link.url)))).length,
		totalUnique404: R.uniqBy(
			R.prop('dst'),
			badUrls.filter((x) => x.statuscode === '404' && !unscannableLinks.some(link => x.dst.includes(link.url)))
		).length,
		htmlWarnings: htmlWarnings,
		htmlErrors: htmlErrors,
		codeIssues: getCodeErrorSummary(code),
		htmlIssuesList,
		isPrivate,
		finalEval,
		buildVersion
	};

	console.log('adding summary', payload);
	await insertScanSummary(apikey, buildId, runId, buildDate, payload);
	if (lhr) {
		console.log('uploading Lighthouse report to Blob storage');
		await uploadLighthouseReport(runId, lhr);
		console.log('uploading Lighthouse report to Blob storage - completed');
	}

	if (atr) {
		console.log('uploading Artillery report to Blob storage');
		await uploadArtilleryReport(runId, atr);
		console.log('uploading Artillery report to Blob storage - completed');
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
				}, {
					concurrent: 10
				}
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