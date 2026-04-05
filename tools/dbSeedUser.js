import dotenv from 'dotenv';
import sql from 'mssql';
import bcrypt from 'bcrypt-nodejs';
import { getDbConfig } from '../secrets';

dotenv.config();

function hashPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, null, null, function (err, hash) {
            if (err) return reject(err);
            resolve(hash);
        });
    });
}

function esc(value) {
    if (value === null || value === undefined) return 'NULL';
    return `'${String(value).replace(/'/g, "''")}'`;
}

async function seedUser() {
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;
    const firstName = process.env.SEED_ADMIN_FIRST_NAME || 'Admin';
    const lastName = process.env.SEED_ADMIN_LAST_NAME || 'User';

    if (!email || !password) {
        console.error('Missing SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD in .env');
        process.exit(1);
    }

    const dbconfig = getDbConfig();
    if (!dbconfig) {
        console.error('DATABASE_URL is not set in .env');
        process.exit(1);
    }

    console.log(`Seeding user: ${email}`);

    const hash = await hashPassword(password);

    const conn = new sql.Connection(dbconfig, async function (err) {
        if (err) {
            console.error('Connection error:', err);
            process.exit(1);
        }

        const request = new sql.Request(conn);

        // Upsert: update if exists, insert if not
        const query = `
            IF EXISTS (SELECT 1 FROM Users WHERE emailAddress = ${esc(email)})
                UPDATE Users
                SET password = ${esc(hash)},
                    firstName = ${esc(firstName)},
                    lastName = ${esc(lastName)},
                    changedDate = GETUTCDATE()
                WHERE emailAddress = ${esc(email)}
            ELSE
                INSERT INTO Users (emailAddress, firstName, lastName, password, createdDate)
                VALUES (${esc(email)}, ${esc(firstName)}, ${esc(lastName)}, ${esc(hash)}, GETUTCDATE())
        `;

        request.query(query, function (queryErr) {
            if (queryErr) {
                console.error('Query error:', queryErr);
                conn.close();
                process.exit(1);
            }
            console.log(`User ${email} seeded successfully.`);
            conn.close();
            process.exit(0);
        });
    });
}

seedUser().catch(function (err) {
    console.error('Seed failed:', err.message || err);
    process.exit(1);
});
