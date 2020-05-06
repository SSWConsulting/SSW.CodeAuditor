const fs = require('fs');
const { execSync } = require('child_process');
const chalk = require('chalk');
const minimatch = require('minimatch');
const yargs = require('yargs');
const { getConfigs, getPerfThreshold, postData } = require('./api');
const {
	printTimeDiff,
	getPerfScore,
	diffInDaysToNow,
	getLinkToBuild,
	consoleBox,
	readCsv,
	outputBadDataCsv,
} = require('./utils');

let _args = null;
let _cloc;
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
			describe:
				'Dashboard token (sign up at https://sswlinkauditor.surge.sh/)',
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
		.option('cloc', {
			describe: 'Count lines of codes',
			type: 'boolean',
			default: false,
		})
		.option('whitelist', {
			describe: 'List of URL glob pattern to Ignore in CSV format',
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

const main = () => {
	const options = _getAgrs();
	const startTime = new Date();

	if (options.cloc) {
		const [result, error] = _countLineOfCodes();
		if (error) {
			_writeLog(`Error running command: ${error}`);
			process.exit(1);
		}
		_cloc = result;
		consoleBox(
			`Codes: Files=${result.header.n_files} Lines=${result.header.n_lines}`,
			'green'
		);
	}
	const [result, error] = _startScan(options);
	_writeLog(`scan finished`, result);

	if (options.lighthouse) {
		_writeLog(`start lighthouse`);
		try {
			execSync(`lhci collect --url="${options.url}" -n 1`);
			_writeLog(`lighthouse check finished`);
		} catch (e) {
			_writeLog(`lighthouse check failed`, e);
		}
	}
	if (error) {
		_writeLog(`Error running command: ${error}`);
		process.exit(1);
	}
	_processAndUpload(options, startTime, '/home/lhci/all_inlinks.csv');
};

const _startScan = (options) => {
	_writeLog(chalk.yellowBright(`Scanning ${chalk.green(options.url)}`));

	try {
		const comand = `screamingfrogseospider --crawl ${options.url} --headless --output-folder /home/lhci --overwrite --bulk-export "All Inlinks"`;
		return [execSync(comand).toString(), null];
	} catch (error) {
		return [null, error.message];
	}
};

const _countLineOfCodes = () => {
	_writeLog(chalk.yellowBright(`Counting lines of codes`));

	try {
		const json = execSync(
			`cloc /home/lhci/src/root --fullpath --not-match-d node_modules --json`
		).toString();
		const d = JSON.parse(json);
		return [d, null];
	} catch (error) {
		return [null, error.message];
	}
};

const _processAndUpload = async (args, startTime, file) => {
	// Closures:
	const __getBadResults = (allUrls) => {
		return allUrls
			.filter(
				(url) =>
					(url['Status Code'] === '0' ||
						url['Status Code'] === '404') &&
					url.Status !== 'Blocked by robots.txt'
			)
			.map((x) => ({
				src: x.Source,
				dst: x.Destination,
				link: x.Anchor,
				statuscode: x['Status Code'],
				statusmsg: x.Status,
			}));
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
		matchedIgnored
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
			if (badLinks.length > 0) {
				outputBadDataCsv(badLinks);
			}
		}

		if (badLinks.length > 0 || failedThreshold) {
			consoleBox(
				`AUDIT FAIL${badLinks.length > 0 ? ' [Broken Links]' : ''}${
					failedThreshold ? ' [Performance]' : ''
				}`,
				'red'
			);
			process.exit(1);
		}
	};
	// closures ends

	let ignoredUrls;
	let perfThreshold;
	let lhrSummary;
	let lhr;
	let runId;

	const results = await readCsv(file);

	const [took, sec] = printTimeDiff(new Date(), startTime);

	_writeLog(`Took ${sec} seconds`);

	// retrieve information about the token
	if (args.token) {
		_writeLog(`Retrieving config for token`, args.token);

		try {
			ignoredUrls = await getConfigs(args.token);
			_writeLog(`Ignored URLs`, ignoredUrls);
		} catch (error) {
			console.error('failed to load settings');
		}

		if (args.lighthouse) {
			_writeLog(`getting perf threshold for `, args.url);
			try {
				perfThreshold = await getPerfThreshold(args.token, args.url);
				perfThreshold &&
					_writeLog(`Performance Threshold`, perfThreshold);
			} catch (error) {
				console.error('failed to load perfthreshold');
			}

			_writeLog(`Reading Lighthouse report file`);
			let lhFiles = fs.readdirSync('/home/lhci/src/.lighthouseci/');
			if (lhFiles.filter((x) => x.endsWith('.json')).length > 0) {
				const jsonReport = lhFiles
					.filter((x) => x.endsWith('.json'))
					.splice(-1)[0];

				_writeLog(
					`Include Lighthouse report in the payload as well: ${jsonReport}`
				);

				lhr = JSON.parse(
					fs
						.readFileSync(
							`/home/lhci/src/.lighthouseci/${jsonReport}`
						)
						.toString()
				);

				lhrSummary = {
					performanceScore: lhr.categories.performance.score,
					accessibilityScore: lhr.categories.accessibility.score,
					bestPracticesScore: lhr.categories['best-practices'].score,
					seoScore: lhr.categories.seo.score,
					pwaScore: lhr.categories.pwa.score,
				};
			}
			_writeLog(`Lighthouse reports output`, lhFiles);
		}
	}

	const allBadUrls = __getBadResults(results);
	let whiteListed = [];
	if (ignoredUrls && ignoredUrls.length > 0) {
		_writeLog('There are whitelisted URLs configured in online');
		whiteListed = __getUniqIgnoredUrls(allBadUrls, ignoredUrls);
	}

	if (args.whitelist) {
		_writeLog('Got the whitelist from command ARGs');
		// .filter((ignorePattern) => minimatch(url, ignorePattern))
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
	_writeLog('Url found in WhiteList are', whiteListed);
	const badUrls = allBadUrls.filter((x) => whiteListed.indexOf(x.dst) < 0);

	if (args.token) {
		try {
			runId = await postData(args.token, args.buildId, {
				totalScanned: results.length,
				scanDuration: sec,
				url: args.url,
				badUrls,
				whiteListed,
				lhr,
				cloc: _cloc
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
		whiteListed
	);
};

// utils

const _writeLog = (...msg) => _args.debug && console.log(...msg);

// run
main();
// main_test();
