import {
	pipe,
	converge,
	zipWith,
	map,
	mergeAll,
	uniq,
	join,
	filter,
	head,
	keys,
	values,
	groupBy,
	flatten,
	tap,
	prop,
} from 'ramda';

export function isValidEmail(value) {
	if (!value) return true;
	const pattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	return value && pattern.test(value);
}

export const newGuid = () => {
	const S4 = () =>
		(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	return (
		S4() +
		S4() +
		'-' +
		S4() +
		'-4' +
		S4().substr(0, 3) +
		'-' +
		S4() +
		'-' +
		S4() +
		S4() +
		S4()
	).toLowerCase();
};

export const CONSTS = {
	USERS: 'users',
	API: 'https://asia-northeast1-sswlinkauditor-c1131.cloudfunctions.net',
};

export const printTimeDiff = (took) =>
	Math.floor((took || 0) / 60)
		.toString()
		.padStart(2, '0') +
	':' +
	Math.floor((took || 0) % 60)
		.toString()
		.padStart(2, '0');

export const updateQuery = (q) => {
	if (history.pushState) {
		var newurl =
			window.location.protocol +
			'//' +
			window.location.host +
			window.location.pathname +
			'?' +
			q;
		window.history.pushState({ path: newurl }, '', newurl);
	}
};

export const getPerfScore = (value) => ({
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

export const isInIgnored = (url, list) => {
	function glob(pattern, input) {
		var re = new RegExp(
			pattern
				.replace(/([.?+^$[\]\\(){}|\/-])/g, '\\$1')
				.replace(/\*/g, '.*')
		);
		return re.test(input);
	}
	const date = new Date();
	for (let index = 0; index < list.length; index++) {
		const item = list[index];
		const pattern = item.urlToIgnore;
		if (glob(pattern, url)) {
			const effectiveFrom = new Date(item.effectiveFrom);
			const timelapsed = (date - effectiveFrom) / 86400000;
			if (
				(item.ignoreDuration > 0 && timelapsed < item.ignoreDuration) ||
				item.ignoreDuration === -1
			) {
				console.log('Remaing days', item.ignoreDuration - timelapsed);
				return true;
			}
		}
	}
	return null;
};

export const getHtmlIssuesDescriptions = pipe(
	JSON.parse,
	converge(
		zipWith((x, y) => ({
			error: x,
			count: y,
		})),
		[keys, values]
	),
	map((x) => `"${x.error}" : ${x.count}`),
	join('\n')
);

export const getCodeIssuesDescriptions = pipe(
	converge(
		zipWith((x, y) => ({
			error: x,
			count: y,
		})),
		[keys, values]
	),
	map((x) => `"${x.error}" : ${x.count}`),
	join('\n')
);

export const getHtmlErrorsByReason = pipe(
	map((x) => {
		return Object.keys(x.errors).reduce((pre, curr) => {
			pre = [
				...pre,
				{
					error: curr,
					url: x.url,
					locations: x.errors[curr],
				},
			];
			return pre;
		}, []);
	}),
	map(values),
	flatten,
	groupBy(prop('error')),
	converge(
		zipWith((k, v) => ({
			error: k,
			pages: v,
		})),
		[keys, values]
	)
);

export const getCodeSummary = (value) => {
	let summary = {};
	if (value.codeIssues) {
		const data = value.codeIssues ? JSON.parse(value.codeIssues) : null;
		summary = {
			...summary,
			code: true,
			codeErrors: Object.keys(data).filter((x) =>
				x.startsWith('Error - ')
			).length,
			codeWarnings: Object.keys(data).filter((x) =>
				x.startsWith('Warn - ')
			).length,
			codeIssueList: 'Code Issues:\n' + getCodeIssuesDescriptions(data),
		};
	}

	if (value.cloc) {
		const cloc = JSON.parse(value.cloc);
		summary = {
			...summary,
			cloc: true,
			totalFiles: cloc.header.n_files,
			totalLines: cloc.header.n_lines,
		};
	}

	if (value.htmlIssuesList) {
		summary = {
			...summary,
			html: true,
			htmlErrors: value.htmlErrors || 0,
			htmlWarnings: value.htmlWarnings || 0,
			htmlIssueList:
				'HTML Issues:\n' +
				getHtmlIssuesDescriptions(value.htmlIssuesList),
		};
	}
	return summary;
};
export const HTMLERRORS = [
	'attr-no-duplication',
	'attr-lowercase',
	'attr-value-double-quotes',
	'doctype-first',
	'id-unique',
	'spec-char-escape',
	'src-not-empty',
	'tag-pair',
	'tagname-lowercase',
	'title-require',
];

export const getCodeErrorsByFile = pipe(
	groupBy(prop('file')),
	converge(
		zipWith((x, y) => ({
			url: x,
			errors: pipe(
				groupBy(prop('ruleFile')),
				converge(
					zipWith((x, y) => ({
						[x.replace('.md', '')]: pipe(map(prop('line')))(y),
					})),
					[keys, values]
				),
				mergeAll
			)(y),
		})),
		[keys, values]
	)
);

export const getCodeErrorRules = pipe(
	groupBy(prop('error')),
	converge(
		zipWith((x, y) => ({
			type: x === 'true' ? 'Error' : 'Warn',
			errors: pipe(groupBy(prop('ruleFile')), keys)(y),
		})),
		[keys, values]
	),
	filter((x) => x.type === 'Error'),
	head,
	prop('errors')
);

export const getHtmlHintIssues = pipe(
	map(prop('errors')),
	map(keys),
	flatten,
	uniq
);
