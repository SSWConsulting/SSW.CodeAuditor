const options = {
	url: `https://asia-northeast1-sswlinkauditor-c1131.cloudfunctions.net/api/scanresult/${bundle.authData.api_key}`,
	method: 'GET',
	headers: {
		Accept: 'application/json',
		'X-API-KEY': bundle.authData.api_key,
	},
	params: {
		api_key: bundle.authData.api_key,
	},
};

return z.request(options).then((response) => {
	response.throwForStatus();
	const results = response.json;
	return results
		.filter((x) => x.totalBrokenLinks > 0)
		.map((x) => {
			return {
				id: x.RowKey,
				runId: x.runId,
				buildDate: x.buildDate,
				totalScanned: x.totalScanned,
				scanDuration: x.scanDuration,
				url: x.url,
				reportUrl: `https://codeauditor.surge.sh/build/${x.runId}`,
				totalBrokenLinks: x.totalBrokenLinks,
				uniqueBrokenLinks: x.uniqueBrokenLinks,
				pagesWithBrokenLink: x.pagesWithBrokenLink,
				totalUnique404: x.totalUnique404,
			};
		});
});
