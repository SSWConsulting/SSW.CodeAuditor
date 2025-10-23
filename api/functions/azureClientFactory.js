const {
	DefaultAzureCredential,
	ManagedIdentityCredential,
	AzureCliCredential,
} = require('@azure/identity');
const {
	TableClient,
	AzureNamedKeyCredential,
} = require('@azure/data-tables');
const {
	BlobServiceClient,
} = require('@azure/storage-blob');

const buildCredential = () => {
	if (process.env.AZURE_USE_MANAGED_IDENTITY === 'true') {
		return new ManagedIdentityCredential(process.env.AZURE_MANAGED_IDENTITY_CLIENT_ID);
	}

	if (process.env.AZURE_USE_AZURE_CLI === 'true') {
		return new AzureCliCredential();
	}

	if (process.env.AZURE_STORAGE_ACCOUNT && process.env.AZURE_STORAGE_ACCESS_KEY) {
		return new AzureNamedKeyCredential(
			process.env.AZURE_STORAGE_ACCOUNT,
			process.env.AZURE_STORAGE_ACCESS_KEY
		);
	}

	return new DefaultAzureCredential();
};

const buildConnectionString = () => {
	const account = process.env.AZURE_STORAGE_ACCOUNT;
	const key = process.env.AZURE_STORAGE_ACCESS_KEY;
	const suffix = process.env.AZURE_STORAGE_ENDPOINT_SUFFIX || 'core.windows.net';

	if (!account || !key) {
		return undefined;
	}

	return process.env.AZURE_STORAGE_CONNECTION_STRING
		|| `DefaultEndpointsProtocol=https;AccountName=${account};AccountKey=${key};EndpointSuffix=${suffix}`;
};

const getEndpoint = (override, serviceSubdomain) => {
	if (override) {
		return override;
	}

	const account = process.env.AZURE_STORAGE_ACCOUNT;
	const suffix = process.env.AZURE_STORAGE_ENDPOINT_SUFFIX || 'core.windows.net';

	if (!account) {
		throw new Error(`AZURE_STORAGE_ACCOUNT must be set when AZURE_STORAGE_${serviceSubdomain.toUpperCase()}_ENDPOINT is not provided.`);
	}

	return `https://${account}.${serviceSubdomain}.${suffix}`;
};

const getTableClient = (tableName) => {
	const credential = buildCredential();

	if (credential instanceof AzureNamedKeyCredential) {
		const connectionString = buildConnectionString();
		if (!connectionString) {
			throw new Error('Azure named key credential requires AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY.');
		}
		return TableClient.fromConnectionString(connectionString, tableName);
	}

	const endpoint = getEndpoint(process.env.AZURE_STORAGE_TABLE_ENDPOINT, 'table');
	return new TableClient(endpoint, tableName, credential);
};

const getBlobClient = (container) => {
	const credential = buildCredential();

	if (credential instanceof AzureNamedKeyCredential) {
		const connectionString = buildConnectionString();
		if (!connectionString) {
			throw new Error('Azure named key credential requires AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY.');
		}
		return BlobServiceClient.fromConnectionString(connectionString).getContainerClient(container);
	}

	const endpoint = getEndpoint(process.env.AZURE_STORAGE_BLOB_ENDPOINT, 'blob');
	const service = new BlobServiceClient(endpoint, credential);
	return service.getContainerClient(container);
};

module.exports = {
	getTableClient,
	getBlobClient,
};
