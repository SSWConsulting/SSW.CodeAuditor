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

exports.insertScanResult = async (api, buildId, runId, data, buildDate, url) => {
	const entGen = azure.TableUtilities.entityGenerator;
	let entity = {
		PartitionKey: entGen.String(api),
		RowKey: entGen.String(`${api}-${newGuid()}`),
		buildId: entGen.String(buildId),
		runId: entGen.String(runId),
		buildDate: entGen.DateTime(buildDate),
		apiKey: entGen.String(api)
	};
	let entityRunIndexed = {
		...entity,
		PartitionKey: entGen.String(`${api}-${runId}`),
	};
	let entityUrlIndexed = {
		...entity,
		PartitionKey: entGen.String(`${api}-${slug(url)}`),
	};
	await insertEntity(TABLE.ScanResults, replaceProp(data, entityRunIndexed));
	await insertEntity(TABLE.ScanResults, replaceProp(data, entityUrlIndexed));
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
	const timeStamp = new Date().toISOString().toString();
	return insertEntity(
		TABLE.htmlhintrules,
		replaceProp(data, {
			PartitionKey: entGen.String(api),
			RowKey: entGen.String(timeStamp),
			slugUrl: slug(data.url)
		})
	);
};

exports.addHTMLHintRulesForEachRun = (api, data) => {
	const entGen = azure.TableUtilities.entityGenerator;
	return insertEntity(
		TABLE.htmlhintrules,
		replaceProp(data, {
			PartitionKey: entGen.String(api),
			RowKey: entGen.String(slug(data.runId)),
		})
	);
};

exports.insertScanSummary = async (api, buildId, runId, buildDate, data) => {
	var entGen = azure.TableUtilities.entityGenerator;
	// use Log tail pattern to get native sort from Table Storage
	const entity = {
		PartitionKey: entGen.String(api),
		RowKey: entGen.String(getReversedTick()),
		buildId: entGen.String(buildId),
		runId: entGen.String(runId),
		buildDate: entGen.DateTime(buildDate),
		scanResultVersion: entGen.Int32(2),
		apiKey: entGen.String(api)
	};
	const entityRunIndexed = {
		...entity,
		PartitionKey: entGen.String(`${api}-${runId}`),
	};
	let entityUrlIndexed = {
		...entity,
		PartitionKey: entGen.String(`${api}-${slug(data.url)}`),
	};
	await insertEntity(TABLE.Scans, replaceProp(data, entityRunIndexed));
	await insertEntity(TABLE.Scans, replaceProp(data, entityUrlIndexed));
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