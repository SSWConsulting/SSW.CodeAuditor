const csv = require('csv-parser');
const fs = require('fs');
const { execSync } = require('child_process');
const chalk = require('chalk');
const boxen = require('boxen');
const yargs = require('yargs');

const options = yargs
	.usage('Usage: -url <url>')
	.option('url', {
		describe: 'URL to scan',
		type: 'string',
		demandOption: true,
	})
	// .option('spa', {
	// 	describe: 'Scan JS rendered page',
	// 	type: 'boolean',
	// 	default: false,
	// })
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

main();

function writeLog(msg) {
	options.debug && console.log(msg);
}
function main() {
	const [result, error] = scanNow(options);
	if (error) {
		writeLog(`Error running command: ${error}`);
		process.exit(1);
	}
	writeLog(`parsing output file at /home/crawls/all_inlinks.csv`);
	getErrorUrl('/home/crawls/all_inlinks.csv');
}

function scanNow(options) {
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
		const comand = `screamingfrogseospider --crawl ${options.url} ${
			options.spa ? ' --config spa.seospiderconfig' : ''
		} --headless --output-folder /home/crawls --overwrite --bulk-export "All Inlinks"`;
		writeLog(`running ${comand}`);

		return [execSync(comand), null];
	} catch (error) {
		return [null, error.message];
	}
}

function getErrorUrl(file) {
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
		.on('end', () => {
			const took = printTimeDiff(new Date(), start);
			const badRows = results.filter(
				(x) =>
					!x['Status Code'].startsWith('2') &&
					!x['Status Code'].startsWith('3')
			);

			if (badRows.length === 0) {
				console.log(
					boxen(
						chalk.green(
							`All ${chalk.green.bold.underline(
								results.length
							)} links returned 200 OK [${took}]`
						),
						{
							padding: 1,
							margin: 1,
							borderStyle: 'round',
							borderColor: 'green',
						}
					)
				);
			} else {
				console.log(
					boxen(
						chalk.red(
							`Scanned ${results.length}, found ${badRows.length} Bad links [${took}]`
						),
						{
							padding: 1,
							margin: 1,
							borderStyle: 'round',
							borderColor: 'red',
						}
					)
				);
				if (options.format.toLowerCase() === 'csv') {
					outputBadData(badRows);
				} else {
					console.log(
						badRows.map((x) => ({
							src: x.Source,
							dest: x.Destination,
							rspCode: x['Status Code'],
							status: x.Status,
							anchorText: x.Anchor,
						}))
					);
				}
				process.exit(1);
			}
		});
}

function outputBadData(records) {
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
}

function printTimeDiff(t1, t2) {
	var dif = t1 - t2;
	const took =
		Math.floor(dif / 1000 / 60)
			.toString()
			.padStart(2, '0') +
		':' +
		(dif % 60).toString().padStart(2, '0');
	return took;
}
