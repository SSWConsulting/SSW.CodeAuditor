const slug = require('slug');
const {
	getRun
} = require('./firestore');
const {
	TABLE
} = require('./consts');
const { odata } = require('@azure/data-tables');
const { getTableClient } = require('./azureClientFactory');

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
	const scan = await exports.getSummaryById(runId);
	const filterDays = 90;
	let filter;
	const startDate = new Date(scan.buildDate);
	startDate.setDate(startDate.getDate() - filterDays);

	if (scan.scanResultVersion === 2) {
		filter = `PartitionKey eq '${scan.apiKey}-${slug(scan.url)}' and buildDate ge datetime'${startDate.toISOString()}' and buildDate le datetime'${scan.buildDate.toISOString()}'`;
	} else {
		filter = odata`PartitionKey eq ${scan.partitionKey} and src ge ${scan.url} and src le ${incrementString(scan.url)} and buildDate ge datetime'${startDate.toISOString()}' and buildDate le datetime'${scan.buildDate.toISOString()}'`;
	}

	const entity = getTableClient(TABLE.ScanResults).listEntities({
		queryOptions: { filter }
	});
	const result = [];
	for await (const item of entity) {
		result.push(item);
	}
	const previousFailures = new Set();
	const sortedResult = result.sort((a, b) => a.buildDate - b.buildDate);

    const existingCount = sortedResult.reduce((count, item) => {
		if (previousFailures.has(item.dst) && item.runId === runId) {
			count++;
		} else {
			previousFailures.add(item.dst);
		}

        return count;
    }, 0);

    return existingCount;
};

exports.getConfig = async (api) => {
	const client = getTableClient(TABLE.Subscriptions);
	try {
		return await client.getEntity(api, api);
	} catch (error) {
		if (error.statusCode === 404) {
			return {};
		}
		throw error;
	}
};

exports.getScanDetails = async (runId) => {
	const scan = await exports.getSummaryById(runId);
	let filter;
	const filterDays = 90;
	const startDate = new Date(scan.buildDate);
	startDate.setDate(startDate.getDate() - filterDays);

	if (scan.scanResultVersion === 2) {
		filter = `PartitionKey eq '${scan.apiKey}-${slug(scan.url)}' and buildDate ge datetime'${startDate.toISOString()}' and buildDate le datetime'${scan.buildDate.toISOString()}'`;
	} else {
		filter = odata`PartitionKey eq ${scan.partitionKey} and src ge ${scan.url} and src le ${incrementString(scan.url)} and buildDate ge datetime'${startDate.toISOString()}' and buildDate le datetime'${scan.buildDate.toISOString()}'`;
	}

	const entity = getTableClient(TABLE.ScanResults).listEntities({
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
		const entity = getTableClient(TABLE.IgnoredUrls).listEntities({
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
		const entity = getTableClient(TABLE.PerformanceThreshold).listEntities({
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
		const entity = getTableClient(TABLE.LoadThreshold).listEntities({
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
		const entity = getTableClient(TABLE.htmlhintrules).listEntities({
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

exports.getHTMLHintRulesByRunId = async (runId) => {
	const doc = await getRun(runId);
	const entity = getTableClient(TABLE.htmlhintrules).listEntities({
		queryOptions: { filter: odata`PartitionKey eq ${doc.apikey} and RowKey eq ${runId}` }
	});
	let result = []
	for await (const item of entity) {
		result.push(item);
	}
	return result[0] || {};
}

exports.getPersonalSummary = (api, showAll) =>
	new Promise(async (resolve) => {
		if (showAll === 'true') {
			const entity = getTableClient(TABLE.Scans).listEntities({
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

			const entity = getTableClient(TABLE.Scans).listEntities({
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
			const entity = getTableClient(TABLE.Scans).listEntities({
				queryOptions: { filter: odata`isPrivate eq ${false}` }
			});
			let result = []
			for await (const item of entity) {
				result.push(item);
			}

			const seen = new Set();
			const filteredResult = result.filter(value => {
				if (seen.has(value.runId)) {
					return false;
				}
				seen.add(value.runId);
				return true;
			})

			resolve(filteredResult);
		} else {
			// Top 500 scans in last 12 months
			var date = new Date();
			date.setMonth(date.getMonth() - 12);

			const entity = getTableClient(TABLE.Scans).listEntities({
				queryOptions: { filter: odata`isPrivate eq ${false} and buildDate gt datetime'${date.toISOString()}'` }
			});
			let result = []
			for await (const item of entity) {
				result.push(item);
			}

			const seen = new Set();
			const filteredResult = result.filter(value => {
				if (seen.has(value.runId)) {
					return false;
				}
				seen.add(value.runId);
				return true;
			})
			.sort((a, b) => (a.rowKey > b.rowKey) ? 1 : -1)
			.slice(0, parseInt(process.env.MAX_SCAN_SIZE));

			resolve(filteredResult);
		}
	});

exports.getSummaryById = async (runId) => {
	const doc = await getRun(runId);
	if (!doc) {
		return {};
	}

	const apiKey = doc.apikey || doc.apiKey;
	const docRunId = doc.runId || runId;

	const getSummary = async (filter) => {
		const entity = getTableClient(TABLE.Scans).listEntities({
			queryOptions: { filter }
		});
		let result = [];
		for await (const item of entity) {
			result.push(item);
		}
		return result[0];
	};

	let summary = await getSummary(`PartitionKey eq '${apiKey}-${docRunId}'`);

	if (!summary || summary.scanResultVersion !== 2) {
		summary = await getSummary(odata`PartitionKey eq ${apiKey} and runId eq ${docRunId}`);
	}

	return summary || {};
};

exports.getLatestSummaryFromUrlAndApi = (url, api) => 
	new Promise(async (resolve) => {
		// Standardize url string
		if (!url.startsWith("https://")) {
			url = "https://" + url;
		}
		if (!url.endsWith("/")) {
			url = url + '/';
		}
		
		const entity = getTableClient(TABLE.Scans).listEntities({
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
		const entity = getTableClient(TABLE.alertEmailAddresses).listEntities({
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
			const entity = getTableClient(TABLE.Scans).listEntities({
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
		const entity = getTableClient(TABLE.UnscannableLinks).listEntities();
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

		const entity = getTableClient(TABLE.Scans).listEntities({
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

exports.getCustomHtmlRuleOptions = (api, url) => 
	new Promise(async (resolve) => {
		const entity = getTableClient(TABLE.HtmlRulesCustomOptions).listEntities({
			queryOptions: { filter: odata`PartitionKey eq ${api} and url eq ${url}` }
		});
		let result = []
		for await (const item of entity) {
			result.push(item);
		}
		resolve(result || [])
	})