const fs = require('fs');
const folderName = './.superlinter/';
const XRegExp = require('XRegExp');

const LINTER_RGX = XRegExp('Linting \\[(?<name>.*)\\] files');
const FILE_RGX = XRegExp('File:\\[(?<file>.*)\\]');
const LINE_COL_MSG = XRegExp(
	'.*?:(?<line>\\d+?):(?<col>\\d+?): (?<message>.*)'
);
const ERROR_SAMELINE = {
	JAVASCRIPT_STANDARD: LINE_COL_MSG,
	PYTHON: LINE_COL_MSG,
	TYPESCRIPT_STANDARD: LINE_COL_MSG,
	JAVASCRIPT_ES: LINE_COL_MSG, // to be confirmed
	TYPESCRIPT_ES: LINE_COL_MSG, // to be confirmed
	CSS: XRegExp('(?<line>\\d+):(?<col>\\d+)\\s+.+\\s(?<message>.*)'),

	// TODO: add regex for these linters
	YML: '',
	JSON: '',
	XML: '',
	MARKDOWN: '',
	BASH: '',
	PERL: '',
	RAKU: '',
	PHP: '',
	RUBY: '',
	COFFEESCRIPT: '',
	ANSIBLE: '',
	DOCKER: '',
	GO: '',
	TERRAFORM: '',
	ENV: '',
	POWERSHELL: '',
	ARM: '',
	KOTLIN: '',
	PROTOBUF: '',
	CLOJURE: '',
	OPENAPI: '',
	CFN: '',
	HTML: '',
};

const processFile = (file) => {
	const rptContent = fs.readFileSync(file).toString();
	const rows = rptContent.split('\n');
	const issues = [];
	let currentLinter = '';
	let currentFile = '';
	for (let index = 0; index < rows.length; index++) {
		const row = rows[index];
		const linter = XRegExp.exec(row, LINTER_RGX);
		const file = XRegExp.exec(row, FILE_RGX);

		if (linter && linter.name) {
			currentLinter = linter.name;
		}

		if (file && file.file) {
			currentFile = file.file;
		}

		if (currentLinter && currentFile && ERROR_SAMELINE[currentLinter]) {
			const issue = XRegExp.exec(row, ERROR_SAMELINE[currentLinter]);
			if (issue && issue.line && issue.col && issue.message) {
				issues.push({
					location: `${issue.line}:${issue.col}`,
					message: issue.message,
					linter: currentLinter,
					file: currentFile,
				});
			}
		}
	}

	return issues;
};

const readGithubSuperLinter = () => {
	if (!fs.existsSync(folderName)) {
		console.log(
			'ERROR => No Github Super Linter output report folder found. Run again with `-v "%SUPERLINTER%:/usr/app/.superlinter"` option'
		);
		return;
	}

	let reports = fs.readdirSync(folderName);
	let issues = [];
	for (let index = 0; index < reports.length; index++) {
		const errors = processFile(`${folderName}${reports[index]}`);
		if (errors.length > 0) {
			console.log(
				`found ${errors.length} issues on file ${reports[index]}`
			);
			errors.forEach((x) => issues.push(x));
		}
	}
	console.log(`Total issues found: ${issues.length}`);
};

readGithubSuperLinter();
