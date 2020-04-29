const slug = require('slug');
const { getService, getTableRows } = require('./azurestorage');
const { getRun } = require('./firestore');
const { TABLE } = require('./consts');
const azure = require('azure-storage');

exports.getConfig = (api) =>
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

exports.getScanDetails = (runId) =>
	getRun(runId).then((doc) =>
		getTableRows(
			TABLE.ScanResults,
			new azure.TableQuery()
				.top(50)
				.where('PartitionKey eq ?', doc.apikey)
				.and('runId eq ?', doc.runId)
		)
	);

exports.getIgnoredUrls = (api) =>
	getTableRows(
		TABLE.IgnoredUrls,
		new azure.TableQuery().where('PartitionKey eq ?', api)
	);

exports.getPerformanceThreshold = async (api, url) => {
	const val = await getTableRows(
		TABLE.PerformanceThreshold,
		new azure.TableQuery()
			.where('PartitionKey eq ?', api)
			.and('RowKey eq ?', slug(url))
	);

	if (val && val.length > 0) {
		return val[0];
	}
	return null;
};

exports.getSummary = (api) =>
	getTableRows(
		TABLE.Scans,
		new azure.TableQuery().where('PartitionKey eq ?', api)
	);

exports.getSummaryById = async (runId) => {
	const val = await getRun(runId).then((doc) =>
		getTableRows(
			TABLE.Scans,
			new azure.TableQuery()
				.where('PartitionKey eq ?', doc.apikey)
				.and('runId eq ?', doc.runId)
		)
	);
	if (val && val.length > 0) {
		return val[0];
	}
	return null;
};
