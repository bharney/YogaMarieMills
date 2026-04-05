import sql from 'mssql';
import * as secrets from '../secrets';

let connectionPromise;

function getConnection() {
    if (!connectionPromise) {
        const connectionConfig = secrets.getDbConfig ? secrets.getDbConfig() : secrets.dbconfig;

        if (!connectionConfig) {
            return Promise.reject(new Error('DATABASE_URL is not set.'));
        }

        connectionPromise = new Promise(function (resolve, reject) {
            const conn = new sql.Connection(connectionConfig, function (err) {
                if (err) {
                    connectionPromise = null;
                    return reject(err);
                }
                resolve(conn);
            });
        });
    }

    return connectionPromise;
}

export function executeQuery(queryText, configureRequest) {
    return getConnection().then(function (conn) {
        return new Promise(function (resolve, reject) {
            const request = new sql.Request(conn);

            if (configureRequest) {
                configureRequest(request, sql);
            }

            request.query(queryText, function (queryError, recordset) {
                if (queryError) {
                    reject(queryError);
                    return;
                }

                resolve(recordset);
            });
        });
    });
}

export function ensureSqlConnection() {
    return getConnection();
}

export default executeQuery;
