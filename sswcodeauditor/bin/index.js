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

// import for the script module
const { NodeVM } = require('vm2');
const esWalk = require('esprima-walk');
const tsParser = require('@typescript-eslint/typescript-estree').parse;
const cheerio = require('cheerio');

const getLine = (code, index) => {
	const c = code.substr(0, index);
	return c.split('\n').length;
};

const getCodeSnippet = (code, line) => {
	const totalLines = code.split('\n').length;
	const dropStart = line - 3 < 0 ? 0 : line - 3;
	const dropEnd = line + 3 > totalLines ? 0 : totalLines - line - 3;
	return R.pipe(
		R.split('\n'),
		R.drop(dropStart),
		R.dropLast(dropEnd),
		R.join('\n')
	)(code);
};

const evaluateScript = (code, script) => {
	const vm = new NodeVM({
		timeout: 100, // milliseconds timeout,
		sandbox: {
			code,
			esWalk,
			tsParser,
			cheerio,
		},
		require: {
			external: true,
		},
	});
	try {
		return vm.run(script);
	} catch (e) {
		log('Failed running script', e.message);
		return '';
	}
};

const cleanCode = R.pipe(strip);
const printErrOrWarn = (parsed, line, file, results, code) => {
	log(
		chalk[parsed.isError ? 'red' : 'yellow'](
			`[${parsed.isError ? 'ERROR' : 'WARN'} : ${parsed.id} - ${
				parsed.name
			}] ${file} (line ${line})`
		)
	);

	results.push({
		ruleId: parsed.id,
		ruleName: parsed.name,
		error: parsed.isError,
		ruleFile: parsed.ruleFile,
		file,
		line,
		snippet: getCodeSnippet(code, +line),
	});
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
	})
	.option('json', {
		alias: 'json',
		describe: 'print output in JSON format',
		type: 'boolean',
		default: false,
	}).argv;

const log = (msg) => {
	!args.json && console.log(msg);
};

const rootFolder = args._[0] || '.';

let ignoredFiles = [
	'./{,**}/node_modules/**',
	'./{,**}/*.min.*',
	'./{,**}/*.bundle.*',
];

let ignoreF = args.ignore
	? args.ignore
	: fs.existsSync(`${rootFolder}/.gitignore`)
	? `${rootFolder}/.gitignore`
	: null;

if (ignoreF) {
	ignoredFiles = fs
		.readFileSync(ignoreF)
		.toString()
		.split('\r\n')
		.filter((l) => l.trim().length > 0 && !l.trim().match('^(#|!)'))
		.map((x) => x.trim())
		.map((x) => `./{,**}/${x}/**`);
}

let allRules = [];

log(
	chalk.blueBright(
		`Checking rules in folder ${path.join(__dirname, '../rules/')}`
	)
);
const rules = fs.readdirSync(path.join(__dirname, '../rules/'));
for (let index = 0; index < rules.length; index++) {
	const rule = rules[index];
	const ruleMd = fs
		.readFileSync(path.join(__dirname, `../rules/${rule}`))
		.toString();
	const parsed = parser.parseSync(ruleMd).data;
	allRules.push({ ...parsed, ruleFile: rule });
}

const globPattern = getGlobalGlobPattern(allRules);
const files = glob.sync(`${rootFolder}/${globPattern}`, {
	ignore: ignoredFiles,
});

log(chalk.yellowBright(`Found ${files.length} files matching `, globPattern));

let totalFiles = 0;
let startTime = new Date();
for (let u = 0; u < files.length; u++) {
	const file = files[u];
	totalFiles++;
	log(chalk.yellowBright(`Checking ${file}`));
	for (let index = 0; index < allRules.length; index++) {
		const parsed = allRules[index];
		if (
			!fileMatchExtension(file)(parsed.fileFilter) ||
			fs.lstatSync(file).isDirectory()
		) {
			continue;
		}

		const code = cleanCode(fs.readFileSync(file).toString());
		log(chalk.yellowBright(` --with rule ${parsed.ruleFile}`));
		if (parsed.ruleType === 'Script') {
			const locs = evaluateScript(code, parsed.script);
			if (locs) {
				locs.split(',').forEach((line) => {
					printErrOrWarn(parsed, line, file, results, code);
				});
			}
		} else if (parsed.ruleType === 'Regex') {
			const re = new RegExp(parsed.regex, 'g');
			let m = re.exec(code);

			if (m) {
				while (m) {
					const line = getLine(code, m.index);
					printErrOrWarn(parsed, line, file, results, code);
					m = re.exec(code);
				}
			}
		}
	}
}

if (args.json) {
	console.log(JSON.stringify(results));
} else {
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
	const removed = results.map((x) => {
		return {
			file: x.file,
			rule: x.ruleFile,
			error: x.error,
			line: x.line,
		};
	});
	console.log(asTable(removed));
	if (errors.length > 0) {
		process.exit(1);
	}
}
