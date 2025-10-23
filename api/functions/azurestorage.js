const azure = require('azure-storage');

const account = process.env.AZURE_STORAGE_ACCOUNT;
const accountKey = process.env.AZURE_STORAGE_ACCESS_KEY;

const _createTableIfNotExists = (table) =>
	new Promise((resolve, reject) => {
		const tbservice = _getService();
		tbservice.createTableIfNotExists(table, (error) => {
			if (!error) resolve(tbservice);
			else reject(error);
		});
	});

const _createBlobContainerIfNotExists = (container) =>
	new Promise((resolve, reject) => {
		const svc = _getBlobService();
		svc.createContainerIfNotExists(
			container,
			{
				publicAccessLevel: 'blob',
			},
			(error) => {
				if (!error) resolve(svc);
				else reject(error);
			}
		);
	});

const _getService = () => {
	return azure.createTableService(account, accountKey);
};

const _getBlobService = () => {
	return azure.createBlobService(account, accountKey);
};

exports.getTableRows = (table, query) =>
	new Promise((resolve, reject) => {
		_getService().queryEntities(
			table,
			query,
			null,
			(error, _, response) => {
				if (!error) resolve(response.body.value);
				else reject(error);
			}
		);
	});

exports.insertEntity = (table, data) =>
	new Promise((resolve, reject) =>
		_createTableIfNotExists(table).then((service) =>
			service.insertEntity(table, data, (error, _, response) => {
				if (!error) resolve(response.statusCode);
				else reject(error);
			})
		)
	);

exports.uploadBlob = (container, name, data) =>
	new Promise((resolve, reject) =>
		_createBlobContainerIfNotExists(container).then((service) =>
			service.createBlockBlobFromText(
				container,
				name,
				data,
				(error, result, response) => {
					if (!error) resolve(response.statusCode);
					else reject(error);
				}
			)
		)
	);

exports.updateEntity = (table, data) =>
	new Promise((resolve, reject) =>
		_createTableIfNotExists(table).then((service) =>
			service.insertOrMergeEntity(table, data, (error, _, response) => {
				if (!error) resolve(response.statusCode);
				else reject(error);
			})
		)
	);

exports.deleteEntity = (table, data) =>
	new Promise((resolve, reject) =>
		_createTableIfNotExists(table).then((service) =>
			service.deleteEntity(table, data, (error) => {
				if (!error) resolve();
				else reject(error);
			})
		)
	);

exports.getService = _getService;
