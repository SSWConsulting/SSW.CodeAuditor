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
const account = process.env.AZURE_STORAGE_ACCOUNT;
const accountKey = process.env.AZURE_STORAGE_ACCESS_KEY;
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

exports.getPersonalSummary = (api, showAll) =>
	new Promise(async (resolve) => {
		const entity = new TableClient(azureUrl, TABLE.Scans, credential).listEntities({
			queryOptions: { filter: odata`PartitionKey eq ${api}` }
		});
		if (showAll === 'true') {
			let result = []
			for await (const item of entity) {
				result.push(item);
			}
			resolve(result)
		} else {
			const iterator = entity.byPage({ maxPageSize: 500 });
			for await (const item of iterator) {
				resolve(item)
				break;
			}
		}
	});

exports.getAllPublicSummary = (showAll) =>
	new Promise(async (resolve) => {
		const entity = new TableClient(azureUrl, TABLE.Scans, credential).listEntities({
			queryOptions: { filter: odata`isPrivate eq ${false}` }
		});
		if (showAll === 'true') {
			let result = []
			for await (const item of entity) {
				result.push(item);
			}
			resolve(result)
		} else {
			const iterator = entity.byPage({ maxPageSize: 500 });
			for await (const item of iterator) {
				resolve(item)
				break;
			}
		}
	});

exports.getSummaryById = async (runId) => 
	getRun(runId).then((doc) =>
		new Promise(async (resolve) => {
			const entity = new TableClient(azureUrl, TABLE.Scans, credential).listEntities({
				queryOptions: { filter: odata`PartitionKey eq ${doc.apikey} and runId eq ${doc.runId}` }
			});
			let result = []
			for await (const item of entity) {
				result.push(item);
			}
			resolve(result[0])
		}));

exports.getLatestSummaryFromUrlAndApi = (url, api) => 
	new Promise(async (resolve) => {
		const entity = new TableClient(azureUrl, TABLE.Scans, credential).listEntities({
			queryOptions: { filter: odata`url eq ${url} and PartitionKey eq ${api}` }
		});
		const iterator = entity.byPage({ maxPageSize: 1 });
		for await (const item of iterator) {
			resolve(item)
			break;
		}
	});

exports.getAlertEmailAddressesFromTokenAndUrl = (api, url) => 
	new Promise(async (resolve) => {
		const entity = new TableClient(azureUrl, TABLE.alertEmailAddresses, credential).listEntities({
			queryOptions: { filter: odata`url eq ${url} and PartitionKey eq ${api} and authorToken eq ${api}` }
		});
		let result = []
		for await (const item of entity) {
			result.push(item);
		}
		resolve(result)
	});
exports.getAllScanSummaryFromUrl = (url, api) =>
new Promise(async (resolve) => {
	const entity = new TableClient(azureUrl, TABLE.Scans, credential).listEntities({
		queryOptions: { filter: odata`url eq ${url} and PartitionKey eq ${api}` }
	});
	const iterator = entity.byPage({ maxPageSize: 10 });
	for await (const item of iterator) {
		resolve(item)
		break;
	}
});
