const azure = require('azure-storage');
const R = require('ramda');

exports.replaceProp = (data, entity) => {
	let toreturn = { ...entity };
	const entGen = azure.TableUtilities.entityGenerator;
	const convert = R.cond([
		[R.is(Number), entGen.Int32],
		[R.is(String), entGen.String],
		[R.is(Date), entGen.DateTime],
		[R.is(Object), (x) => entGen.String(JSON.stringify(x))],
		[R.T, entGen.String],
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
	R.converge(
		R.zipWith((x, y) => ({
			[x]: y.length,
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
