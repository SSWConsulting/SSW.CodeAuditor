const { getTableClient, getBlobClient } = require('./azureClientFactory');

const ensureTableExists = async (client) => {
	try {
		await client.createTable();
	} catch (error) {
		if (error?.statusCode !== 409 && error?.code !== 'TableAlreadyExists') {
			throw error;
		}
	}
};

const ensureContainerExists = async (containerClient) => {
	const response = await containerClient.createIfNotExists({ access: 'blob' });
	return response.succeeded || response.errorCode === 'ContainerAlreadyExists';
};

exports.insertEntity = async (table, data) => {
	const client = getTableClient(table);
	await ensureTableExists(client);
	await client.createEntity(data);
	return 204;
};

exports.updateEntity = async (table, data) => {
	const client = getTableClient(table);
	await ensureTableExists(client);
	await client.upsertEntity(data, 'Merge');
	return 204;
};

exports.deleteEntity = async (table, data) => {
	const client = getTableClient(table);
	await ensureTableExists(client);
	const partitionKey = data.partitionKey || data.PartitionKey;
	const rowKey = data.rowKey || data.RowKey;
	await client.deleteEntity(partitionKey, rowKey);
};

exports.uploadBlob = async (container, name, data) => {
	const containerClient = getBlobClient(container);
	await ensureContainerExists(containerClient);
	const blockBlobClient = containerClient.getBlockBlobClient(name);
	const body = typeof data === 'string' ? data : JSON.stringify(data);
	const buffer = Buffer.from(body, 'utf-8');
	await blockBlobClient.upload(buffer, buffer.length, {
		blobHTTPHeaders: { blobContentType: 'application/json' },
	});
	return 201;
};
