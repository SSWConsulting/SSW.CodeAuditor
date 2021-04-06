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
	when,
	propSatisfies,
	gt,
	takeLast,
	prepend,
	__
} from 'ramda';

export const truncate = (len) =>
	when(
		propSatisfies(gt(__, len), 'length'),
		pipe(takeLast(len), prepend('…'), join(''))
	);

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
	API: 'https://asia-east2-sswlinkauditor-c1131.cloudfunctions.net',
	BlobURL: 'https://codeauditorstorage.blob.core.windows.net',
	URLChecker: 'https://urlchecker.blob.core.windows.net'
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
		window.history.pushState({
			path: newurl
		}, '', newurl);
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

export const getArtilleryResult = (value) => ({
	timestamp: value.timestamp,
	scenariosCreated: value.scenariosCreated,
	scenariosCompleted: value.scenariosCompleted,
	requestsCompleted: value.requestsCompleted,
	latencyMedian: value.latencyMedian,
	rpsCount: value.rpsCount,
});

export const getLoadThresholdResult = (value) => ({
	latencyMedian: value.latencyMedian,
	latencyP95: value.latencyP95,
	latencyP99: value.latencyP99,
	errors: value.errors
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
			htmlIssueList: 'HTML Issues:\n' +
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

export const getCodeErrorsByRule = pipe(
	groupBy(prop('ruleFile')),
	converge(
		zipWith((x, y) => ({
			error: x.replace('.md', ''),
			pages: pipe(
				groupBy(prop('file')),
				converge(
					zipWith((x, y) => ({
						error: x.replace('.md', ''),
						url: x,
						locations: y.map((l) => l.line),
					})),
					[keys, values]
				)
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

export const getRuleLink = (errorKey) => {
  if (customHtmlHintRules.some(rule => rule.rule === errorKey)) {
    var custom = customHtmlHintRules.find(item => item.rule == errorKey);
    return custom.ruleLink;
  }
  else {
    return `https://htmlhint.com/docs/user-guide/rules/${errorKey}`;
  }
};

export const htmlHintRules = [
	{ rule: "tagname-lowercase" },
	{ rule: "attr-lowercase" }, 
	{ rule: "attr-value-double-quotes" },
	{ rule: "attr-value-not-empty" },
	{ rule: "attr-no-duplication" },
	{ rule: "doctype-first" },
	{ rule: "tag-pair" },
	{ rule: "empty-tag-not-self-closed" },
	{ rule: "spec-char-escape" },
	{ rule: "id-unique" },
	{ rule: "src-not-empty" },
	{ rule: "title-require" },
	{ rule: "alt-require" },
	{ rule: "doctype-html5" },
	{ rule: "style-disabled" },
	{ rule: "inline-style-disabled" },
	{ rule: "inline-script-disabled" },
	{ rule: "id-class-ad-disabled" },
	{ rule: "href-abs-or-rel" },
	{ rule: "attr-unsafe-chars" },
	{ rule: "head-script-disabled" },
	{ rule: "head-script-disabled" },
 ];

 export const customHtmlHintRules = [
	{ rule: "Code block - missing language", ruleLink: "https://www.ssw.com.au/rules/set-language-on-code-blocks" },
  { rule: "Common Agile Scrum Terms people get wrong", ruleLink: "https://www.ssw.com.au/rules/scrum-should-be-capitalized" },
	// Add new rule id below
 ];