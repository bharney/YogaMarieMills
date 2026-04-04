import sql from 'mssql';
import { dbconfig } from '../secrets';

console.log('Testing database connection...');
console.log('Database URL:', dbconfig.substring(0, 50) + '...');

const conn = new sql.Connection(dbconfig, function (err) {
    if (err) {
        console.error('Connection error:', err);
        process.exit(1);
        return;
    }

    console.log('Connected successfully!');

    const request = new sql.Request(conn);

    // Simple test query
    request.query('SELECT 1 as test', function (err, recordset) {
        if (err) {
            console.error('Query error:', err);
            conn.close();
            process.exit(1);
        } else {
            console.log('Query successful, result:', recordset);
            conn.close();
            process.exit(0);
        }
    });
});
