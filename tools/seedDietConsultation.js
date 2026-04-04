import sql from 'mssql';
import { dbconfig } from '../secrets';

/*
  Seed one Diet Consultation card if none exists.
  Run with: npm run db:seed-diet
*/

const conn = new sql.Connection(dbconfig, function (connErr) {
    if (connErr) {
        console.error('Connection error:', connErr.message);
        process.exit(1);
    }

    const request = new sql.Request(conn);
    request.query(
        `IF NOT EXISTS (SELECT 1 FROM Consultations WHERE type = 'diet')
         BEGIN
             INSERT INTO Consultations (type, title, session_time, short, description, cost, icon, iconHeight, iconWidth)
             VALUES (
                'diet',
                'Initial Consultation',
                '60 minutes',
                'Personalised consultation',
                'A one-to-one session to discuss nutrition, lifestyle, and practical recommendations.',
                '75.00',
                'whitehop.png',
                '3em',
                '3em'
             );
             SELECT 'inserted' AS result;
         END
         ELSE
             SELECT 'exists' AS result;`,
        function (err, recordset) {
            if (err) {
                console.error('Seed error:', err.message);
                conn.close();
                process.exit(1);
                return;
            }

            console.log('Diet consultation seed:', recordset[0].result);
            conn.close();
            process.exit(0);
        }
    );
});
