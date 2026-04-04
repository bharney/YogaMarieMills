import sql from 'mssql';
import bcrypt from 'bcrypt-nodejs';
import { dbconfig } from '../secrets';

// Default admin credentials — change these before running in production
const ADMIN_EMAIL = process.env.SEED_EMAIL || 'admin@yogamariemills.com';
const ADMIN_PASSWORD = process.env.SEED_PASSWORD || 'Admin123!';
const ADMIN_FIRST = 'Admin';
const ADMIN_LAST = 'User';

bcrypt.hash(ADMIN_PASSWORD, null, null, function (err, hash) {
    if (err) {
        console.error('bcrypt error:', err);
        process.exit(1);
    }

    const conn = new sql.Connection(dbconfig, function (connErr) {
        if (connErr) {
            console.error('Connection error:', connErr);
            process.exit(1);
        }

        const request = new sql.Request(conn);
        request.input('emailAddress', sql.VarChar, ADMIN_EMAIL);
        request.input('firstName', sql.VarChar, ADMIN_FIRST);
        request.input('lastName', sql.VarChar, ADMIN_LAST);
        request.input('password', sql.VarChar, hash);
        request.query(
            `IF NOT EXISTS (SELECT 1 FROM Users WHERE emailAddress = @emailAddress)
             BEGIN
                 INSERT INTO Users (emailAddress, firstName, lastName, password, createdDate)
                 VALUES (@emailAddress, @firstName, @lastName, @password, GETDATE());
                 SELECT 'User created' AS result;
             END
             ELSE
             BEGIN
                 SELECT 'User already exists' AS result;
             END`,
            function (queryErr, recordset) {
                if (queryErr) {
                    console.error('Query error:', queryErr);
                    conn.close();
                    process.exit(1);
                } else {
                    console.log(recordset[0].result);
                    console.log('Email:   ', ADMIN_EMAIL);
                    console.log('Password:', ADMIN_PASSWORD);
                    conn.close();
                    process.exit(0);
                }
            }
        );
    });
});
