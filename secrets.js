import dotenv from 'dotenv';

dotenv.config();

export const secret = process.env.JWT_SECRET;

function parseBoolean(value) {
	return String(value).toLowerCase() === 'true';
}

function parseMsSqlUrl(connectionString) {
	const url = new URL(connectionString);

	return {
		user: decodeURIComponent(url.username),
		password: decodeURIComponent(url.password),
		server: url.hostname,
		port: url.port ? Number(url.port) : 1433,
		database: url.pathname.replace(/^\//, ''),
		connectionTimeout: Number(url.searchParams.get('connectionTimeout') || 30000),
		requestTimeout: Number(url.searchParams.get('requestTimeout') || 30000),
		options: {
			encrypt: parseBoolean(url.searchParams.get('encrypt')),
			trustServerCertificate: parseBoolean(url.searchParams.get('trustServerCertificate')),
			enableArithAbort: true
		}
	};
}

function parseAdoConnectionString(connectionString) {
	const parts = connectionString.split(';').filter(Boolean);
	const values = parts.reduce(function (result, part) {
		const separatorIndex = part.indexOf('=');

		if (separatorIndex === -1) {
			return result;
		}

		const key = part.slice(0, separatorIndex).trim().toLowerCase();
		const value = part.slice(separatorIndex + 1).trim();
		result[key] = value;
		return result;
	}, {});

	const serverValue = values.server || values['data source'] || '';
	const normalizedServer = serverValue.replace(/^tcp:/i, '');
	const serverParts = normalizedServer.split(',');
	const timeoutSeconds = Number(values['connection timeout'] || values['connect timeout'] || 30);

	return {
		user: values['user id'] || values.uid || values.user,
		password: values.password || values.pwd,
		server: serverParts[0],
		port: serverParts[1] ? Number(serverParts[1]) : 1433,
		database: values['initial catalog'] || values.database,
		connectionTimeout: timeoutSeconds * 1000,
		requestTimeout: timeoutSeconds * 1000,
		options: {
			encrypt: parseBoolean(values.encrypt),
			trustServerCertificate: parseBoolean(values.trustservercertificate),
			enableArithAbort: true
		}
	};
}

export function getDbConfig() {
	const connectionString = process.env.DATABASE_URL;

	if (!connectionString) {
		return connectionString;
	}

	if (connectionString.startsWith('mssql://')) {
		return parseMsSqlUrl(connectionString);
	}

	if (connectionString.includes('Server=')) {
		return parseAdoConnectionString(connectionString);
	}

	return connectionString;
}

export const dbconfig = getDbConfig();

export default secret;
