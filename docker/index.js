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
	const [result, error] = startScan(options);
	if (error) {
		writeLog(`Error running command: ${error}`);
		process.exit(1);
	}
	writeLog(`parsing output file at /home/crawls/all_inlinks.csv`);
	getErrorUrl('/home/crawls/all_inlinks.csv');
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

const getErrorUrl = (file) => {
	const results = [];
	if (!fs.existsSync(file)) {
		writeLog('Result File Not Found');
		return;
	}

	const start = new Date();
	return fs
		.createReadStream(file)
		.pipe(csv())
		.on('data', (row) => {
			results.push(row);
		})
		.on('end', async () => {
			const [took, sec] = printTimeDiff(new Date(), start);
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

			const printToConsole = () => {
				if (badUrls.length === 0) {
					// no failure
					if (options.format.toLowerCase() === 'csv') {
						console.log(
							boxen(
								chalk.green(
									`All ${chalk.green.bold.underline(
										results.length
									)} links returned 200 OK [${took}]`
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
									`Scanned ${results.length}, found ${badUrls.length} Bad links [${took}]`
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
					badUrls: badUrls.map((x) => ({
						src: x.Source,
						dst: x.Destination,
						link: x.Anchor,
						statuscode: x['Status Code'],
						statusmsg: x.Status,
					})),
				}).then(printToConsole);
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
	})
		.then((res) => writeLog(`Got Response ${res.text()}`))
		.catch((e) => writeLog(`failed posting data ${e}`));
};

const outputBadDataCsv = (records) => {
	const createCsvStringifier = require('csv-writer')
		.createObjectCsvStringifier;

	const csvStringifier = createCsvStringifier({
		alwaysQuote: true,
		header: [
			{ id: 'Source', title: 'Source' },
			{ id: 'Destination', title: 'Destination' },
			{ id: 'Anchor', title: 'Anchor' },
			{ id: 'Status Code', title: 'Status Code' },
			{ id: 'Status', title: 'Status' },
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
		(dif % 60).toString().padStart(2, '0');
	return [took, Math.floor(dif / 1000)];
};

const getBox = (color) => ({
	padding: 1,
	margin: 1,
	borderStyle: 'round',
	borderColor: color,
});

// run
main();
