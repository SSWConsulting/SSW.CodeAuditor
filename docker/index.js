const fs = require('fs');
const { execSync } = require('child_process');
const chalk = require('chalk');
const minimatch = require('minimatch');
const yargs = require('yargs');
const R = require('ramda');
const {
	htmlHintConfig,
	getConfigs,
	getPerfThreshold,
	postData,
	fetchHtml,
} = require('./api');
const {
	printTimeDiff,
	getPerfScore,
	diffInDaysToNow,
	getLinkToBuild,
	consoleBox,
	readCsv,
	outputBadDataCsv,
	HTMLERRORS,
} = require('./utils');

let _args = {};
let _cloc;
let _codeAuditor = [];

const _getAgrs = () => {
	_args = yargs
		.usage('Usage: -url <url>')
		.option('url', {
			describe: 'URL to scan',
			type: 'string',
			demandOption: true,
		})
		.option('token', {
			alias: 't',
			describe: 'Dashboard token (sign up at https://codeauditor.com/)',
			type: 'string',
			demandOption: false,
		})
		.option('buildId', {
			describe: 'Build/Run number, e.g. CI Build number',
			type: 'string',
			demandOption: false,
		})
		.option('debug', {
			describe: 'Turn on debug mode',
			type: 'boolean',
			default: false,
		})
		.option('htmlhint', {
			describe: 'Run html audit using htmlhint',
			type: 'boolean',
			default: true,
		})
		.option('linkcheck', {
			describe: 'Check for broken links',
			type: 'boolean',
			default: true,
		})
		.option('whitelist', {
			describe: 'List of URL glob pattern to Ignore in CSV format',
			type: 'string',
			demandOption: false,
		})
		.option('ignorefile', {
			describe: 'static Code Auditor ignore file',
			type: 'string',
			demandOption: false,
		})
		.option('rules', {
			describe: 'folder containing the rules to check',
			type: 'string',
			demandOption: false,
		})
		.option('lighthouse', {
			describe: 'Include Lighthouse audit',
			type: 'boolean',
			default: false,
		}).argv;
	return _args;
};

const main = async () => {
	const options = _getAgrs();
	const startTime = new Date();

	if (fs.readdirSync('./src').length > 0) {
		const [result, error] = countLineOfCodes();
		if (error) {
			writeLog(`Error running CLOC command: ${error}`);
			process.exit(1);
		}
		_cloc = result;

		const [resultCode, errorCode] = runCodeAuditor(
			options.ignorefile,
			options.rules
		);
		if (errorCode) {
			writeLog(`Error running SSWCodeAuditor command: ${error}`);
		}
		writeLog(resultCode);

		_codeAuditor = resultCode;
		let codeSummary = '';
		if (_codeAuditor) {
			const errors = _codeAuditor.filter((x) => !!x.error);
			const warns = _codeAuditor.filter((x) => !x.error);
			codeSummary = ` Errors=${errors.length} Warnings=${warns.length}`;
		}
		consoleBox(
			`Codes: Files=${result.header.n_files} Lines=${result.header.n_lines}${codeSummary}`,
			'green'
		);
	}

	const [result, error] = startScan(options);
	writeLog(`scan finished`, result);

	if (
		options.lighthouse &&
		fs.existsSync('/etc/apt/sources.list.d/google.list')
	) {
		writeLog(`start lighthouse`);
		try {
			const rs = execSync(
				`./node_modules/.bin/lhci collect --url="${options.url}" -n 1`
			).toString();
			writeLog(`lighthouse check finished`, rs);
		} catch (e) {
			writeLog(`lighthouse check failed`, e);
		}
	}

	if (error) {
		writeLog(`Error running command: ${error}`);
		process.exit(1);
	}
	processAndUpload(options, startTime, './all_links.csv');
};

const startScan = (options) => {
	writeLog(chalk.yellowBright(`Scanning ${chalk.green(options.url)}`));

	try {
		const comand = `./sswlinkauditor ${options.url}`;
		return [execSync(comand).toString(), null];
	} catch (error) {
		return [null, error.message];
	}
};

const countLineOfCodes = () => {
	writeLog(chalk.yellowBright(`Counting lines of codes`));
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

const runCodeAuditor = (ignorefile, rulesfolder) => {
	writeLog(chalk.yellowBright(`run static code analysis`));
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

const runHtmlHint = async (url) => {
	writeLog(chalk.yellowBright(`Running htmlhint on ${url}`));
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

const processAndUpload = async (args, startTime, file) => {
	/**
	 ************** CLOSURES ****************
	 */
	const __getBadResults = (allUrls) => {
		return allUrls
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
	};

	const __getGoodUrls = (allUrls) => {
		const all = allUrls
			.filter(
				(url) =>
					(url.Source || '')
						.toLowerCase()
						.indexOf(args.url.toLowerCase()) >= 0
			)
			.map((x) => x.Source);
		return [...new Set(all)];
	};

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
					isInIgnoredList(url.dst, args.url, whitelistedUrls)
			)
			.map((x) => x.dst);
		return [...new Set(all)];
	};

	const __printResultsToConsole = (
		lh,
		runId,
		requiredThreshold,
		badLinks,
		matchedIgnored,
		htmlIssuesSummary,
		htmlIssues
	) => {
		let lhScaled;
		if (lh) {
			lhScaled = getPerfScore(lh);
		}

		// output Lighthouse Score Box
		lhScaled &&
			consoleBox(
				`AVG=${lhScaled.average.toFixed(1)} Performance=${
					lhScaled.performanceScore
				} Accessibility=${lhScaled.accessibilityScore} Best practices=${
					lhScaled.bestPracticesScore
				} SEO=${lhScaled.seoScore} PWA=${lhScaled.pwaScore}`,
				'green'
			);

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
				matchedIgnored.length > 0
					? `, ${matchedIgnored.length} URLs in Ignored list`
					: ''
			}`;
		consoleBox(
			badLinks.length === 0
				? `All ${chalk.green.bold.underline(
						results.length
				  )} links returned 200 OK [${took}]${_ignoreLbl()}`
				: `Scanned ${results.length}, found ${
						badLinks.length
				  } Bad links [${took}]${_ignoreLbl()}`,
			badLinks.length === 0 ? 'green' : 'red'
		);

		// check if pass perf threshold or not
		let failedThreshold = false;
		if (lhScaled && requiredThreshold) {
			if (
				(requiredThreshold.performanceScore &&
					lhScaled.performanceScore <
						requiredThreshold.performanceScore) ||
				(requiredThreshold.accessibilityScore &&
					lhScaled.accessibilityScore <
						requiredThreshold.accessibilityScore) ||
				(requiredThreshold.bestPracticesScore &&
					lhScaled.bestPracticesScore <
						requiredThreshold.bestPracticesScore) ||
				(requiredThreshold.seoScore &&
					lhScaled.seoScore < requiredThreshold.seoScore) ||
				(requiredThreshold.pwaScore &&
					lhScaled.pwaScore < requiredThreshold.pwaScore) ||
				(requiredThreshold.average &&
					lhScaled.average < requiredThreshold.average)
			) {
				consoleBox(
					`!!! FAILED Required Threshold: AVG=${requiredThreshold.average.toFixed(
						1
					)} Performance=${
						requiredThreshold.performanceScore
					} Accessibility=${
						requiredThreshold.accessibilityScore
					} Best practices=${
						requiredThreshold.bestPracticesScore
					} SEO=${requiredThreshold.seoScore} PWA=${
						requiredThreshold.pwaScore
					} !!!`,
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

			htmlIssues &&
				R.pipe(
					// restructure
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
		}

		if (
			badLinks.length > 0 ||
			failedThreshold ||
			_codeAuditor.filter((x) => !!x.error).length > 0 ||
			htmlErrors.length > 0
		) {
			consoleBox(`AUDIT FAIL`, 'red');
			process.exit(1);
		}
	};

	const __readLighthouseReport = () => {
		if (!fs.existsSync('./.lighthouseci/')) {
			console.log(
				'ERROR => No lighthouse report found. Run again with `-v "%.LIGHTHOUSECI%:/usr/app/.lighthouseci"` option'
			);
			return;
		}
		writeLog(`Reading Lighthouse report files`);
		let lhFiles = fs.readdirSync('./.lighthouseci/');
		if (lhFiles.filter((x) => x.endsWith('.json')).length > 0) {
			const jsonReport = lhFiles
				.filter((x) => x.endsWith('.json'))
				.splice(-1)[0];

			writeLog(
				`Include Lighthouse report in the payload as well: ${jsonReport}`
			);

			lhr = JSON.parse(
				fs.readFileSync(`./.lighthouseci/${jsonReport}`).toString()
			);

			lhrSummary = {
				performanceScore: lhr.categories.performance.score,
				accessibilityScore: lhr.categories.accessibility.score,
				bestPracticesScore: lhr.categories['best-practices'].score,
				seoScore: lhr.categories.seo.score,
				pwaScore: lhr.categories.pwa.score,
			};
		}
		writeLog(`Lighthouse reports output`, lhFiles);
	};

	

	const __readHtmlHint = async () => {
		const allgoodLinks = __getGoodUrls(results);
		writeLog(
			`running htmlhint on ${allgoodLinks.length} URLs under the ${args.url}`
		);

		const result = await Promise.all(
			allgoodLinks.map((x) => runHtmlHint(x))
		);

		const [summary, details] = getHtmlHintDetails(result);
		htmlIssuesSummary = summary;
		htmlIssues = details;
		writeLog('summary of html issues found', htmlIssuesSummary);
		writeLog('details of html issues', JSON.stringify(htmlIssues, null, 2));
	};

	const __processBrokenLinks = () => {
		allBadUrls = __getBadResults(results);
		if (ignoredUrls && ignoredUrls.length > 0) {
			writeLog('There are whitelisted URLs configured in online');
			whiteListed = __getUniqIgnoredUrls(allBadUrls, ignoredUrls);
		}

		if (args.whitelist) {
			writeLog('Got the whitelist from command ARGs');
			const whitelistList = args.whitelist.split(',');
			const inWhiteListFromArgs = (url) =>
				whitelistList.filter((ignorePattern) =>
					minimatch(url, ignorePattern)
				).length > 0;

			const whiteListedArgs = allBadUrls
				.filter((u) => inWhiteListFromArgs(u.dst))
				.map((x) => x.dst);

			whiteListed = whiteListed.concat(whiteListedArgs);
		}
	};
	/**
	 ************** END CLOSURES ****************
	 */

	let ignoredUrls;
	let perfThreshold;
	let lhrSummary;
	let lhr;
	let runId;
	let htmlIssuesSummary = null;
	let htmlIssues = null;
	let whiteListed = [];
	let allBadUrls = [];
	let badUrls = [];

	const results = await readCsv(file);

	const [took, sec] = printTimeDiff(new Date(), startTime);

	writeLog(`Took ${sec} seconds`);

	if (args.lighthouse) {
		__readLighthouseReport();
	}

	if (args.htmlhint) {
		await __readHtmlHint();
	}

	if (args.token) {
		writeLog(`Retrieving config for token`, args.token);

		try {
			ignoredUrls = await getConfigs(args.token);
			writeLog(`Ignored URLs`, ignoredUrls);
		} catch (error) {
			console.error('failed to load settings');
		}

		if (args.lighthouse) {
			writeLog(`getting perf threshold for `, args.url);
			try {
				perfThreshold = await getPerfThreshold(args.token, args.url);
				perfThreshold &&
					writeLog(`Performance Threshold`, perfThreshold);
			} catch (error) {
				console.error('failed to load perfthreshold');
			}
		}
	}

	if (args.linkcheck) {
		__processBrokenLinks();
		writeLog('Url found in WhiteList are', whiteListed);
		badUrls = allBadUrls.filter((x) => whiteListed.indexOf(x.dst) < 0);
	}

	if (args.token) {
		try {
			runId = await postData(args.token, args.buildId, {
				totalScanned: results.length,
				scanDuration: sec,
				url: args.url,
				badUrls,
				whiteListed,
				lhr,
				cloc: _cloc,
				code: _codeAuditor,
				htmlIssuesSummary,
				htmlIssues,
			});
		} catch (error) {
			console.error(
				`Error: Unabled to push data to dashboard service => ${error.message}`
			);
		}
	}

	__printResultsToConsole(
		lhrSummary,
		runId,
		perfThreshold,
		badUrls,
		whiteListed,
		htmlIssuesSummary,
		htmlIssues
	);
};

const writeLog = (...msg) => _args.debug && console.log(...msg);

main();
