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
	API: 'https://us-central1-sswlinkauditor-c1131.cloudfunctions.net',
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
