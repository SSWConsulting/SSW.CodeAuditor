const _replaceQuote = (s) => s.replace(/"/g, '');
const fs = require('fs');
const csv = require('csv-parser');

exports.getBox = (color) => ({
	padding: 1,
	margin: 1,
	borderStyle: 'round',
	borderColor: color,
});

exports.getLinkToBuild = (runId) =>
	runId
		? ` => https://sswlinkauditor.surge.sh/build/${_replaceQuote(runId)}`
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
