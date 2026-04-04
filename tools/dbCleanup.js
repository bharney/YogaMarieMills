import sql from 'mssql';
import { dbconfig } from '../secrets';

/*
  One-time cleanup script:
  1. Fix "Massage" navbar entry to point to /Ayurveda/Massage
  2. Remove blank/duplicate MassageTypes test data (keep id=1 as canonical Body, id=6 as Scalp)
  3. Remove orphaned MassageDetails rows
  4. Remove blank Headers row
  Run with: npm run db:cleanup
*/

const conn = new sql.Connection(dbconfig, function (connErr) {
    if (connErr) {
        console.error('Connection error:', connErr.message);
        process.exit(1);
    }

    const steps = [
        {
            label: 'Fix Massage navbar route → Ayurveda/Massage',
            sql: `UPDATE Navbar_Items SET route = 'Ayurveda/Massage' WHERE name = 'Massage' AND parent_id = 2`
        },
        {
            label: 'Remove duplicate/junk MassageTypes (keep id=1 Body, id=6 Scalp)',
            sql: `DELETE FROM MassageTypes WHERE id NOT IN (1, 6)`
        },
        {
            label: 'Remove orphaned MassageDetails (whose parent no longer exists)',
            sql: `DELETE FROM MassageDetails WHERE parent_id NOT IN (SELECT id FROM MassageTypes)`
        },
        {
            label: 'Remove blank Headers row (type = empty string)',
            sql: `DELETE FROM Headers WHERE type = ''`
        },
    ];

    let remaining = steps.length;

    steps.forEach(step => {
        const r = new sql.Request(conn);
        r.query(step.sql, function (err, result) {
            if (err) {
                console.error(`  [ERR] ${step.label}: ${err.message}`);
            } else {
                const affected = result && result.rowsAffected ? result.rowsAffected[0] : '?';
                console.log(`  [OK]  ${step.label} (${affected} rows affected)`);
            }
            remaining--;
            if (remaining === 0) {
                console.log('\nCleanup complete.');
                conn.close();
            }
        });
    });
});
