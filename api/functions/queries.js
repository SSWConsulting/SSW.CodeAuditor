const slug = require('slug');
const {
	getService,
	getTableRows
} = require('./azurestorage');
const {
	getRun
} = require('./firestore');
const {
	TABLE
} = require('./consts');
const azure = require('azure-storage');
const { TableClient, AzureNamedKeyCredential, odata } = require('@azure/data-tables');
const functions = require('firebase-functions');

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

// TODO: Tech debt - Replace all exisiting deprecated azure-storage library with new one using similar template as below
const account = functions.config().azurestorage.account;
const accountKey = functions.config().azurestorage.key;
const credential = new AzureNamedKeyCredential(account, accountKey);
const azureUrl = `https://${account}.table.core.windows.net`;

exports.getScanDetails = (runId) => 
	getRun(runId).then((doc) =>
		new Promise(async (resolve) => {
			const entity = new TableClient(azureUrl, TABLE.ScanResults, credential).listEntities({
				queryOptions: { filter: odata`runId eq ${doc.runId}` }
			});
			let result = []
			for await (const item of entity) {
				result.push(item);
			}
			resolve(result)
		}));

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

exports.getLoadThreshold = async (api, url) => {
	const val = await getTableRows(
		TABLE.LoadThreshold,
		new azure.TableQuery()
		.where('PartitionKey eq ?', api)
		.and('RowKey eq ?', slug(url))
	);

	if (val && val.length > 0) {
		return val[0];
	}
	return null;
};

exports.getHTMLHintRules = async (api, url) => {
	const val = await getTableRows(
		TABLE.htmlhintrules,
		new azure.TableQuery()
		.where('PartitionKey eq ?', api)
		.and('RowKey eq ?', slug(url))
	);

	if (val && val.length > 0) {
		return val[0];
	}
	return null;
};

exports.getHTMLHintRulesByRunId = async (runId) => {
	const val = await getTableRows(
		TABLE.htmlhintrules,
		new azure.TableQuery()
		.where('RowKey eq ?', runId)
	);

	if (val && val.length > 0) {
		return val[0];
	}
	return null;
};

exports.getSummary = (api) =>
	getTableRows(
		TABLE.Scans,
		new azure.TableQuery().where('PartitionKey eq ?', api).top(100)
	);

exports.getAllPublicSummary = () =>
	new Promise(async (resolve) => {
		const entity = new TableClient(azureUrl, TABLE.Scans, credential).listEntities({
			queryOptions: { filter: odata`isPrivate eq ${false}` }
		});
		let result = []
		for await (const item of entity) {
			result.push(item);
		}
		resolve(result)
	});

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