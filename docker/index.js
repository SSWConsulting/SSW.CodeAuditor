const csv = require('csv-parser');
const fs = require('fs');
const { execSync } = require('child_process');
const chalk = require('chalk');
const boxen = require('boxen');
const yargs = require('yargs');
const { getConfigs, postData } = require('./api');
const {
	printTimeDiff,
	diffInDaysToNow,
	getBox,
	getLinkToBuild,
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
		.option('format', {
			describe: 'Output format: csv | json',
			type: 'string',
			default: 'csv',
		}).argv;
	return _args;
};

const main = () => {
	const options = _getAgrs();
	const startTime = new Date();
	const [result, error] = _startScan(options);
	if (error) {
		_writeLog(`Error running command: ${error}`);
		process.exit(1);
	}
	_getErrorUrl(options, startTime, '/home/crawls/all_inlinks.csv');
};

const main_test = () => {
	const options = _getAgrs();
	_getErrorUrl(options, new Date(), 'sample.csv');
};

const _startScan = (options) => {
	_writeLog(
		chalk.yellowBright(
			`Scanning ${chalk.green(
				options.url
			)} with Javascript Rendered Page option turned ${
				options.spa
					? chalk.red.bold('On')
					: chalk.greenBright.bold('Off')
			}`
		)
	);

	try {
		const comand = `screamingfrogseospider --crawl ${options.url} --headless --output-folder /home/crawls --overwrite --bulk-export "All Inlinks"`;
		return [execSync(comand), null];
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
								diffInDaysToNow(new Date(x.effectiveFrom)) <
									+x.ignoreDuration
						)
						.map((x) => x.urlToIgnore)
						.indexOf(x.Destination) < 0 &&
					// not in URL specific ignored
					ignoredUrls
						.filter(
							(x) =>
								x.ignoreOn === args.url &&
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

	const __printResultsToConsole = (runId) => {
		if (badUrls.length === 0) {
			if (args.format.toLowerCase() === 'csv') {
				console.log(
					boxen(
						chalk.green(
							`All ${chalk.green.bold.underline(
								results.length
							)} links returned 200 OK [${took}]${getLinkToBuild(
								runId
							)}`
						),
						getBox('green')
					)
				);
			} else {
				console.log([]);
			}
		} else {
			// we have some failure
			if (args.format.toLowerCase() === 'csv') {
				console.log(
					boxen(
						chalk.red(
							`Scanned ${results.length}, found ${
								badUrls.length
							} Bad links [${took}]${getLinkToBuild(runId)}`
						),
						getBox('red')
					)
				);
				_outputBadDataCsv(badUrls);
			} else {
				// print raw JSON
				console.log(badUrls);
			}
			process.exit(1);
		}
	};

	const results = await readCsv(file);

	const [took, sec] = printTimeDiff(new Date(), startTime);

	_writeLog(`Took ${sec} seconds`);
	let ignoredUrls = [];
	// {"urlToIgnore":"https://rules.ssw.com.au/Pages/default.aspx","ignoreDuration":7,"ignoreOn":"all", "effectiveFrom" : "2020-04-25T13:25:20.957Z"}

	if (args.token) {
		try {
			ignoredUrls = await getConfigs(args.token);
			_writeLog(`Ignored URLs`, ignoredUrls);
		} catch (error) {
			console.error('failed to load settings');
		}
	}

	const badUrls = __getBadResults();

	if (args.token) {
		try {
			const runId = await postData(args.token, args.buildId, {
				totalScanned: results.length,
				scanDuration: sec,
				url: args.url,
				badUrls,
			});
			__printResultsToConsole(runId);
		} catch (error) {
			console.error(
				`Error: Unabled to push data to dashboard service => ${error.message}`
			);
			__printResultsToConsole();
		}
	} else {
		__printResultsToConsole();
	}
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
