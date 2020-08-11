const _replaceQuote = (s) => s.replace(/"/g, '');
const fs = require('fs');
const csv = require('csv-parser');
const chalk = require('chalk');
const minimatch = require('minimatch');
const boxen = require('boxen');
const { htmlHintConfig, fetchHtml } = require('./api');
const R = require('ramda');
const { execSync } = require('child_process');

const consoleBox = (text, color) =>
	console.log(
		boxen(chalk[color](text), {
			padding: 1,
			margin: 1,
			borderStyle: 'single',
			borderColor: color,
		})
	);

exports.consoleBox = consoleBox;

exports.printTimeDiff = (t1, t2) => {
	var dif = t1 - t2;
	const took =
		Math.floor(dif / 1000 / 60)
			.toString()
			.padStart(2, '0') +
		':' +
		Math.floor((dif / 1000) % 60)
			.toString()
			.padStart(2, '0');
	return [took, Math.floor(dif / 1000)];
};

const diffInDaysToNow = (d) => Math.floor((new Date() - d) / 1000 / 86400);

exports.readCsv = (file) => {
	return new Promise((resolve) => {
		const results = [];
		fs.createReadStream(file)
			.pipe(csv())
			.on('data', (row) => {
				results.push(row);
			})
			.on('end', () => resolve(results));
	});
};

/**
 * @param {array} output - Array of issues identified by Github superlinter
 */
exports.formatSuperLinterOutput = (output) => {
	const f = R.pipe(
		// group by Language Type
		R.groupBy(R.prop('linter')),
		R.converge(
			R.zipWith((k, v) => ({
				[k]: R.pipe(
					// then group by the file
					R.groupBy(R.prop('file')),
					R.converge(
						R.zipWith((k, v) => ({
							// for each file, get the location separated by semi colon
							[k]: v.map((x) => x.location).join(';'),
						})),
						[R.keys, R.values]
					),
					R.mergeAll
				)(v),
			})),
			[R.keys, R.values]
		),
		R.mergeAll
	);

	return f(output);
};

/**
 *
 * Count number of line of codes in a codebase
 */
exports.countLineOfCodes = () => {
	try {
		const json = execSync(
			`./node_modules/.bin/cloc src --fullpath --not-match-d node_modules --json`
		).toString();
		const d = JSON.parse(json);
		return [d, null];
	} catch (error) {
		return [null, error.message];
	}
};

/**
 * Run custom static code analysis using the provided rules folder and ignore files
 * @param {string} ignorefile
 * @param {string} rulesfolder
 */
exports.runCodeAuditor = (ignorefile, rulesfolder) => {
	try {
		const ignoreParams = ignorefile ? ` -I ./src/${ignorefile} ` : '';
		const rulesFolderParams = rulesfolder
			? ` -R ./src/${rulesfolder} `
			: '';
		const json = execSync(
			`./node_modules/.bin/sswcodeauditor ./src ${ignoreParams} ${rulesFolderParams} --json`
		).toString();
		const d = JSON.parse(json);
		return [d, null];
	} catch (error) {
		return [null, error.message];
	}
};

/**
 * Send GET request and then perform HTML Hint check on it
 * @param {string} url - URL to scan
 */
const runHtmlHint = async (url) => {
	const HTMLHint = require('htmlhint').default;

	try {
		const html = await fetchHtml(url);
		return R.pipe(
			(html) => HTMLHint.verify(html, htmlHintConfig),
			R.map((x) => {
				delete x.evidence;
				delete x.message;
				delete x.raw;
				const error = {
					...x,
					ruleName: x.rule.id,
					url,
				};
				delete error.rule;
				return error;
			})
		)(html);
	} catch (error) {
		return null;
	}
};

/**
 * Return simplified JSON object representing all issues identified by HtmlHint
 * @param {Array} result - output array from HTMLHint
 */
const getHtmlHintDetails = (result) => {
	const getSummarizedErrors = R.pipe(
		R.flatten,
		R.filter((x) => !!x),
		R.groupBy((x) => x.ruleName),
		R.map((x) => ({
			type: x[0].type,
			count: x.length,
			example: x[0],
		}))
	);

	const getDetailsErrorsOnUrl = R.pipe(
		R.pipe(
			R.flatten,
			R.filter((x) => !!x),
			R.groupBy(R.prop('url'))
		),
		R.converge(
			R.zipWith((k, v) => ({
				url: k,
				errors: R.pipe(
					R.map((e) => ({
						loc: `${e.line}:${e.col}`,
						errorType: e.ruleName,
					})),
					R.groupBy(R.prop('errorType')),
					R.converge(
						R.zipWith((k, v) => ({
							[k]: v.map((u) => u.loc),
						})),
						[R.keys, R.values]
					),
					R.reduce((a, b) => {
						const key = Object.keys(b)[0];
						return { ...a, [key]: b[key] };
					}, {})
				)(v),
			})),
			[R.keys, R.values]
		)
	);

	return [getSummarizedErrors(result), getDetailsErrorsOnUrl(result)];
};

/**
 * Check for broken links
 * @param {string} url - URL to check for broken link
 * @param {number} maxthread - Number of concurrent threads
 */
exports.runBrokenLinkCheck = (url, maxthread) => {
	try {
		const comand = maxthread
			? `./sswlinkauditor ${url} ${maxthread}`
			: `./sswlinkauditor ${url}`;
		return [execSync(comand).toString(), null];
	} catch (error) {
		return [null, error.message];
	}
};

/**
 * parse Lighthouse Report
 * @param {string} folder - .lighthouseci folder
 * @param {func} writeLog - logging method
 */
exports.readLighthouseReport = (folder, writeLog) => {
	if (!fs.existsSync(folder)) {
		console.log(
			'ERROR => No lighthouse report found. Run again with `-v "%.LIGHTHOUSECI%:/usr/app/.lighthouseci"` option'
		);
		return [null, null];
	}

	writeLog(`Reading Lighthouse report files`);
	let lhFiles = fs.readdirSync(folder);

	if (lhFiles.filter((x) => x.endsWith('.json')).length === 0) {
		return [null, null];
	}

	const jsonReport = lhFiles.filter((x) => x.endsWith('.json')).splice(-1)[0];
	const lhr = JSON.parse(
		fs.readFileSync(`${folder}${jsonReport}`).toString()
	);

	const lhrSummary = {
		performanceScore: lhr.categories.performance.score,
		accessibilityScore: lhr.categories.accessibility.score,
		bestPracticesScore: lhr.categories['best-practices'].score,
		seoScore: lhr.categories.seo.score,
		pwaScore: lhr.categories.pwa.score,
	};
	return [lhr, lhrSummary];
};

/**
 * Run HTML Hint on all successfull URLs
 * @param {string} startUrl - URL being scanned
 * @param {array} scannedUrls - list of all scanned URLs
 * @param {func} writeLog - write log function
 */
exports.runHtmlHint = async (startUrl, scannedUrls, writeLog) => {
	const __getGoodUrls = (allUrls) => {
		const all = allUrls
			.filter(
				(url) =>
					(url.Source || '')
						.toLowerCase()
						.indexOf(startUrl.toLowerCase()) >= 0
			)
			.map((x) => x.Source);
		return [...new Set(all)];
	};

	const allgoodLinks = __getGoodUrls(scannedUrls);
	writeLog(`running htmlhint on ${allgoodLinks.length} URLs`);

	const result = await Promise.all(allgoodLinks.map((x) => runHtmlHint(x)));

	const [summary, details] = getHtmlHintDetails(result);
	writeLog('summary of html issues found', summary);
	writeLog('details of html issues', JSON.stringify(details, null, 2));
	return [summary, details];
};

/**
 * Get the list of broken links taking into account the configured White list
 * @param {string} startUrl - URL being scanned
 * @param {array} scannedUrls - list of all scanned URLs
 * @param {array} ignoredUrls - list of ignored URLs configured on the Portal
 * @param {func} writeLog - writelog function
 * @param {string} whitelist - CSV list of whitelist URLs provided via CLI
 */
exports.processBrokenLinks = (
	startUrl,
	scannedUrls,
	ignoredUrls,
	writeLog,
	whitelist
) => {
	const __getBadResults = (allUrls) =>
		allUrls
			.filter(
				(url) =>
					url['Status Code'] === '0' || url['Status Code'] === '404'
			)
			.map((x) => ({
				src: x.Source,
				dst: x.Destination,
				link: x.Anchor,
				statuscode: x['Status Code'],
				statusmsg: x.Status,
			}));

	const __getUniqIgnoredUrls = (badUrls, whitelistedUrls) => {
		// check the scan URL, effective DATE and pattern match
		const isInIgnoredList = (url, ignoreOn) => {
			return (
				whitelistedUrls
					.filter(
						(ig) =>
							ig.ignoreOn === ignoreOn &&
							(+ig.ignoreDuration === -1 ||
								diffInDaysToNow(new Date(ig.effectiveFrom)) <
									+ig.ignoreDuration)
					)
					.map((ig) => ig.urlToIgnore)
					.filter((ignorePattern) => minimatch(url, ignorePattern))
					.length > 0
			);
		};

		// return the URL only
		const all = badUrls
			.filter(
				(url) =>
					isInIgnoredList(url.dst, 'all', whitelistedUrls) ||
					isInIgnoredList(url.dst, startUrl, whitelistedUrls)
			)
			.map((x) => x.dst);
		return [...new Set(all)];
	};

	let allBadUrls = __getBadResults(scannedUrls);
	let whiteListed = [];

	if (ignoredUrls && ignoredUrls.length > 0) {
		writeLog('There are whitelisted URLs configured in online');
		whiteListed = __getUniqIgnoredUrls(allBadUrls, ignoredUrls);
	}

	if (whitelist) {
		writeLog('Got the whitelist from command line');
		const whitelistList = whitelist.split(',');
		const inWhiteListFromArgs = (url) =>
			whitelistList.filter((ignorePattern) =>
				minimatch(url, ignorePattern)
			).length > 0;

		const whiteListedArgs = allBadUrls
			.filter((u) => inWhiteListFromArgs(u.dst))
			.map((x) => x.dst);

		whiteListed = whiteListed.concat(whiteListedArgs);
	}
	return [allBadUrls, whiteListed];
};

const HTMLERRORS = [
	'attr-no-duplication',
	'attr-lowercase',
	'attr-value-double-quotes',
	'doctype-first',
	'id-unique',
	'src-not-empty',
	'tag-pair',
	'tagname-lowercase',
	'title-require',
];

const getLinkToBuild = (runId) =>
	runId
		? `Report URL => https://codeauditor.com/build/${_replaceQuote(runId)}`
		: '';

const outputBadDataCsv = (records) => {
	const createCsvStringifier = require('csv-writer')
		.createObjectCsvStringifier;

	const csvStringifier = createCsvStringifier({
		alwaysQuote: true,
		header: [
			{ id: 'src', title: 'Source' },
			{ id: 'dst', title: 'Destination' },
			{ id: 'link', title: 'Anchor' },
			{ id: 'statuscode', title: 'Status Code' },
			{ id: 'statusmsg', title: 'Status' },
		],
	});
	console.log(`"Source","Destination","Anchor","Status Code","Status"`);
	console.log(csvStringifier.stringifyRecords(records));
};

/**
 * Print to console the list of HTML hint issues found
 * @param {Array} htmlIssues - HtmlHint issues array
 */
const printHtmlIssuesToConsole = (htmlIssues) => {
	R.pipe(
		// restructure the output of the HTMLHint
		R.map(
			R.applySpec({
				url: R.prop('url'),
				errors: R.pipe(
					R.identity,
					R.pipe(
						R.prop('errors'),
						R.converge(
							R.zipWith((x, y) => ({
								error: x,
								locations: y,
							})),
							[R.keys, R.values]
						)
					)
				),
			})
		),
		R.tap(() => consoleBox('List of HTML Issues', 'red')),
		R.pipe(
			R.forEach((x) => {
				console.log(`${x.url}`);
				R.pipe(
					R.prop('errors'),
					R.forEach((error) => {
						console.log(`${error.error}`);
						R.pipe(
							R.prop('locations'),
							R.forEach(console.log)
						)(error);
						console.log('');
					})
				)(x);
			})
		)
	)(htmlIssues);
};

/**
 * Print all result to console
 * @param {array} scannedUrls - all scanned URLs
 * @param {array} lh - lighthouse data
 * @param {string} runId - Run Id
 * @param {object} reqThreshold - required threshold param
 * @param {array} badLinks - list of broken links
 * @param {array} ignored - list of matched ignore URLs
 * @param {object} htmlIssuesSummary - Html Issue Summary
 * @param {array} htmlIssues - Html Issues Details
 * @param {array} codeAuditorIssues - List of Code Auditor Issues
 * @param {string} duration - durations
 */
exports.printResultsToConsole = (
	scannedUrls,
	lh,
	runId,
	reqThreshold,
	badLinks,
	ignored,
	htmlIssuesSummary,
	htmlIssues,
	codeAuditorIssues,
	duration
) => {
	let lhScaled;

	if (lh) {
		// output Lighthouse Score Box
		lhScaled = {
			performanceScore: Math.round(lh.performanceScore * 100),
			pwaScore: Math.round(lh.pwaScore * 100),
			seoScore: Math.round(lh.seoScore * 100),
			accessibilityScore: Math.round(lh.accessibilityScore * 100),
			bestPracticesScore: Math.round(lh.bestPracticesScore * 100),
			average: Math.round(
				((lh.performanceScore +
					lh.seoScore +
					lh.bestPracticesScore +
					lh.accessibilityScore +
					lh.pwaScore) /
					5) *
					100
			),
		};
		consoleBox(
			`AVG=${lhScaled.average.toFixed(1)} Performance=${
				lhScaled.performanceScore
			} Accessibility=${lhScaled.accessibilityScore} Best practices=${
				lhScaled.bestPracticesScore
			} SEO=${lhScaled.seoScore} PWA=${lhScaled.pwaScore}`,
			'green'
		);
	}

	// output htmlhint summary
	const getSummaryText = R.pipe(
		R.converge(
			R.zipWith((x, y) => ({
				error: x,
				count: y.count,
			})),
			[R.keys, R.values]
		),
		R.map(
			(x) =>
				`${x.error} ${
					HTMLERRORS.indexOf(x.error) >= 0 ? '(Error)' : ''
				}:${x.count}`
		),
		R.join(', ')
	);

	const getHtmlHintErrors = R.pipe(
		R.keys,
		R.filter((x) => HTMLERRORS.indexOf(x) >= 0)
	);

	htmlIssuesSummary &&
		consoleBox(
			'HtmlHint issues: ' + getSummaryText(htmlIssuesSummary),
			'red'
		);

	let htmlErrors = htmlIssuesSummary
		? getHtmlHintErrors(htmlIssuesSummary)
		: [];

	// output broken links reports
	const _ignoreLbl = () =>
		`${
			ignored.length > 0
				? `, ${ignored.length} URLs in Ignored list`
				: ''
		}`;

	consoleBox(
		badLinks.length === 0
			? `All ${chalk.green.bold.underline(
					scannedUrls.length
			  )} links returned 200 OK [${duration}]${_ignoreLbl()}`
			: `Scanned ${scannedUrls.length}, found ${
					badLinks.length
			  } Bad links [${duration}]${_ignoreLbl()}`,
		badLinks.length === 0 ? 'green' : 'red'
	);

	// check if pass perf threshold or not
	let failedThreshold = false;
	if (lhScaled && reqThreshold) {
		if (
			(reqThreshold.performanceScore &&
				lhScaled.performanceScore <
					reqThreshold.performanceScore) ||
			(reqThreshold.accessibilityScore &&
				lhScaled.accessibilityScore <
					reqThreshold.accessibilityScore) ||
			(reqThreshold.bestPracticesScore &&
				lhScaled.bestPracticesScore <
					reqThreshold.bestPracticesScore) ||
			(reqThreshold.seoScore &&
				lhScaled.seoScore < reqThreshold.seoScore) ||
			(reqThreshold.pwaScore &&
				lhScaled.pwaScore < reqThreshold.pwaScore) ||
			(reqThreshold.average &&
				lhScaled.average < reqThreshold.average)
		) {
			consoleBox(
				`!!! FAILED Required Threshold: AVG=${reqThreshold.average.toFixed(
					1
				)} Performance=${
					reqThreshold.performanceScore
				} Accessibility=${
					reqThreshold.accessibilityScore
				} Best practices=${reqThreshold.bestPracticesScore} SEO=${
					reqThreshold.seoScore
				} PWA=${reqThreshold.pwaScore} !!!`,
				'red'
			);
			failedThreshold = true;
		}
	}

	if (runId) {
		// pushed to cloud, no need to output the CSV
		consoleBox(getLinkToBuild(runId), 'green');
	} else {
		badLinks.length && outputBadDataCsv(badLinks);

		if (htmlIssues) {
			printHtmlIssuesToConsole(htmlIssues);
		}
	}

	if (
		badLinks.length > 0 ||
		failedThreshold ||
		codeAuditorIssues.filter((x) => !!x.error).length > 0 ||
		htmlErrors.length > 0
	) {
		consoleBox(`AUDIT COMPLETE`, 'red');
		process.exit(1);
	}
};
