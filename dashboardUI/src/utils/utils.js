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
	USERS : 'users'
}