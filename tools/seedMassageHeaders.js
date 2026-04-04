import sql from 'mssql';
import { dbconfig } from '../secrets';

/*
  Seeds the Headers table with one row per massage type used by MassagePage.
  The GET /api/massages query JOINs Headers rows to build the page structure —
  without a Headers row for a given type, no massages of that type will appear.

  Run with: npm run db:seed-massage-headers
*/

const headers = [
    { type: 'Body',  header: 'Body Massage',  description: 'Ayurvedic body massage therapies', venue: '' },
    { type: 'Face',  header: 'Face Massage',   description: 'Ayurvedic facial treatments',      venue: '' },
    { type: 'Scalp', header: 'Scalp Massage',  description: 'Ayurvedic scalp therapies',        venue: '' },
];

const conn = new sql.Connection(dbconfig, function (connErr) {
    if (connErr) {
        console.error('Connection error:', connErr);
        process.exit(1);
    }

    let remaining = headers.length;
    let errors = 0;

    function done() {
        remaining--;
        if (remaining === 0) {
            console.log(`\nMassage header seeding complete. Errors: ${errors}`);
            conn.close();
            process.exit(errors > 0 ? 1 : 0);
        }
    }

    headers.forEach(item => {
        const r = new sql.Request(conn);
        r.input('type',        sql.VarChar, item.type);
        r.input('header',      sql.VarChar, item.header);
        r.input('description', sql.VarChar, item.description);
        r.input('venue',       sql.VarChar, item.venue);
        r.query(
            `IF NOT EXISTS (SELECT 1 FROM Headers WHERE type = @type)
             BEGIN
               INSERT INTO Headers (type, header, description, venue)
               VALUES (@type, @header, @description, @venue)
               PRINT 'Inserted header for type: ' + @type
             END
             ELSE
               PRINT 'Header already exists for type: ' + @type`
        ).then(() => {
            console.log(`  [OK] ${item.type}`);
            done();
        }).catch(err => {
            console.error(`  [ERR] ${item.type}:`, err.message);
            errors++;
            done();
        });
    });
});
