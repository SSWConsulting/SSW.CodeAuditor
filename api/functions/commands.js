const { insertEntity, updateEntity } = require('./azurestorage');
const { TABLE } = require('./consts');
const { replaceProp, newGuid } = require('./utils');
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

exports.insertScanSummary = (api, buildId, runId, buildDate, data) => {
	var entGen = azure.TableUtilities.entityGenerator;
	var entity = {
		PartitionKey: entGen.String(api),
		RowKey: entGen.String(`${api}-${buildId}-${newGuid()}`),
		buildId: entGen.String(buildId),
		runId: entGen.String(runId),
		buildDate: entGen.DateTime(buildDate),
	};
	return insertEntity(TABLE.Scans, replaceProp(data, entity));
};
