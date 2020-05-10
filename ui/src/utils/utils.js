import { pipe, converge, zipWith, map, join, keys, values } from 'ramda';

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
	join(', ')
);
