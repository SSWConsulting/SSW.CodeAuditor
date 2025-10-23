const {
	uploadBlob,
	insertEntity,
	updateEntity,
	deleteEntity,
} = require('./azurestorage');
const {
	BLOB,
	TABLE
} = require('./consts');
const {
	replaceProp,
	newGuid,
	getReversedTick
} = require('./utils');
const slug = require('slug');

exports.insertScanResult = async (api, buildId, runId, data, buildDate, url) => {
	let entity = {
		partitionKey: api,
		rowKey: `${api}-${newGuid()}`,
		buildId,
		runId,
		buildDate,
		apiKey: api,
	};
	let entityRunIndexed = {
		...entity,
		partitionKey: `${api}-${runId}`,
	};
	let entityUrlIndexed = {
		...entity,
		partitionKey: `${api}-${slug(url)}`,
	};
	await insertEntity(TABLE.ScanResults, replaceProp(data, entityRunIndexed));
	await insertEntity(TABLE.ScanResults, replaceProp(data, entityUrlIndexed));
	return insertEntity(TABLE.ScanResults, replaceProp(data, entity));
};

exports.updateConfig = (api, data) => {
	let entity = {
		partitionKey: api,
		rowKey: api,
	};
	return updateEntity(TABLE.Subscriptions, replaceProp(data, entity));
};

exports.deleteIgnoreUrl = (api, url) => {
	let entity = {
		partitionKey: api,
		rowKey: url,
	};
	return deleteEntity(TABLE.IgnoredUrls, entity);
};

exports.addIgnoreUrl = (api, data) => {
	let entity = {
		partitionKey: api,
		rowKey: slug(data.urlToIgnore) + '_' + slug(data.ignoreOn),
	};
	return updateEntity(TABLE.IgnoredUrls, replaceProp(data, entity));
};

exports.addPerformanceThreshold = (api, data) => {
	return updateEntity(
		TABLE.PerformanceThreshold,
		replaceProp(data, {
			partitionKey: api,
			rowKey: slug(data.url),
		})
	);
};

exports.addLoadThreshold = (api, data) => {
	return updateEntity(
		TABLE.LoadThreshold,
		replaceProp(data, {
			partitionKey: api,
			rowKey: slug(data.url),
		})
	);
};

exports.addHTMLHintRules = (api, data) => {
	const timeStamp = new Date().toISOString().toString();
	return insertEntity(
		TABLE.htmlhintrules,
		replaceProp(data, {
			partitionKey: api,
			rowKey: timeStamp,
			slugUrl: slug(data.url)
		})
	);
};

exports.addHTMLHintRulesForEachRun = (api, data) => {
	return insertEntity(
		TABLE.htmlhintrules,
		replaceProp(data, {
			partitionKey: api,
			rowKey: slug(data.runId),
		})
	);
};

exports.insertScanSummary = async (api, buildId, runId, buildDate, data) => {
	// use Log tail pattern to get native sort from Table Storage
	const entity = {
		partitionKey: api,
		rowKey: getReversedTick(),
		buildId,
		runId,
		buildDate,
		scanResultVersion: 2,
		apiKey: api,
	};
	const entityRunIndexed = {
		...entity,
		partitionKey: `${api}-${runId}`,
	};
	let entityUrlIndexed = {
		...entity,
		partitionKey: `${api}-${slug(data.url)}`,
	};
	await insertEntity(TABLE.Scans, replaceProp(data, entityRunIndexed));
	await insertEntity(TABLE.Scans, replaceProp(data, entityUrlIndexed));
	return insertEntity(TABLE.Scans, replaceProp(data, entity));
};

exports.addAlertEmailAddresses = (api, data) => {
	return updateEntity(
		TABLE.alertEmailAddresses,
		replaceProp(data, {
			partitionKey: api,
			rowKey: getReversedTick(),
		})
	);
};

exports.removeAlertEmailAddress = (api, rowkey) => {
	let entity = {
		partitionKey: api,
		rowKey: rowkey,
	};
	return deleteEntity(TABLE.alertEmailAddresses, entity);
};

exports.addCustomHtmlRuleOptions = (api, data) => {
	return updateEntity(
		TABLE.HtmlRulesCustomOptions,
		replaceProp(data, {
			partitionKey: api,
			rowKey: data.ruleId,
		})
	);
};

exports.uploadLighthouseReport = (runId, lhr) =>
	uploadBlob(BLOB.lhr, `${runId}.json`, JSON.stringify(lhr));

exports.uploadK6Report = (runId, k6Report) =>
	uploadBlob(BLOB.k6Report, `${runId}.json`, JSON.stringify(k6Report));

exports.uploadHtmlHintReport = (runId, htmlIssues) =>
	uploadBlob(BLOB.htmlhint, `${runId}.json`, JSON.stringify(htmlIssues));

exports.uploadCodeAuditorReport = (runId, codeIssues) =>
	uploadBlob(BLOB.codeAuditor, `${runId}.json`, JSON.stringify(codeIssues));