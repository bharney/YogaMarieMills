import express from 'express';
import {secret} from '../../secrets';
import jwt from 'jwt-simple';
import moment from 'moment';
import { executeQuery } from '../sqlQuery';

let scheduleRoutes = function () {

    const scheduleRouter = express.Router();

    scheduleRouter.route('/schedules')

        .post(function (req, res) {
            if (!req.headers.authorization) {
                return res.status(401).send({ message: "You are not authorized" });
            }
            const authorization = JSON.parse(req.headers.authorization.slice(7));
            const payload = jwt.decode(authorization.token, secret);
            if (!payload.sub) {
                return res.status(401).send({ message: "You are not authorized" });
            }
            if (moment().unix() > payload.exp) {
                return res.status(401).send({ message: "You are not authorized" });
            }
            let schedule = (req.body);
            executeQuery(
                `INSERT INTO Schedules (type, session_date)
                 VALUES (@type, @session_date);
                 SELECT SCOPE_IDENTITY() AS parent_id;`,
                function (request, sql) {
                    request.input('type', sql.VarChar, 'Schedule');
                    request.input('session_date', sql.Date, schedule.session_date);
                }
            ).then(function (recordset) {
                if (!recordset || recordset.length === 0) {
                    return res.status(500).send('Unable to create schedule parent row.');
                }
                const parentId = recordset[0].parent_id;
                const detailPromises = Object.keys(schedule.session_details || {}).map(function (prop) {
                    const detail = schedule.session_details[prop];
                    return executeQuery(
                        `INSERT INTO ScheduleDetails (type, session_time, class, parent_id)
                         VALUES (@type, @session_time, @class, @parent_id);`,
                        function (request, sql) {
                            request.input('parent_id', sql.Int, parentId);
                            request.input('type', sql.VarChar, 'ScheduleDetail');
                            request.input('session_time', sql.VarChar, detail.session_time);
                            request.input('class', sql.VarChar, detail.class);
                        }
                    );
                });
                return Promise.all(detailPromises).then(function () {
                    res.status(201).json(Object.assign({}, schedule, { id: parentId }));
                });
            }).catch(function (err) {
                console.log("schedules: " + err);
                res.status(500).send("Unable to save schedule.");
            });
        })
        .put(function (req, res) {
            if (!req.headers.authorization) {
                return res.status(401).send({ message: "You are not authorized" })
            }
            const authorization = JSON.parse(req.headers.authorization.slice(7));
            const payload = jwt.decode(authorization.token, secret);
            if (!payload.sub) {
                return res.status(401).send({ message: "You are not authorized" })
            }
            if (moment().unix() > payload.exp) {
                return res.status(401).send({ message: "You are not authorized" })
            }
            let schedule = (req.body);
            executeQuery(
                `UPDATE Schedules
                SET session_date = @session_date
                ,type = @type
                WHERE id = @id;`,
                function (request, sql) {
                    request.input('id', sql.Int, schedule.id);
                    request.input('type', sql.VarChar, 'Schedule');
                    request.input('session_date', sql.Date, schedule.session_date);
                }
            ).then(function () {
                const existingIds = (schedule.session_details || [])
                    .filter(function (d) { return d.id; })
                    .map(function (d) { return d.id; });
                const deleteDetailQuery = existingIds.length > 0
                    ? `DELETE FROM ScheduleDetails WHERE id NOT IN (${existingIds.join(',')}) AND parent_id = ${schedule.id}`
                    : `DELETE FROM ScheduleDetails WHERE parent_id = ${schedule.id}`;
                return executeQuery(deleteDetailQuery);
            }).then(function () {
                const savePromises = (schedule.session_details || []).map(function (detail) {
                    if (detail.id) {
                        return executeQuery(
                            `UPDATE ScheduleDetails
                            SET session_time = @session_time
                            ,type = @type
                            ,class = @class
                            ,parent_id = @parent_id
                            WHERE id = @id;`,
                            function (request, sql) {
                                request.input('id', sql.Int, detail.id);
                                request.input('session_time', sql.VarChar, detail.session_time);
                                request.input('type', sql.VarChar, 'ScheduleDetail');
                                request.input('class', sql.VarChar, detail.class);
                                request.input('parent_id', sql.Int, schedule.id);
                            }
                        );
                    }
                    return executeQuery(
                        `INSERT INTO ScheduleDetails (type, session_time, class, parent_id)
                        VALUES (@type, @session_time, @class, @parent_id);`,
                        function (request, sql) {
                            request.input('parent_id', sql.Int, schedule.id);
                            request.input('type', sql.VarChar, 'ScheduleDetail');
                            request.input('session_time', sql.VarChar, detail.session_time);
                            request.input('class', sql.VarChar, detail.class);
                        }
                    );
                });
                return Promise.all(savePromises);
            }).then(function () {
                res.status(201).json(schedule);
            }).catch(function (err) {
                console.log("schedule " + err);
                res.status(500).send("Unable to update schedule.");
            });
        })
        .delete(function (req, res) {
            if (!req.headers.authorization) {
                return res.status(401).send({ message: "You are not authorized" })
            }
            const authorization = JSON.parse(req.headers.authorization.slice(7));
            const payload = jwt.decode(authorization.token, secret);
            if (!payload.sub) {
                return res.status(401).send({ message: "You are not authorized" })
            }
            if (moment().unix() > payload.exp) {
                return res.status(401).send({ message: "You are not authorized" })
            }
            executeQuery(
                `DELETE FROM Schedules
                 WHERE id = @id`,
                function (request, sql) {
                    request.input('id', sql.Int, req.body.id);
                }
            ).then(function () {
                res.status(201).send("Schedule has been deleted.");
            }).catch(function (err) {
                console.log("delete schedule: " + err);
                res.status(500).send("Unable to delete schedule.");
            });
        })
        .get(function (req, res) {
            executeQuery(
                `SELECT
                    H.id
                    ,H.type AS type
                    ,H.venue AS venue
                    ,H.header AS header
                    ,H.description AS description
                    ,NULL AS session_date
                    ,NULL AS DateSort
                    ,NULL AS session_time
                    ,NULL AS class
                    ,NULL AS parent_id
                    FROM Headers H
                    WHERE H.type IN (SELECT SC.type FROM Schedules SC)

                    UNION ALL

                    SELECT
                    S.id
                    ,S.type AS type
                    ,NULL as venue
                    ,NULL as header
                    ,NULL as description
                    ,DATENAME(DW, S.session_date) + ' ' + CONVERT(VARCHAR, S.session_date, 107) AS session_date
                    ,S.session_date as DateSort
                    ,NULL AS session_time
                    ,NULL AS class
                    ,NULL AS parent_id
                    FROM Schedules S
                    WHERE session_date >= DATEADD(day, DATEDIFF(day, 0, GETDATE()), 0)

                    UNION ALL

                    SELECT
                    D.id
                    ,D.type AS type
                    ,NULL as venue
                    ,NULL as header
                    ,NULL as description
                    ,NULL AS session_date
                    ,NULL AS DateSort
                    ,D.session_time AS session_time
                    ,D.class AS class
                    ,D.parent_id AS parent_id
                    FROM ScheduleDetails D
                    ORDER BY header desc, DateSort`
            ).then(function (recordset) {
                    if (!recordset || recordset.length === 0) {
                        return res.json({
                            id: null,
                            type: 'Schedule',
                            header: '',
                            venue: '',
                            description: '',
                            session_dates: []
                        });
                    }

                    let schedulePage = {
                        id: recordset[0].id,
                        type: recordset[0].type,
                        header: recordset[0].header,
                        venue: recordset[0].venue,
                        description: recordset[0].description,
                        session_dates: []
                    };
                    let counter = 0;
                    for (let date_prop in recordset) {
                        if (recordset.hasOwnProperty(date_prop)) {
                            if (recordset[date_prop].session_date != null) {
                                let session_dates = {
                                    id: recordset[date_prop].id,
                                    type: recordset[date_prop].type,
                                    session_date: recordset[date_prop].session_date,
                                    session_details: []
                                };
                                schedulePage.session_dates.push(session_dates);

                                for (let time_prop in recordset) {
                                    if (recordset.hasOwnProperty(time_prop)) {
                                        if (recordset[time_prop].session_time != null) {
                                            if (recordset[date_prop].id == recordset[time_prop].parent_id) {
                                                let session_details = {
                                                    id: recordset[time_prop].id,
                                                    type: recordset[time_prop].type,
                                                    session_time: recordset[time_prop].session_time,
                                                    class: recordset[time_prop].class
                                                };
                                                schedulePage.session_dates[counter].session_details.push(session_details);
                                            }
                                        }
                                    }
                                }
                                counter++;
                            }
                        }
                    }
                    res.json(schedulePage);
                }).catch(function (err) {
                    console.log("schedules: " + err);
                    res.status(500).send("Unable to load schedules.");
                });
        });

    scheduleRouter.route('/schedules/:scheduleId')
        .get(function (req, res) {
            executeQuery(`SELECT
                        S.id
                        ,S.type AS type
                        ,DATENAME(DW, S.session_date) + ' ' + CONVERT(VARCHAR, S.session_date, 107) AS session_date
                        ,NULL AS session_time
                        ,NULL AS class
                        ,NULL AS parent_id
                        FROM Schedules S
                        WHERE id = @id

                        UNION ALL

                        SELECT
                        D.id
                        ,D.type AS type
                        ,NULL AS session_date
                        ,D.session_time AS session_time
                        ,D.class AS class
                        ,D.parent_id AS parent_id
                        FROM ScheduleDetails D
                        WHERE parent_id = @id`,
                function (request, sql) {
                    request.input('id', sql.Int, req.params.scheduleId);
                }
            ).then(function (recordset) {
                    if (recordset.length > 0) {
                        let session_dates = {
                            id: recordset[0].id,
                            session_date: recordset[0].session_date,
                            session_details: []
                        };
                        for (let time_prop in recordset) {
                            if (recordset.hasOwnProperty(time_prop)) {
                                if (recordset[time_prop].session_time != null) {
                                    let session_details = {
                                        id: recordset[time_prop].id,
                                        session_time: recordset[time_prop].session_time,
                                        class: recordset[time_prop].class
                                    };
                                    session_dates.session_details.push(session_details);
                                }
                            }
                        }
                        res.json(session_dates);
                    }
                    else {
                        res.status(500).send("No Schedule found with this ID.");
                    }
                }).catch(function (err) {
                    console.log("schedule: " + err);
                    res.status(500).send("Unable to load schedule.");
                });
        })
        .delete(function (req, res) {
            if (!req.headers.authorization) {
                return res.status(401).send({ message: "You are not authorized" })
            }
            const authorization = JSON.parse(req.headers.authorization.slice(7));
            const payload = jwt.decode(authorization.token, secret);
            if (!payload.sub) {
                return res.status(401).send({ message: "You are not authorized" })
            }
            if (moment().unix() > payload.exp) {
                return res.status(401).send({ message: "You are not authorized" })
            }
            executeQuery(
                `DELETE FROM Schedules
                 WHERE id = @id`,
                function (request, sql) {
                    request.input('id', sql.Int, req.params.scheduleId);
                }
            ).then(function () {
                res.status(201).send("Schedule has been deleted.");
            }).catch(function (err) {
                console.log("delete schedule: " + err);
                res.status(500).send("Unable to delete schedule.");
            });
        });

    return scheduleRouter;
};

module.exports = scheduleRoutes;

export default scheduleRoutes;
