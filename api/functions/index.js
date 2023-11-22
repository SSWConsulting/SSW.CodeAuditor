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
	uploadArtilleryReport,
	uploadHtmlHintReport,
	addPerformanceThreshold,
	addLoadThreshold,
	addHTMLHintRules,
	uploadCodeAuditorReport,
	addHTMLHintRulesForEachRun,
	addAlertEmailAddresses,
	removeAlertEmailAddress,
	addCustomHtmlRuleOptions,
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
	compareScans,
	getCustomHtmlRuleOptions,
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

app.post('/config/:api/htmlhintrules', async (req, res) =>
	res.json(await addHTMLHintRules(req.params.api, req.body)));

app.post('/config/:api/addhtmlhintruleseachrun', async (req, res) =>
	res.json(await addHTMLHintRulesForEachRun(req.params.api, req.body)));

app.get('/config/:api/htmlhintrules/:url', async (req, res) =>
	res.json(await getHTMLHintRules(req.params.api, req.params.url, req.query.isGetAllRecords)));

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

app.post('/getalertemailaddresses/:api', async (req, res) =>
	res.json(await getAlertEmailAddressesFromTokenAndUrl(req.params.api, req.body.url)));

app.delete('/deletealertemailaddress', async (req, res) =>
	res.json(await removeAlertEmailAddress(req.body.api, req.body.rowkey)));

app.get('/scanresult/:api', async (req, res) => {
	res.json(await getPersonalSummary(req.params.api, req.query.showAll));
});

app.get('/allscans', async (req, res) => {
	res.json(await getAllPublicSummary(req.query.showAll));
});

app.get('/viewsource', async (req, res) => {
	const target = new URL(req.query.url);
	const functionHost = '-sswlinkauditor-c1131.cloudfunctions.net';

	// Disallow fetching from same host to prevent request forgery
	if (target.hostname.includes(functionHost) || target.hostname === 'localhost') {
		res.send('Cannot fetch from internal host');
		return;
	}

	const resp = await fetch(target.href).catch((err) => {
		res.send(`Failed to load source: ${err.message}`);
	});
	if (resp.ok) {
		const source = await resp.text();
		res.send(source);
	} else {
		res.send(`Failed to load source: ${resp.status} - ${resp.statusText}`);
	}
});

app.get('/run/:runId', async (req, res) => {
	const summary = await getSummaryById(req.params.runId);
	const brokenLinks = await getScanDetails(req.params.runId);
	res.json({
		summary,
		brokenLinks,
	});
});

app.post('/latest/:api', async (req, res) => {
	const summary = await getLatestSummaryFromUrlAndApi(req.body.url, req.params.api);
	const brokenLinks = await getScanDetails(summary[0].runId);
	res.json({
		summary,
		brokenLinks
	});
});

app.post('/scanSummaryFromUrl/:api', async (req, res) => {
	res.json(await getAllScanSummaryFromUrl(req.body.url, req.params.api));
});

app.post('/comparescanlatestandsecond/:api', async (req, res) => {
	res.json(await compareScans(req.params.api, req.body.url));
});

app.get('/unscannableLinks', async (req, res) => {
	res.json(await getUnscannableLinks());
});

app.post('/config/getCustomHtmlRuleOptions/:api', async (req, res) => {
	res.json(await getCustomHtmlRuleOptions(req.params.api, req.body.url));
});

app.post('/config/addCustomHtmlRuleOptions/:api', async (req, res) => {
	res.json(await addCustomHtmlRuleOptions(req.params.api, req.body));
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
		uniqueBrokenLinks: R.uniqBy(R.prop('dst'), badUrls).length,
		pagesWithBrokenLink: R.uniqBy(R.prop('src'), badUrls).length,
		totalUnique404: R.uniqBy(
			R.prop('dst'),
			badUrls.filter((x) => x.statuscode === '404')
		).length,
		htmlWarnings: htmlWarnings ? htmlWarnings : 0,
		htmlErrors: htmlErrors ? htmlErrors : 0,
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
						buildDate,
						url
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