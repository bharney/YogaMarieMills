import sql from 'mssql';
import { dbconfig } from '../secrets';

/*
  Navbar structure expected by the app:
  - parent_id NULL  → top-level nav item (shows in desktop nav as dropdown or link)
  - parent_id = N   → child of the row with id = N (shows as dropdown sub-item)

  The navbars controller assembles: parent rows → subMenu arrays built from children.
  The desktop nav renders items that have a subMenu (i.e. top-level parents with children).
  The mobile drawer renders all items.
*/

const topLevel = [
    // id 20 already seeded as 'Events' parent — keep in sync
    { id: 20, type: 'Events',      name: 'Events',      route: 'Events',      href: '', parent_id: null },
    { id: 1,  type: 'YogaThurles', name: 'Yoga Thurles', route: 'YogaThurles', href: '', parent_id: null },
    { id: 2,  type: 'Ayurveda',    name: 'Ayurveda',    route: 'Ayurveda',    href: '', parent_id: null },
    { id: 3,  type: 'Blog',        name: 'Blog',         route: 'Blogs',       href: '', parent_id: null },
    { id: 4,  type: 'About',       name: 'About',        route: 'About',       href: '', parent_id: null },
    { id: 5,  type: 'Login',       name: 'Login',        route: 'Login',       href: '', parent_id: null },
];

const children = [
    // Yoga Thurles sub-menu (parent_id = 1)
    { type: 'YogaThurles', name: 'Schedule',    route: 'YogaThurles/Schedule',   href: '', parent_id: 1 },
    { type: 'YogaThurles', name: 'Class Types', route: 'YogaThurles/ClassTypes', href: '', parent_id: 1 },
    { type: 'YogaThurles', name: 'Costs',       route: 'YogaThurles/Costs',      href: '', parent_id: 1 },
    { type: 'YogaThurles', name: 'What to Bring', route: 'YogaThurles/WhatToBring', href: '', parent_id: 1 },

    // Ayurveda sub-menu (parent_id = 2)
    { type: 'Ayurveda', name: 'Massage',           route: 'Ayurveda/Massage',           href: '', parent_id: 2 },
    { type: 'Ayurveda', name: 'Diet Consultation', route: 'Ayurveda/DietConsultation',  href: '', parent_id: 2 },
    { type: 'Ayurveda', name: 'Testimonials',      route: 'Ayurveda/Testimonials',      href: '', parent_id: 2 },
];

const conn = new sql.Connection(dbconfig, function (connErr) {
    if (connErr) {
        console.error('Connection error:', connErr);
        process.exit(1);
    }

    // Remove stale entries that are no longer in the canonical list
    const staleNames = ['Body Massage', 'Face Massage', 'Scalp Massage'];
    const cleanupR = new sql.Request(conn);
    cleanupR.query(
        `DELETE FROM Navbar_Items WHERE name IN ('${staleNames.join("','")}')`,
        function (err) {
            if (err) console.error('Cleanup error:', err.message);
            else console.log('  [cleanup] removed stale massage nav entries');
        }
    );

    let remaining = topLevel.length + children.length;
    let errors = 0;

    function done() {
        remaining--;
        if (remaining === 0) {
            console.log(`\nNavbar seeding complete. Errors: ${errors}`);
            conn.close();
            process.exit(errors > 0 ? 1 : 0);
        }
    }

    // Insert top-level items with explicit IDs
    topLevel.forEach(item => {
        const r = new sql.Request(conn);
        r.input('id',       sql.Int,     item.id);
        r.input('type',     sql.VarChar, item.type);
        r.input('name',     sql.VarChar, item.name);
        r.input('route',    sql.VarChar, item.route);
        r.input('href',     sql.VarChar, item.href);
        r.input('parent_id', sql.Int,    item.parent_id);
        r.query(`
            IF NOT EXISTS (SELECT 1 FROM Navbar_Items WHERE id = @id)
            BEGIN
                SET IDENTITY_INSERT Navbar_Items ON;
                INSERT INTO Navbar_Items (id, type, name, route, href, parent_id)
                VALUES (@id, @type, @name, @route, @href, @parent_id);
                SET IDENTITY_INSERT Navbar_Items OFF;
                SELECT 'inserted' AS result;
            END
            ELSE
                SELECT 'exists' AS result;
        `, function (err, recordset) {
            if (err) {
                console.error(`  ERROR [${item.name}]:`, err.message);
                errors++;
            } else {
                console.log(`  [${item.name}] ${recordset[0].result}`);
            }
            done();
        });
    });

    // Insert or update children (upsert by name + parent_id so re-running updates routes)
    children.forEach(item => {
        const r = new sql.Request(conn);
        r.input('type',     sql.VarChar, item.type);
        r.input('name',     sql.VarChar, item.name);
        r.input('route',    sql.VarChar, item.route);
        r.input('href',     sql.VarChar, item.href);
        r.input('parent_id', sql.Int,    item.parent_id);
        r.query(`
            IF EXISTS (SELECT 1 FROM Navbar_Items WHERE name = @name AND parent_id = @parent_id)
            BEGIN
                UPDATE Navbar_Items SET route = @route, type = @type, href = @href
                WHERE name = @name AND parent_id = @parent_id;
                SELECT 'updated' AS result;
            END
            ELSE
            BEGIN
                INSERT INTO Navbar_Items (type, name, route, href, parent_id)
                VALUES (@type, @name, @route, @href, @parent_id);
                SELECT 'inserted' AS result;
            END
        `, function (err, recordset) {
            if (err) {
                console.error(`  ERROR [${item.name}]:`, err.message);
                errors++;
            } else {
                console.log(`  [${item.name}] ${recordset[0].result}`);
            }
            done();
        });
    });
});
