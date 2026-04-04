import fs from 'fs';
import path from 'path';
import sql from 'mssql';
import { dbconfig } from '../secrets';

const scriptPath = path.resolve(__dirname, '../docs/database-init.sql');
const sqlScript = fs.readFileSync(scriptPath, 'utf8');

// Split the script into individual statements
const statements = sqlScript
    .split('GO')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0);

console.log(`Executing ${statements.length} SQL statements...`);

let executed = 0;

const executeNext = (conn, request) => {
    if (executed >= statements.length) {
        console.log('db:init completed successfully.');
        conn.close();
        process.exit(0);
        return;
    }

    const statement = statements[executed];
    executed++;

    console.log(`Executing statement ${executed}/${statements.length}...`);

    request.query(statement, (err) => {
        if (err) {
            console.error(`Error executing statement ${executed}:`, err);
            conn.close();
            process.exit(1);
        } else {
            executeNext(conn, request);
        }
    });
};

const conn = new sql.Connection(dbconfig, function (err) {
    if (err) {
        console.error('db:init connection error:', err);
        process.exit(1);
        return;
    }

    const request = new sql.Request(conn);
    request.requestTimeout = 300000; // 5 minute timeout

    executeNext(conn, request);
});
