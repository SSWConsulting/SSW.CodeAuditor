const csv = require('csv-parser');
const fs = require('fs');
const { execSync } = require('child_process');
const chalk = require('chalk');
const fetch = require('node-fetch');
const boxen = require('boxen');
const yargs = require('yargs');
const endpoint = 'https://us-central1-sswlinkauditor-c1131.cloudfunctions.net';

const options = yargs
	.usage('Usage: -url <url>')
	.option('url', {
		describe: 'URL to scan',
		type: 'string',
		demandOption: true,
	})
	.option('token', {
		describe:
			'Dashboard token (sign up at https://sswlinkauditor-c1131.web.app/)',
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

function writeLog(...msg) {
	options.debug && console.log(...msg);
}
const main = () => {
	const startTime = new Date();
	const [result, error] = startScan(options);
	if (error) {
		writeLog(`Error running command: ${error}`);
		process.exit(1);
	}
	writeLog(`parsing output file at /home/crawls/all_inlinks.csv`);
	getErrorUrl(startTime, '/home/crawls/all_inlinks.csv');
};

const startScan = (options) => {
	writeLog(
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

	if (!fs.existsSync('/usr/bin/screamingfrogseospider')) {
		return [null, 'crawler not found'];
	}

	try {
		const comand = `screamingfrogseospider --crawl ${options.url} --headless --output-folder /home/crawls --overwrite --bulk-export "All Inlinks"`;
		writeLog(`running ${comand}`);

		return [execSync(comand), null];
	} catch (error) {
		return [null, error.message];
	}
};

const getErrorUrl = (startTime, file) => {
	const results = [];
	if (!fs.existsSync(file)) {
		writeLog('Result File Not Found');
		return;
	}

	return fs
		.createReadStream(file)
		.pipe(csv())
		.on('data', (row) => {
			results.push(row);
		})
		.on('end', async () => {
			const [took, sec] = printTimeDiff(new Date(), startTime);
			writeLog(`Took ${sec} seconds`);
			const badUrls = results
				.filter(
					(x) =>
						(x['Status Code'] === '0' ||
							x['Status Code'] === '404') &&
						x.Status !== 'Blocked by robots.txt'
				)
				.map((x) => ({
					src: x.Source,
					dst: x.Destination,
					link: x.Anchor,
					statuscode: x['Status Code'],
					statusmsg: x.Status,
				}));

			const printToConsole = (runId) => {
				if (badUrls.length === 0) {
					if (options.format.toLowerCase() === 'csv') {
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
					if (options.format.toLowerCase() === 'csv') {
						console.log(
							boxen(
								chalk.red(
									`Scanned ${results.length}, found ${
										badUrls.length
									} Bad links [${took}]${getLinkToBuild(
										runId
									)}`
								),
								getBox('red')
							)
						);
						outputBadDataCsv(badUrls);
					} else {
						// print raw JSON
						console.log(badUrls);
					}
					process.exit(1);
				}
			};

			if (options.token) {
				postData({
					totalScanned: results.length,
					scanDuration: sec,
					url: options.url,
					badUrls,
				})
					.then((runId) => printToConsole(runId))
					.catch((e) => {
						console.error(
							`Error: Unabled to push data to dashboard service => ${e.message}`
						);
						printToConsole();
					});
			} else {
				printToConsole();
			}
		});
};

const postData = (data) => {
	const url = `${endpoint}/api/scanresult/${options.token}/${
		options.buildId || 'NA'
	}`;
	writeLog(`Posting result to ${url}`, data);
	return fetch(url, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: { 'Content-Type': 'application/json' },
	}).then((res) => {
		if (res.ok) {
			return res.text();
		} else {
			return res.text().then((t) => {
				throw Error(t);
			});
		}
	});
};

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

const printTimeDiff = (t1, t2) => {
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

const getBox = (color) => ({
	padding: 1,
	margin: 1,
	borderStyle: 'round',
	borderColor: color,
});

const replaceQuote = (s) => s.replace(/"/g, '');
const getLinkToBuild = (runId) =>
	runId
		? ` => https://sswlinkauditor-c1131.web.app/build/${replaceQuote(
				runId
		  )}`
		: '';
// run
main();
