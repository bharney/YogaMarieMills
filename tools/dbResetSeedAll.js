import sql from 'mssql';
import bcrypt from 'bcrypt-nodejs';
import { dbconfig } from '../secrets';

function exec(conn, query) {
    return new sql.Request(conn).query(query);
}

function esc(value) {
    if (value === null || value === undefined) return 'NULL';
    return `'${String(value).replace(/'/g, "''")}'`;
}

function idFrom(recordset) {
    const row = recordset && recordset[0] ? recordset[0] : null;
    if (!row || row.id === undefined || row.id === null) return null;
    return parseInt(row.id, 10);
}

function hashPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, null, null, function (err, hash) {
            if (err) return reject(err);
            resolve(hash);
        });
    });
}

async function resetAndSeed(conn) {
    console.log('Cleaning existing data...');

    await exec(conn, `DELETE FROM ScheduleDetails;`);
    await exec(conn, `DELETE FROM Schedules;`);
    await exec(conn, `DELETE FROM MassageDetails;`);
    await exec(conn, `DELETE FROM MassageTypes;`);
    await exec(conn, `DELETE FROM Consultations;`);
    await exec(conn, `DELETE FROM Testimonials;`);
    await exec(conn, `DELETE FROM EventTypes;`);
    await exec(conn, `DELETE FROM Costs;`);
    await exec(conn, `DELETE FROM ClassTypes;`);
    await exec(conn, `DELETE FROM Blogs;`);
    await exec(conn, `DELETE FROM Navbar_Items;`);
    await exec(conn, `DELETE FROM Headers;`);
    await exec(conn, `DELETE FROM Users;`);

    // Reset identities for predictable IDs.
    await exec(conn, `DBCC CHECKIDENT ('Users', RESEED, 0);`);
    await exec(conn, `DBCC CHECKIDENT ('Blogs', RESEED, 0);`);
    await exec(conn, `DBCC CHECKIDENT ('ClassTypes', RESEED, 0);`);
    await exec(conn, `DBCC CHECKIDENT ('Headers', RESEED, 0);`);
    await exec(conn, `DBCC CHECKIDENT ('Consultations', RESEED, 0);`);
    await exec(conn, `DBCC CHECKIDENT ('Costs', RESEED, 0);`);
    await exec(conn, `DBCC CHECKIDENT ('EventTypes', RESEED, 0);`);
    await exec(conn, `DBCC CHECKIDENT ('Navbar_Items', RESEED, 0);`);
    await exec(conn, `DBCC CHECKIDENT ('MassageTypes', RESEED, 0);`);
    await exec(conn, `DBCC CHECKIDENT ('MassageDetails', RESEED, 0);`);
    await exec(conn, `DBCC CHECKIDENT ('Schedules', RESEED, 0);`);
    await exec(conn, `DBCC CHECKIDENT ('ScheduleDetails', RESEED, 0);`);
    await exec(conn, `DBCC CHECKIDENT ('Testimonials', RESEED, 0);`);

    console.log('Seeding data for all tables...');

    const seedAdminEmail = process.env.SEED_ADMIN_EMAIL;
    const seedAdminPassword = process.env.SEED_ADMIN_PASSWORD;
    const seedAdminFirstName = process.env.SEED_ADMIN_FIRST_NAME || 'Admin';
    const seedAdminLastName = process.env.SEED_ADMIN_LAST_NAME || 'User';

    if (!seedAdminEmail || !seedAdminPassword) {
        throw new Error('Missing SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD in environment.');
    }

    const adminHash = await hashPassword(seedAdminPassword);
    await exec(conn, `
        INSERT INTO Users (emailAddress, firstName, lastName, password, createdDate)
        VALUES (${esc(seedAdminEmail)}, ${esc(seedAdminFirstName)}, ${esc(seedAdminLastName)}, ${esc(adminHash)}, GETUTCDATE());
    `);

    await exec(conn, `
        INSERT INTO Headers (type, header, short, description, venue) VALUES
        ('diet', 'Diet Consultation', 'Contemporary Ayurvedic nutrition guidance tailored to your routine and goals.', '{"blocks":[{"key":"diet1","text":"A practical consultation that combines Ayurvedic principles with modern nutrition so you can build sustainable habits.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"diet2","text":"Sessions are one-to-one and include recommendations for meals, timing, digestion, sleep, and stress support.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}', 'Yoga Studio, Thurles'),
        ('Schedule', 'Schedule', 'Weekly timetable for Yoga Thurles classes and bespoke booking options.', '', 'Yoga Studio, Thurles'),
        ('Testimonial', 'Testimonials', 'Feedback from clients and students attending Yoga and Ayurveda sessions.', '{"blocks":[{"key":"test1","text":"Real experiences from students and clients working with Marie Mills in Thurles.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}', 'Thurles'),
        ('Body', 'Body Massage', 'Ayurvedic body massage therapies for relaxation and balance.', 'Ayurvedic body massage therapies for relaxation and balance.', 'Yoga Studio, Thurles'),
        ('Face', 'Face Massage', 'Ayurvedic facial massage to support circulation and calm.', 'Ayurvedic facial massage to support circulation and calm.', 'Yoga Studio, Thurles'),
        ('Scalp', 'Scalp Massage', 'Ayurvedic scalp therapies for tension and stress relief.', 'Ayurvedic scalp therapies for tension and stress relief.', 'Yoga Studio, Thurles'),
        ('Retreat', 'Yoga Retreat', 'Seasonal events, workshops, and restorative days.', '', 'Thurles, Co. Tipperary');
    `);

    await exec(conn, `
        SET IDENTITY_INSERT Navbar_Items ON;
        INSERT INTO Navbar_Items (id, type, name, route, href, parent_id) VALUES
        (1, 'YogaThurles', 'Yoga Thurles', 'YogaThurles', '', NULL),
        (2, 'Ayurveda', 'Ayurveda', 'Ayurveda', '', NULL),
        (3, 'Blog', 'Blog', 'Blogs', '', NULL),
        (4, 'About', 'About', 'About', '', NULL),
        (20, 'Events', 'Events', 'Events', '', NULL);
        SET IDENTITY_INSERT Navbar_Items OFF;

        INSERT INTO Navbar_Items (type, name, route, href, parent_id) VALUES
        ('YogaThurles', 'Schedule', 'YogaThurles/Schedule', '', 1),
        ('YogaThurles', 'Class Types', 'YogaThurles/ClassTypes', '', 1),
        ('YogaThurles', 'Costs', 'YogaThurles/Costs', '', 1),
        ('YogaThurles', 'What to Bring', 'YogaThurles/WhatToBring', '', 1),
        ('Ayurveda', 'Massage', 'Ayurveda/Massage', '', 2),
        ('Ayurveda', 'Diet Consultation', 'Ayurveda/DietConsultation', '', 2),
        ('Ayurveda', 'Testimonials', 'Ayurveda/Testimonials', '', 2);
    `);

    await exec(conn, `
        INSERT INTO Blogs (title, short, description, image, href, type, component)
        VALUES
        ('Welcome to Yoga Marie Mills in Thurles', 'A local space for yoga, meditation, Ayurveda, and practical stress reduction.', '{"blocks":[{"key":"blog1","text":"Yoga Marie Mills offers classes and one-to-one sessions in Thurles focused on sustainable wellbeing.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"blog2","text":"The approach combines movement, breath, mindfulness, and Ayurvedic tools to support everyday life.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}', 'yogaImg1.jpg', 'Blog/1', 'blog', 'BlogPage'),
        ('Simple Breathwork for Busy Days', 'A short breathing practice to reset your energy in under five minutes.', '{"blocks":[{"key":"blog3","text":"Try this sequence: inhale for four, exhale for six, and repeat for ten rounds while relaxing your shoulders.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"blog4","text":"Consistent daily practice can improve focus, calm, and sleep quality over time.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}', 'yogaImg2.jpg', 'Blog/2', 'blog', 'BlogPage'),
        ('Evening Routine for Better Sleep', 'A gentle wind-down sequence using breath, light movement, and less screen time.', '{"blocks":[{"key":"blog5","text":"Start with five minutes of slower breathing, followed by simple seated stretches and a short body scan.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"blog6","text":"A regular evening routine can improve sleep quality and reduce late-night stress spikes.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}', 'yogaImg3.jpg', 'Blog/3', 'blog', 'BlogPage'),
        ('Ayurveda in Daily Life: Start Small', 'Simple habits from Ayurveda that fit modern schedules.', '{"blocks":[{"key":"blog7","text":"Small changes such as mealtime consistency, hydration, and mindful pauses can make a measurable difference.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"blog8","text":"Focus on one change at a time and build gradually for sustainable results.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}', 'landing.jpg', 'Blog/4', 'blog', 'BlogPage'),
        ('What to Expect in Your First Yoga Class', 'A practical guide for beginners joining Yoga Thurles classes.', '{"blocks":[{"key":"blog9","text":"Bring comfortable clothing, a bottle of water, and an open mind. Classes are friendly and adaptable.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"blog10","text":"You will be guided through breath, movement, and options for your level.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}', 'color-blur.jpg', 'Blog/5', 'blog', 'BlogPage');
    `);

    await exec(conn, `
        INSERT INTO ClassTypes (type, title, short, description, image, href, component, detail, route)
        VALUES
        ('ClassType', 'Yoga Foundations', 'Beginner-friendly classes in breath, alignment, and mindful movement.', '{"blocks":[{"key":"class1","text":"An accessible class for all levels with options to support confidence, posture, and mobility.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"class2","text":"Ideal if you are returning to movement or beginning your yoga practice.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}', 'yogaImg1.jpg', '', 'ClassTypePage', '', 'YogaThurles/ClassType'),
        ('ClassType', 'Evening Flow & Restore', 'A balanced evening session to release tension and reset.', '{"blocks":[{"key":"class3","text":"This class blends steady movement with restorative shapes and guided breath to help unwind.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"class4","text":"Suitable for mixed abilities and useful for managing stress after work.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}', 'yogaImg2.jpg', '', 'ClassTypePage', '', 'YogaThurles/ClassType'),
        ('ClassType', 'Bespoke Private Yoga', 'One-to-one or small-group classes tailored to your needs.', '{"blocks":[{"key":"class5","text":"Private sessions are designed around mobility, stress reduction, confidence, and specific goals.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"class6","text":"Suitable for beginners, returners, and students who prefer personal pacing.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}', 'Profile400x589.jpg', '', 'ClassTypePage', '', 'YogaThurles/ClassType'),
        ('ClassType', 'Meditation & Breath', 'A calm class focused on breath regulation and mindfulness.', '{"blocks":[{"key":"class7","text":"Learn simple techniques for focus, relaxation, and nervous system balance.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"class8","text":"Excellent alongside regular yoga practice and busy work schedules.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}', 'yogaImg3.jpg', '', 'ClassTypePage', '', 'YogaThurles/ClassType');
    `);

    await exec(conn, `
        INSERT INTO Costs (type, course, cost, duration, description, package, sequence)
        VALUES
        ('YogaThurles', 'Drop-in Class', '18.00', '1 hour', 'Single class access with no commitment', '', 1),
        ('YogaThurles', '5 Class Pass', '80.00', '5 sessions', 'Flexible pass for regular weekly practice', 'Popular', 2),
        ('YogaThurles', '10 Class Pass', '150.00', '10 sessions', 'Best value for ongoing attendance', 'Best Value', 3),
        ('YogaThurles', 'Private 1:1 Session', '55.00', '60 minutes', 'Tailored yoga or breathwork session', '', 4),
        ('YogaThurles', 'Corporate Wellness Session', '180.00', '90 minutes', 'On-site stress reduction and mobility class for teams', '', 5);
    `);

    const bodyMassageId = idFrom(await exec(conn, `
        INSERT INTO MassageTypes (type, title, session_time, description, cost, icon, iconHeight, iconWidth)
        VALUES ('Body', 'Body and Back Massage', '60 minutes', 'A grounding Ayurvedic treatment for whole-body relaxation and circulation.', '75.00', 'whitearomaoil.png', '3em', '1.8em');
        SELECT SCOPE_IDENTITY() AS id;
    `));

    const faceMassageId = idFrom(await exec(conn, `
        INSERT INTO MassageTypes (type, title, session_time, description, cost, icon, iconHeight, iconWidth)
        VALUES ('Face', 'Face Massage', '45 minutes', 'A gentle facial massage to support skin tone and calm the nervous system.', '55.00', 'whitearomaoil.png', '3em', '1.8em');
        SELECT SCOPE_IDENTITY() AS id;
    `));

    const scalpMassageId = idFrom(await exec(conn, `
        INSERT INTO MassageTypes (type, title, session_time, description, cost, icon, iconHeight, iconWidth)
        VALUES ('Scalp', 'Scalp Massage', '40 minutes', 'Focused scalp, neck, and shoulder therapy to ease tension and mental fatigue.', '50.00', 'whitearomaoil.png', '3em', '1.8em');
        SELECT SCOPE_IDENTITY() AS id;
    `));

    const bodyTherapyId = idFrom(await exec(conn, `
        INSERT INTO MassageTypes (type, title, session_time, description, cost, icon, iconHeight, iconWidth)
        VALUES ('Body', 'Therapeutic Back Release', '45 minutes', 'Targeted upper-back, neck, and shoulder release for desk-related tension.', '60.00', 'whitearomaoil.png', '3em', '1.8em');
        SELECT SCOPE_IDENTITY() AS id;
    `));

    const faceLiftId = idFrom(await exec(conn, `
        INSERT INTO MassageTypes (type, title, session_time, description, cost, icon, iconHeight, iconWidth)
        VALUES ('Face', 'Facial Lift Massage', '50 minutes', 'A calming facial ritual focused on circulation and natural tone.', '65.00', 'whitearomaoil.png', '3em', '1.8em');
        SELECT SCOPE_IDENTITY() AS id;
    `));

    await exec(conn, `
        INSERT INTO MassageDetails (type, title, description, parent_id) VALUES
        ('MassageDetail', 'Hands Add-on', 'Optional focused treatment for hands and wrists.', ${bodyMassageId}),
        ('MassageDetail', 'Feet Add-on', 'Optional focused treatment for feet and ankles.', ${bodyMassageId}),
        ('MassageDetail', 'Natural Oils Included', 'Nourishing oils selected for your skin type.', ${faceMassageId}),
        ('MassageDetail', 'Neck Release Add-on', 'Extended neck and shoulder release.', ${scalpMassageId}),
        ('MassageDetail', 'Desk Tension Focus', 'Focused release across traps, neck, and upper back.', ${bodyTherapyId}),
        ('MassageDetail', 'Jaw & Temple Calm', 'Gentle release around jaw and temples to reduce strain.', ${faceLiftId});
    `);

    await exec(conn, `
        INSERT INTO Consultations (type, title, session_time, short, description, cost, icon, iconHeight, iconWidth)
        VALUES
        ('diet', 'Initial Consultation', '60 minutes', 'Personalised consultation', 'A one-to-one session to review routine, digestion, food patterns, and practical next steps.', '75.00', 'whitehop.png', '3em', '3em'),
        ('diet', 'Follow-up Consultation', '45 minutes', 'Track your progress', 'Review outcomes, refine your plan, and build consistency week to week.', '55.00', 'whitehop.png', '3em', '3em'),
        ('diet', 'Digestive Health Focus', '45 minutes', 'Digestive support consultation', 'Focused support for bloating, meal timing, and digestion-friendly routines.', '55.00', 'whitehop.png', '3em', '3em'),
        ('diet', 'Seasonal Reset Session', '60 minutes', 'Align with the season', 'A practical seasonal reset for food, movement, sleep, and stress balance.', '70.00', 'whitehop.png', '3em', '3em');
    `);

    const scheduleOneId = idFrom(await exec(conn, `
        INSERT INTO Schedules (type, session_date)
        VALUES ('Schedule', DATEADD(day, 1, CONVERT(date, GETDATE())));
        SELECT SCOPE_IDENTITY() AS id;
    `));

    const scheduleTwoId = idFrom(await exec(conn, `
        INSERT INTO Schedules (type, session_date)
        VALUES ('Schedule', DATEADD(day, 3, CONVERT(date, GETDATE())));
        SELECT SCOPE_IDENTITY() AS id;
    `));

    const scheduleThreeId = idFrom(await exec(conn, `
        INSERT INTO Schedules (type, session_date)
        VALUES ('Schedule', DATEADD(day, 5, CONVERT(date, GETDATE())));
        SELECT SCOPE_IDENTITY() AS id;
    `));

    const scheduleFourId = idFrom(await exec(conn, `
        INSERT INTO Schedules (type, session_date)
        VALUES ('Schedule', DATEADD(day, 6, CONVERT(date, GETDATE())));
        SELECT SCOPE_IDENTITY() AS id;
    `));

    await exec(conn, `
        INSERT INTO ScheduleDetails (type, session_time, class, parent_id) VALUES
        ('ScheduleDetail', '10:00', 'Yoga Foundations', ${scheduleOneId}),
        ('ScheduleDetail', '18:00', 'Evening Flow & Restore', ${scheduleOneId}),
        ('ScheduleDetail', '09:30', 'Gentle Morning Yoga', ${scheduleTwoId}),
        ('ScheduleDetail', '17:30', 'Stress Reduction Yoga', ${scheduleTwoId}),
        ('ScheduleDetail', '08:30', 'Meditation & Breath', ${scheduleThreeId}),
        ('ScheduleDetail', '19:00', 'Bespoke Private Yoga', ${scheduleThreeId}),
        ('ScheduleDetail', '10:30', 'Weekend Reset Flow', ${scheduleFourId}),
        ('ScheduleDetail', '12:00', 'Chair Yoga Basics', ${scheduleFourId});
    `);

    await exec(conn, `
        INSERT INTO Testimonials (type, testimonial, name) VALUES
        ('Testimonial', 'Marie creates a warm and welcoming space. The classes are clear, calming, and easy to follow.', 'Aoife M.'),
        ('Testimonial', 'The Ayurvedic massage sessions helped me reduce stress and improve sleep within a few weeks.', 'Brian K.'),
        ('Testimonial', 'I joined as a complete beginner and now feel stronger, calmer, and more confident each week.', 'Sarah L.'),
        ('Testimonial', 'The breathwork tools are practical and have made a real difference to my focus during work.', 'Michael D.'),
        ('Testimonial', 'Private sessions were tailored to exactly what I needed after a long period of back tension.', 'Niamh O.''R.'),
        ('Testimonial', 'Friendly atmosphere, clear teaching, and thoughtful guidance every class.', 'Tom C.');
    `);

    await exec(conn, `
        INSERT INTO EventTypes (type, title, session_time, short, description, cost, image, start_date, end_date)
        VALUES
        ('Retreat', 'Spring Yoga Retreat', 'Weekend', 'A restorative retreat experience.', 'Two-day retreat in Thurles featuring yoga practice, guided meditation, and practical Ayurvedic self-care.', '249.00', 'landing.jpg', DATEADD(day, 30, CONVERT(date, GETDATE())), DATEADD(day, 31, CONVERT(date, GETDATE()))),
        ('Retreat', 'Summer Day Workshop', '10:00 - 16:00', 'One-day immersion.', 'A one-day workshop focused on breathwork, mindful movement, and stress reduction tools for daily life.', '99.00', 'color-blur.jpg', DATEADD(day, 60, CONVERT(date, GETDATE())), DATEADD(day, 60, CONVERT(date, GETDATE()))),
        ('Retreat', 'Autumn Grounding Workshop', '11:00 - 15:00', 'Seasonal grounding practices.', 'Half-day session with grounding flow, restorative postures, and practical routines for autumn.', '85.00', 'yogaImg3.jpg', DATEADD(day, 90, CONVERT(date, GETDATE())), DATEADD(day, 90, CONVERT(date, GETDATE()))),
        ('Retreat', 'Winter Calm Reset', '09:30 - 13:30', 'Winter wellbeing reset.', 'A gentle winter workshop focused on calm energy, mobility, and simple daily stress-reduction habits.', '85.00', 'yogaImg2.jpg', DATEADD(day, 120, CONVERT(date, GETDATE())), DATEADD(day, 120, CONVERT(date, GETDATE())));
    `);

    console.log('Reset + seed complete for all application tables.');
}

const conn = new sql.Connection(dbconfig, function (err) {
    if (err) {
        console.error('Connection error:', err.message);
        process.exit(1);
    }

    resetAndSeed(conn)
        .then(() => {
            conn.close();
            process.exit(0);
        })
        .catch((seedErr) => {
            console.error('Seed error:', seedErr.message);
            conn.close();
            process.exit(1);
        });
});
