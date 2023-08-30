const slug = require('slug');
const {
	getService,
} = require('./azurestorage');
const {
	getRun
} = require('./firestore');
const {
	TABLE
} = require('./consts');
const { TableClient, AzureNamedKeyCredential, odata } = require('@azure/data-tables');

const account = process.env.AZURE_STORAGE_ACCOUNT;
const accountKey = process.env.AZURE_STORAGE_ACCESS_KEY;
const credential = new AzureNamedKeyCredential(account, accountKey);
const azureUrl = `https://${account}.table.core.windows.net`;

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
		new Promise(async (resolve) => {
			const entity = new TableClient(azureUrl, TABLE.ScanResults, credential).listEntities({
				queryOptions: { filter: odata`PartitionKey eq ${doc.apikey} and runId eq ${doc.runId}` }
			});
			let result = []
			for await (const item of entity) {
				result.push(item);
			}
			resolve(result)
		}));

exports.getIgnoredUrls = (api) =>
	new Promise(async (resolve) => {
		const entity = new TableClient(azureUrl, TABLE.IgnoredUrls, credential).listEntities({
			queryOptions: { filter: odata`PartitionKey eq ${api}` }
		});
		let result = []
		for await (const item of entity) {
			result.push(item);
		}
		resolve(result)
	})

exports.getPerformanceThreshold = (api, url) => 
	new Promise(async (resolve) => {
		const entity = new TableClient(azureUrl, TABLE.PerformanceThreshold, credential).listEntities({
			queryOptions: { filter: odata`PartitionKey eq ${api} and RowKey eq ${slug(url)}` }
		});
		let result = []
		for await (const item of entity) {
			result.push(item);
		}
		resolve(result[0])
	})

exports.getLoadThreshold = (api, url) => 
	new Promise(async (resolve) => {
		const entity = new TableClient(azureUrl, TABLE.LoadThreshold, credential).listEntities({
			queryOptions: { filter: odata`PartitionKey eq ${api} and RowKey eq ${slug(url)}` }
		});
		let result = []
		for await (const item of entity) {
			result.push(item);
		}
		resolve(result[0])
	});

exports.getHTMLHintRules = (api, url) => 
	new Promise(async (resolve) => {
		const entity = new TableClient(azureUrl, TABLE.htmlhintrules, credential).listEntities({
			queryOptions: { filter: odata`PartitionKey eq ${api} and RowKey eq ${slug(url)}` }
		});
		let result = []
		for await (const item of entity) {
			result.push(item);
		}
		resolve(result[0])
  });

exports.getHTMLHintRulesByRunId = (runId) => 
	new Promise(async (resolve) => {
		const entity = new TableClient(azureUrl, TABLE.htmlhintrules, credential).listEntities({
			queryOptions: { filter: odata`RowKey eq ${runId}` }
		});
		let result = []
		for await (const item of entity) {
			result.push(item);
		}
		resolve(result[0])
	});

exports.getPersonalSummary = (api, showAll) =>
	new Promise(async (resolve) => {
		if (showAll === 'true') {
			const entity = new TableClient(azureUrl, TABLE.Scans, credential).listEntities({
				queryOptions: { filter: odata`PartitionKey eq ${api}` }
			});
			let result = []
			for await (const item of entity) {
				result.push(item);
			}
			resolve(result)
		} else {
			// Top 500 scans in last 24 months
			var date = new Date();
			date.setMonth(date.getMonth() - 24);

			const entity = new TableClient(azureUrl, TABLE.Scans, credential).listEntities({
				queryOptions: { filter: odata`PartitionKey eq ${api} and buildDate gt datetime'${date.toISOString()}'` }
			});
			const iterator = entity.byPage({ maxPageSize: parseInt(process.env.MAX_SCAN_SIZE) });
			for await (const item of iterator) {
				resolve(item)
				break;
			}
		}
	});

exports.getAllPublicSummary = (showAll) =>
	new Promise(async (resolve) => {
		if (showAll === 'true') {
			const entity = new TableClient(azureUrl, TABLE.Scans, credential).listEntities({
				queryOptions: { filter: odata`isPrivate eq ${false}` }
			});
			let result = []
			for await (const item of entity) {
				result.push(item);
			}
			resolve(result)
		} else {
			// Top 500 scans in last 24 months
			var date = new Date();
			date.setMonth(date.getMonth() - 12);

			const entity = new TableClient(azureUrl, TABLE.Scans, credential).listEntities({
				queryOptions: { filter: odata`isPrivate eq ${false} and buildDate gt datetime'${date.toISOString()}'` }
			});
			const iterator = entity.byPage({ maxPageSize: parseInt(process.env.MAX_SCAN_SIZE) });
			for await (const item of iterator) {
				resolve(item)
				break;
			}
		}
	});

exports.getSummaryById = (runId) => 
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

exports.getUnscannableLinks = () =>
	new Promise(async (resolve) => {
		const entity = new TableClient(azureUrl, TABLE.UnscannableLinks, credential).listEntities();
		let result = []
		for await (const item of entity) {
			result.push(item.url);
		}
		resolve(result)
	});
