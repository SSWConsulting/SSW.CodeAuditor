const fs = require('fs');
const { execSync } = require('child_process');
const chalk = require('chalk');
const yargs = require('yargs');
const { getConfigs, getPerfThreshold, postData } = require('./api');
const {
	printTimeDiff,
	getPerfScore,
	diffInDaysToNow,
	getLinkToBuild,
	consoleBox,
	readCsv,
} = require('./utils');

let _args = null;
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
	const [result, error] = _startScan(options);
	_writeLog(`scan finished`, result);

	if (options.lighthouse) {
		_writeLog(`start lighthouse`);
		try {
			execSync(`lhci collect --url="${options.url}" -n 1`);
			_writeLog(`lighthouse check finished`);
		} catch (error) {
			_writeLog(`lighthouse check failed`, error);
		}
	}
	if (error) {
		_writeLog(`Error running command: ${error}`);
		process.exit(1);
	}
	_getErrorUrl(options, startTime, '/home/lhci/all_inlinks.csv');
};

const main_test = () => {
	const options = _getAgrs();
	_getErrorUrl(options, new Date(), 'sample.csv');
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

const _getErrorUrl = async (args, startTime, file) => {
	// closures
	const __getBadResults = () => {
		return results
			.filter(
				(x) =>
					(x['Status Code'] === '0' || x['Status Code'] === '404') &&
					x.Status !== 'Blocked by robots.txt' &&
					// not in global ignored
					ignoredUrls
						.filter(
							(x) =>
								x.ignoreOn === 'all' &&
								(+x.ignoreDuration === -1 ||
									diffInDaysToNow(new Date(x.effectiveFrom)) <
										+x.ignoreDuration)
						)
						.map((x) => x.urlToIgnore)
						.indexOf(x.Destination) < 0 &&
					// not in URL specific ignored
					ignoredUrls
						.filter(
							(x) =>
								+x.ignoreDuration === -1 ||
								diffInDaysToNow(new Date(x.effectiveFrom)) <
									+x.ignoreDuration
						)
						.map((x) => x.urlToIgnore)
						.indexOf(x.Destination) < 0
			)
			.map((x) => ({
				src: x.Source,
				dst: x.Destination,
				link: x.Anchor,
				statuscode: x['Status Code'],
				statusmsg: x.Status,
			}));
	};

	const __printResultsToConsole = (lh, runId, thres) => {
		let lhScaled;
		if (lh) {
			lhScaled = getPerfScore(lh);
		}

		lhScaled &&
			consoleBox(
				`AVG=${lhScaled.average.toFixed(1)} Performance=${
					lhScaled.performanceScore
				} Accessibility=${lhScaled.accessibilityScore} Best practices=${
					lhScaled.bestPracticesScore
				} SEO=${lhScaled.seoScore} PWA=${lhScaled.pwaScore}`,
				'green'
			);

		consoleBox(
			badUrls.length === 0
				? `All ${chalk.green.bold.underline(
						results.length
				  )} links returned 200 OK [${took}]`
				: `Scanned ${results.length}, found ${badUrls.length} Bad links [${took}]`,
			badUrls.length === 0 ? 'green' : 'red'
		);

		// check if
		let failedThreshold = false;
		if (lhScaled && thres) {
			if (
				(thres.performanceScore &&
					lhScaled.performanceScore < thres.performanceScore) ||
				(thres.accessibilityScore &&
					lhScaled.accessibilityScore < thres.accessibilityScore) ||
				(thres.bestPracticesScore &&
					lhScaled.bestPracticesScore < thres.bestPracticesScore) ||
				(thres.seoScore && lhScaled.seoScore < thres.seoScore) ||
				(thres.pwaScore && lhScaled.pwaScore < thres.pwaScore) ||
				(thres.average && lhScaled.average < thres.average)
			) {
				consoleBox(
					`! FAILED required threshold: AVG=${thres.average.toFixed(
						1
					)} Performance=${thres.performanceScore} Accessibility=${
						thres.accessibilityScore
					} Best practices=${thres.bestPracticesScore} SEO=${
						thres.seoScore
					} PWA=${thres.pwaScore}`,
					'red'
				);
				failedThreshold = true;
			}
		}

		if (runId) {
			// pushed to cloud, no need to output the CSV
			consoleBox(getLinkToBuild(runId), 'green');
		} else {
			if (badUrls.length > 0) {
				_outputBadDataCsv(badUrls);
			}
		}

		if (badUrls.length > 0 || failedThreshold) {
			process.exit(1);
		}
	};

	const results = await readCsv(file);

	const [took, sec] = printTimeDiff(new Date(), startTime);

	_writeLog(`Took ${sec} seconds`);
	let ignoredUrls = [];
	let perfThreshold;
	// {"urlToIgnore":"https://rules.ssw.com.au/Pages/default.aspx","ignoreDuration":7,"ignoreOn":"all", "effectiveFrom" : "2020-04-25T13:25:20.957Z"}

	// get ignored
	if (args.token) {
		try {
			ignoredUrls = await getConfigs(args.token);
			_writeLog(`Ignored URLs`, ignoredUrls);
		} catch (error) {
			console.error('failed to load settings');
		}
	}

	// get performance threshold
	if (args.token && args.lighthouse) {
		_writeLog(`getting perf threshold for `, args.url);
		try {
			perfThreshold = await getPerfThreshold(args.token, args.url);
			perfThreshold && _writeLog(`Performance Threshold`, perfThreshold);
		} catch (error) {
			console.error('failed to load perfthreshold');
		}
	}
	let lhrSummary;
	let lhr;
	let runId;
	if (args.lighthouse) {
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
					.readFileSync(`/home/lhci/src/.lighthouseci/${jsonReport}`)
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

	const badUrls = __getBadResults();

	if (args.token) {
		try {
			runId = await postData(args.token, args.buildId, {
				totalScanned: results.length,
				scanDuration: sec,
				url: args.url,
				badUrls,
				lhr,
			});
		} catch (error) {
			console.error(
				`Error: Unabled to push data to dashboard service => ${error.message}`
			);
		}
	}
	__printResultsToConsole(lhrSummary, runId, perfThreshold);
};

const _outputBadDataCsv = (records) => {
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

const _writeLog = (...msg) => _args.debug && console.log(...msg);

// run
main();
// main_test();
