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
const azure = require('azure-storage');
const slug = require('slug');

exports.insertScanResult = (api, buildId, runId, data, buildDate) => {
	const entGen = azure.TableUtilities.entityGenerator;
	let entity = {
		PartitionKey: entGen.String(api),
		RowKey: entGen.String(`${api}-${newGuid()}`),
		buildId: entGen.String(buildId),
		runId: entGen.String(runId),
		buildDate: entGen.DateTime(buildDate),
	};
	return insertEntity(TABLE.ScanResults, replaceProp(data, entity));
};

exports.updateConfig = (api, data) => {
	const entGen = azure.TableUtilities.entityGenerator;

	let entity = {
		PartitionKey: entGen.String(api),
		RowKey: entGen.String(api),
	};
	return updateEntity(TABLE.Subscriptions, replaceProp(data, entity));
};

exports.deleteIgnoreUrl = (api, url) => {
	const entGen = azure.TableUtilities.entityGenerator;

	let entity = {
		PartitionKey: entGen.String(api),
		RowKey: entGen.String(url),
	};
	return deleteEntity(TABLE.IgnoredUrls, entity);
};

exports.addIgnoreUrl = (api, data) => {
	const entGen = azure.TableUtilities.entityGenerator;
	let entity = {
		PartitionKey: entGen.String(api),
		RowKey: entGen.String(
			slug(data.urlToIgnore) + '_' + slug(data.ignoreOn)
		),
	};
	return updateEntity(TABLE.IgnoredUrls, replaceProp(data, entity));
};

exports.addPerformanceThreshold = (api, data) => {
	const entGen = azure.TableUtilities.entityGenerator;
	return updateEntity(
		TABLE.PerformanceThreshold,
		replaceProp(data, {
			PartitionKey: entGen.String(api),
			RowKey: entGen.String(slug(data.url)),
		})
	);
};

exports.addLoadThreshold = (api, data) => {
	const entGen = azure.TableUtilities.entityGenerator;
	return updateEntity(
		TABLE.LoadThreshold,
		replaceProp(data, {
			PartitionKey: entGen.String(api),
			RowKey: entGen.String(slug(data.url)),
		})
	);
};

exports.addHTMLHintRules = (api, data) => {
	const entGen = azure.TableUtilities.entityGenerator;
	return updateEntity(
		TABLE.htmlhintrules,
		replaceProp(data, {
			PartitionKey: entGen.String(api),
			RowKey: entGen.String(slug(data.url)),
		})
	);
};

exports.addHTMLHintRulesForEachRun = (api, data) => {
	const entGen = azure.TableUtilities.entityGenerator;
	return updateEntity(
		TABLE.htmlhintrules,
		replaceProp(data, {
			PartitionKey: entGen.String(api),
			RowKey: entGen.String(slug(data.runId)),
		})
	);
};

exports.insertScanSummary = (api, buildId, runId, buildDate, data) => {
	var entGen = azure.TableUtilities.entityGenerator;
	// use Log tail pattern to get native sort from Table Storage
	var entity = {
		PartitionKey: entGen.String(api),
		RowKey: entGen.String(getReversedTick()),
		buildId: entGen.String(buildId),
		runId: entGen.String(runId),
		buildDate: entGen.DateTime(buildDate),
	};
	return insertEntity(TABLE.Scans, replaceProp(data, entity));
};

exports.addAlertEmailAddresses = (api, data) => {
	const entGen = azure.TableUtilities.entityGenerator;
	return updateEntity(
		TABLE.alertEmailAddresses,
		replaceProp(data, {
			PartitionKey: entGen.String(api),
			RowKey: entGen.String(getReversedTick()),
		})
	);
};

exports.removeAlertEmailAddress = (api, rowkey) => {
	const entGen = azure.TableUtilities.entityGenerator;

	let entity = {
		PartitionKey: entGen.String(api),
		RowKey: rowkey,
	};
	return deleteEntity(TABLE.alertEmailAddresses, entity);
};

exports.uploadLighthouseReport = (runId, lhr) =>
	uploadBlob(BLOB.lhr, `${runId}.json`, JSON.stringify(lhr));

exports.uploadArtilleryReport = (runId, atr) =>
	uploadBlob(BLOB.atr, `${runId}.json`, JSON.stringify(atr));

exports.uploadHtmlHintReport = (runId, htmlIssues) =>
	uploadBlob(BLOB.htmlhint, `${runId}.json`, JSON.stringify(htmlIssues));

exports.uploadCodeAuditorReport = (runId, codeIssues) =>
	uploadBlob(BLOB.codeAuditor, `${runId}.json`, JSON.stringify(codeIssues));