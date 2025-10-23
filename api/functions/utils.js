const R = require('ramda');

exports.replaceProp = (data, entity) => {
	let toreturn = { ...entity };
	const convert = R.cond([
		[R.is(Number), R.identity],
		[R.is(String), R.identity],
		[R.is(Boolean), R.identity],
		[R.is(Date), R.identity],
		[R.is(Array), (x) => JSON.stringify(x)],
		[R.is(Object), (x) => JSON.stringify(x)],
		[R.T, R.identity],
	]);
	Object.keys(data).forEach((k) => {
		toreturn = {
			...toreturn,
			[k]: convert(data[k]),
		};
	});
	return toreturn;
};

exports.newGuid = () => {
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

exports.getErrorAndWarnCount = R.pipe(
	R.values,
	R.groupBy(R.prop('type')),
	R.tap(console.log),
	R.converge(
		R.zipWith((x, y) => ({
			[x]: R.pipe(R.reduce((acc, elem) => acc + elem.count, 0))(y),
		})),
		[R.keys, R.values]
	),
	R.mergeAll
);

exports.getErrorsName = R.pipe(
	R.converge(
		R.zipWith((x, y) => ({
			[x]: y.count,
		})),
		[R.keys, R.values]
	),
	R.mergeAll
);

exports.getCodeErrorSummary = R.pipe(
	R.map((x) => ({
		...x,
		issue: `${x.error ? 'Error' : 'Warn'} - ${x.ruleName}`,
	})),
	R.groupBy(R.prop('issue')),
	R.converge(
		R.zipWith((x, y) => ({
			issue: x,
			count: y.length,
		})),
		[R.keys, R.values]
	),
	R.converge(R.zipObj, [R.map(R.prop('issue')), R.map(R.prop('count'))])
);

function pad(str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

exports.getReversedTick = () => {
	const nowUtc = (new Date()).getTime();
	const maxTime = new Date(9999, 1, 1);
	return pad(maxTime - nowUtc, 19);
}

