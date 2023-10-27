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

const getDateDifference = (a, b) => {
	const date1 = new Date(a);
	const date2 = new Date(b);
	const diff = Math.abs(date2 - date1);
	return Math.floor(diff / 86400000); 
};

const incrementString = (str) => {
	const incChar =  String.fromCharCode(str.charCodeAt(str.length - 1) + 1);
	return str.replace(/.$/, incChar);
};

const getExistingBrokenLinkCount = async (runId) => {
	const unscannableLinks = await exports.getUnscannableLinks();
	const scan = await exports.getSummaryById(runId);
	const filter = odata`PartitionKey eq ${scan.partitionKey} and src ge ${scan.url} and src le ${incrementString(scan.url)}`;
    const entity = new TableClient(azureUrl, TABLE.ScanResults, credential).listEntities({
        queryOptions: { filter }
    });
    const result = [];
    for await (const item of entity) {
        result.push(item);
    }
	const previousFailures = new Map();

    const existingCount = result.reduce((count, item) => {
        if (item.runId === runId) {
            if (!previousFailures.has(item.dst) && !unscannableLinks.some((i) => item.dst.includes(i))) {
				const hasPrevious = result.some((i) => i.dst === item.dst && i.buildDate < item.buildDate);
				previousFailures.set(item.dst, hasPrevious);
                
				if (hasPrevious) {
					count++;
				}
            }
        }
        return count;
    }, 0);

    return existingCount;
};

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

exports.getScanDetails = async (runId) => {
	const scan = await exports.getSummaryById(runId);
	let filter;

	if (scan.scanResultVersion === 2) {
		filter = `PartitionKey eq '${scan.partitionKey}-${slug(scan.url)}'`;
	} else {
		filter = odata`PartitionKey eq ${scan.partitionKey} and src ge ${scan.url} and src le ${incrementString(scan.url)}`;
	}

    const entity = new TableClient(azureUrl, TABLE.ScanResults, credential).listEntities({
        queryOptions: { filter }
    });
    const result = [];
    for await (const item of entity) {
        result.push(item);
    }
    const previousFailures = new Map();

    const filteredList = result.reduce((runLinks, item) => {
        if (item.runId === runId) {
            let daysUnfixed = -1;

            if (!previousFailures.has(item.dst)) {
                previousFailures.set(item.dst, result.filter((i) => i.dst === item.dst && i.buildDate < item.buildDate));
            }

            const olderLinks = previousFailures.get(item.dst);
            if (olderLinks.length) {
                const firstUnfixed = olderLinks.reduce((previous, current) => {
                    return current.buildDate < previous.buildDate ? current : previous;
                });
                daysUnfixed = getDateDifference(item.buildDate, firstUnfixed.buildDate);
            }

            runLinks.push({
                ...item,
                daysUnfixed,
            });
        }
        return runLinks;
    }, []);

    return filteredList;
};

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
		resolve(result[0] || {})
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
		resolve(result[0] || {})
	});

exports.getHTMLHintRules = (api, url, isGetAllRecords) => 
	new Promise(async (resolve) => {
		const entity = new TableClient(azureUrl, TABLE.htmlhintrules, credential).listEntities({
			queryOptions: { filter: odata`PartitionKey eq ${api} and slugUrl eq ${url}` }
		});
		let result = []
		for await (const item of entity) {
			result.push(item);
		}
		// By default Azure Table returns record from earliest to latest
		// Hence taking the last item in the returned array gives us the latest record
		resolve(isGetAllRecords ? result : result[result.length - 1] || {})
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
		resolve(result[0] || {})
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

			resolve(result.filter((value, index, self) => {
				return self.findIndex(v => v.runId === value.runId) === index;
			}))
		} else {
			// Top 500 scans in last 24 months
			var date = new Date();
			date.setMonth(date.getMonth() - 12);

			const entity = new TableClient(azureUrl, TABLE.Scans, credential).listEntities({
				queryOptions: { filter: odata`isPrivate eq ${false} and buildDate gt datetime'${date.toISOString()}'` }
			});
			const iterator = entity.byPage({ maxPageSize: parseInt(process.env.MAX_SCAN_SIZE) });
			let result = [];
			for await (const item of iterator) {
				result = item;
				break;
			}

			resolve(result.filter((value, index, self) => {
				return self.findIndex(v => v.runId === value.runId) === index;
			}))
		}
	});

exports.getSummaryById = (runId) => 
	getRun(runId).then((doc) =>
		new Promise(async (resolve) => {
			const getSummary = async (filter) => {
				const entity = new TableClient(azureUrl, TABLE.Scans, credential).listEntities({
					queryOptions: { filter }
				});
				let result = []
				for await (const item of entity) {
					result.push(item);
				}
				return result[0];
			};

			let summary = await getSummary(`PartitionKey eq '${doc.apikey}-${doc.runId}'`);

			if (!summary) {
				summary = await getSummary(odata`PartitionKey eq ${doc.apikey} and runId eq ${doc.runId}`);
			}
			
			resolve(summary || {});
		}));

exports.getLatestSummaryFromUrlAndApi = (url, api) => 
	new Promise(async (resolve) => {
		// Standardize url string
		if (!url.startsWith("https://")) {
			url = "https://" + url;
		}
		if (!url.endsWith("/")) {
			url = url + '/';
		}
		
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
		const getSummary = async (filter) => {
			const entity = new TableClient(azureUrl, TABLE.Scans, credential).listEntities({
				queryOptions: { filter }
			});
			const iterator = entity.byPage({ maxPageSize: 10 });
			let result;
			for await (const item of iterator) {
				if (item[0]) {
					const existing = await getExistingBrokenLinkCount(item[0].runId);
					item[0].totalUniqueBrokenLinksExisting = existing;
				}
				result = item;
				break;
			}
			return result;
		};

		let summary = await getSummary(`PartitionKey eq '${api}-${slug(url)}'`);

		if (!summary) {
			summary = await getSummary(odata`url eq ${url} and PartitionKey eq ${api}`);
		}

		resolve(summary);
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

exports.compareScans = (api, url) =>
	new Promise(async (resolve) => {
		// Standardize url string
		if (!url.startsWith("https://")) {
			url = "https://" + url;
		}
		if (!url.endsWith("/")) {
			url = url + '/';
		}

		const entity = new TableClient(azureUrl, TABLE.Scans, credential).listEntities({
			queryOptions: { filter: odata`PartitionKey eq ${api} and url eq ${url}` }
		});
		let result = [];
		for await (const item of entity) {
			result.push(item);
		}

		const latestResult = result[0] || {};
		const prevResult = result[1] || {};

		let isErrorUp = {
			isHtmlWarningsUp: latestResult.htmlWarnings > prevResult.htmlWarnings,
			prevHtmlWarnings: prevResult.htmlWarnings || 0,
			currHtmlWarnings: latestResult.htmlWarnings || 0,
			isHtmlErrorsUp: latestResult.htmlErrors > prevResult.htmlErrors,
			prevHtmlErrors: prevResult.htmlErrors || 0,
			currHtmlErrors: latestResult.htmlErrors || 0,
			isBrokenLinksUp: latestResult.uniqueBrokenLinks > prevResult.uniqueBrokenLinks,
			prevBrokenLinks: prevResult.uniqueBrokenLinks || 0,
			currBrokenLinks: latestResult.uniqueBrokenLinks || 0,
			latestRunId: latestResult.runId
		} 
		resolve(isErrorUp)
	});
