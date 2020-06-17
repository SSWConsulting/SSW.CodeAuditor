const _replaceQuote = (s) => s.replace(/"/g, '');
const fs = require('fs');
const csv = require('csv-parser');
const chalk = require('chalk');
const boxen = require('boxen');

exports.consoleBox = (text, color) =>
	console.log(
		boxen(chalk[color](text), {
			padding: 1,
			margin: 1,
			borderStyle: 'single',
			borderColor: color,
		})
	);

exports.getLinkToBuild = (runId) =>
	runId
		? `Report URL => https://codeauditor.com/build/${_replaceQuote(
				runId
		  )}`
		: '';

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

exports.diffInDaysToNow = (d) => Math.floor((new Date() - d) / 1000 / 86400);

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

exports.getPerfScore = (value) => ({
	performanceScore: Math.round(value.performanceScore * 100),
	pwaScore: Math.round(value.pwaScore * 100),
	seoScore: Math.round(value.seoScore * 100),
	accessibilityScore: Math.round(value.accessibilityScore * 100),
	bestPracticesScore: Math.round(value.bestPracticesScore * 100),
	average: Math.round(
		((value.performanceScore +
			value.seoScore +
			value.bestPracticesScore +
			value.accessibilityScore +
			value.pwaScore) /
			5) *
			100
	),
});

exports.outputBadDataCsv = (records) => {
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


exports.HTMLERRORS = [
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
