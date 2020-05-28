#!/usr/bin/env node

const parser = require('parser-front-matter');
const fs = require('fs');
const path = require('path');
const R = require('ramda');
const minimatch = require('minimatch');
const strip = require('strip-comments');
const glob = require('glob');
const chalk = require('chalk');
const asTable = require('as-table');
const boxen = require('boxen');
const results = [];
const yargs = require('yargs');

const getLine = (code, index) => {
	const c = code.substr(0, index);
	return c.split('\n').length;
};

const cleanCode = R.pipe(strip);

const printTimeDiff = (t1, t2) => {
	var dif = t1 - t2;
	const took = '';
	Math.floor(dif / 1000 / 60)
		.toString()
		.padStart(2, '0') +
		':' +
		Math.floor((dif / 1000) % 60)
			.toString()
			.padStart(2, '0');
	return [
		Math.floor(dif / 1000) ? took : `${dif}ms`,
		Math.floor(dif / 1000),
		dif,
	];
};

const getGlobalGlobPattern = R.pipe(
	R.map(R.pipe(R.prop('fileFilter'), R.split(';'))),
	R.flatten,
	R.uniq,
	R.join(','),
	(x) => `**/{${x}}`
);

const fileMatchExtension = (file) =>
	R.pipe(
		R.split(';'),
		R.any((x) => minimatch(file, `./**/${x}`))
	);

const args = yargs
	.usage('Usage: sswcodeauditor src [options]')
	.option('ignore', {
		alias: 'I',
		describe:
			'.gitignore file location, use current location .gitignore file if found',
		type: 'string',
		demandOption: false,
	}).argv;

const rootFolder = args._[0] || '.';
const rules = fs.readdirSync(path.join(__dirname, '../rules/'));
let ignoreF = args.ignore
	? args.ignore
	: fs.existsSync(`${rootFolder}/.gitignore`)
	? `${rootFolder}/.gitignore`
	: null;

let ignoredFiles = [];
if (ignoreF) {
	const ignoreFile = fs.readFileSync(ignoreF).toString();
	ignoredFiles = ignoreFile
		.split('\r\n')
		.filter((l) => l.trim().length > 0 && !l.trim().match('^(#|!)'))
		.map((x) => x.trim())
		.map((x) => `./{,**}/${x}`)
		.map((x) => (x.endsWith('/') ? `${x}**` : x));
}

// read rule from Rules folder
let allRules = [];
for (let index = 0; index < rules.length; index++) {
	const rule = rules[index];
	const ruleMd = fs
		.readFileSync(path.join(__dirname, `../rules/${rule}`))
		.toString();
	const parsed = parser.parseSync(ruleMd).data;
	allRules.push(parsed);
}

const globPattern = getGlobalGlobPattern(allRules);
const files = glob.sync(`${rootFolder}/${globPattern}`, {
	ignore: ignoredFiles,
});
console.log(
	chalk.yellowBright(`Found ${files.length} files matching `, globPattern)
);

let totalFiles = 0;
let startTime = new Date();
for (let u = 0; u < files.length; u++) {
	const file = files[u];
	totalFiles++;

	for (let index = 0; index < allRules.length; index++) {
		const parsed = allRules[index];

		if (!fileMatchExtension(file)(parsed.fileFilter)) {
			continue;
		}

		const code = fs.readFileSync(file).toString();
		const re = new RegExp(parsed.regex, 'g');
		let m = re.exec(cleanCode(code));

		if (m) {
			while (m) {
				const line = getLine(code, m.index);
				console.log(
					chalk[parsed.isError ? 'red' : 'yellow'](
						`[${parsed.isError ? 'ERROR' : 'WARN'} : ${
							parsed.id
						} - ${parsed.name}] ${file} (line ${line})`
					)
				);
				results.push({
					ruleId: parsed.id,
					ruleName: parsed.name,
					error: parsed.isError,
					file,
					line,
				});
				m = re.exec(code);
			}
		}
	}
}

const errors = results.filter((x) => !!x.error);
const warns = results.filter((x) => !x.error);
const [took] = printTimeDiff(new Date(), startTime);

console.log(
	boxen(
		`Scanned ${totalFiles} files for ${allRules.length} rules, took ${took}, found ${errors.length} Errors, ${warns.length} Warnings`,
		{
			padding: 1,
			margin: 1,
			borderStyle: 'single',
			borderColor: 'blue',
		}
	)
);

console.log(asTable(results));
