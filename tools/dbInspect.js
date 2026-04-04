import sql from 'mssql';
import { dbconfig } from '../secrets';

const queries = [
    {
        name: 'Navbar_Items',
        sql: `SELECT id, type, name, route, parent_id FROM Navbar_Items ORDER BY parent_id, id`
    },
    {
        name: 'Headers',
        sql: `SELECT id, type, header, description, venue FROM Headers ORDER BY type`
    },
    {
        name: 'MassageTypes',
        sql: `SELECT id, type, title, session_time, cost FROM MassageTypes ORDER BY type`
    },
    {
        name: 'MassageDetails',
        sql: `SELECT id, parent_id, title, description FROM MassageDetails ORDER BY parent_id`
    },
    {
        name: 'Consultations',
        sql: `SELECT id, type, title, session_time, short AS consultation, description AS consultation_desc, cost, icon FROM Consultations ORDER BY id`
    },
    {
        name: 'ClassTypes',
        sql: `SELECT id, type, title, route FROM ClassTypes ORDER BY id`
    },
    {
        name: 'Costs',
        sql: `SELECT id, type, course, cost, duration FROM Costs ORDER BY sequence, id`
    },
    {
        name: 'Testimonials',
        sql: `SELECT id, type, name, LEFT(testimonial, 80) AS testimonial_preview FROM Testimonials`
    },
    {
        name: 'EventTypes',
        sql: `SELECT id, type, title, start_date, end_date FROM EventTypes ORDER BY start_date`
    },
    {
        name: 'Blogs',
        sql: `SELECT id, title, type, postDate FROM Blogs ORDER BY postDate DESC`
    },
];

const conn = new sql.Connection(dbconfig, function (connErr) {
    if (connErr) {
        console.error('Connection error:', connErr.message);
        process.exit(1);
    }

    let remaining = queries.length;

    queries.forEach(q => {
        const r = new sql.Request(conn);
        r.query(q.sql, function (err, recordset) {
            console.log(`\n===== ${q.name} (${err ? 'ERROR' : (recordset ? recordset.length : 0) + ' rows'}) =====`);
            if (err) {
                console.error(err.message);
            } else if (recordset && recordset.length > 0) {
                console.table(recordset);
            } else {
                console.log('  (no rows)');
            }
            remaining--;
            if (remaining === 0) {
                conn.close();
            }
        });
    });
});
