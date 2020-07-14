const fs = require('fs');
const XRegExp = require('xregexp');

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
};
const ERROR_ON_DIFFLINES = {
	HTML: {
		location: XRegExp('L(?<line>\\d*)'),
		message: XRegExp('.\\s\\((?<message>.*)\\)'),
	},
};

const processFile = (file) => {
	const rptContent = fs.readFileSync(file).toString();
	const rows = rptContent.split('\n');
	const issues = [];
	let currentLinter = '';
	let currentFile = '';
	let currentLocation = '';
	let currentMessage = '';
	for (let index = 0; index < rows.length; index++) {
		const row = rows[index];
		const linter = XRegExp.exec(row, LINTER_RGX);
		const file = XRegExp.exec(row, FILE_RGX);

		if (linter && linter.name) {
			currentLinter = linter.name;
			// reset on new linter
			currentFile = '';
			currentLocation = '';
			currentMessage = '';
		}

		if (file && file.file) {
			currentFile = file.file;
			// reset on new file
			currentLocation = '';
			currentMessage = '';
		}

		if (currentLinter && currentFile) {
			if (ERROR_SAMELINE[currentLinter]) {
				// error line and error message is reported in 1 single line of text
				const issue = XRegExp.exec(row, ERROR_SAMELINE[currentLinter]);
				if (issue && issue.line && issue.col && issue.message) {
					issues.push({
						location: `${issue.line}:${issue.col}`,
						message: issue.message,
						linter: currentLinter,
						file: currentFile,
					});
				}
			} else if (ERROR_ON_DIFFLINES[currentLinter]) {
				// error line and error message is reported on 2 different lines
				const location = XRegExp.exec(
					row,
					ERROR_ON_DIFFLINES[currentLinter].location
				);
				const message = XRegExp.exec(
					row,
					ERROR_ON_DIFFLINES[currentLinter].message
				);

				if (location && location.line) {
					currentLocation = location.col
						? `${location.line}:${location.col}`
						: location.line;
				}

				if (message && message.message) {
					currentMessage = message.message;
				}

				if (currentLocation && currentMessage) {
					issues.push({
						location: currentLocation,
						message: currentMessage,
						linter: currentLinter,
						file: currentFile,
					});
				}
			}
		}
	}

	return issues;
};

exports.readGithubSuperLinter = processFile;

(function test() {
	const errors = processFile('./superlinter.log');
	console.log(errors.slice(0, 1000));
})();
