import express from 'express';
import sql from 'mssql';
import {secret, dbconfig} from '../../secrets';
import jwt from 'jwt-simple';
import moment from 'moment';

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
            const sqlInsertSchedule = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlInsertSchedule);
                request.input('type', sql.VarChar, 'Schedule');
                request.input('session_date', sql.Date, schedule.session_date);
                request.query(
                    `INSERT INTO Schedules (type, session_date)
                     VALUES (@type, @session_date); 
                     SELECT SCOPE_IDENTITY() AS parent_id;`
                ).then(function (recordset) {
                    for (let prop in schedule.session_details) {
                        if (schedule.session_details.hasOwnProperty(prop)) {
                            const sqlInsertScheduleDetails = new sql.Connection(dbconfig, function () {
                                let request = new sql.Request(sqlInsertScheduleDetails);
                                request.input('parent_id', sql.Int, recordset[0].parent_id);
                                request.input('type', sql.VarChar, 'ScheduleDetail');
                                request.input('session_time', sql.VarChar, schedule.session_details[prop].session_time);
                                request.input('class', sql.VarChar, schedule.session_details[prop].class);
                                request.query(
                                    `INSERT INTO ScheduleDetails (type, session_time, class, parent_id)
                                     VALUES (@type, @session_time, @class, @parent_id);`
                                ).then(
                                    console.log(schedule.session_details[prop])
                                    ).catch(function (err) {
                                        console.log("scheduleDetails: " + err);
                                    });
                            });
                        }
                    }
                }).catch(function (err) {
                    console.log("schedules: " + err);
                });
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
            const sqlUpdateSchedule = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlUpdateSchedule);
                request.input('id', sql.Int, schedule.id);
                request.input('type', sql.VarChar, 'Schedule');
                request.input('session_date', sql.Date, schedule.session_date);
                request.query(
                    `UPDATE Schedules
                    SET session_date = @session_date
                    ,type = @type
                    WHERE id = @id;`
                ).then(function () {
                        const sqlDeleteScheduleDetails = new sql.Connection(dbconfig, function () {
                        let request = new sql.Request(sqlDeleteScheduleDetails);
                        request.input('parent_id', sql.Int, schedule.id);
                        request.query(
                            `DELETE FROM ScheduleDetails
                            WHERE id NOT IN (${schedule.session_details.filter(session_details => session_details.id).map(function(obj){return obj.id;}).join(',')})
                            AND parent_id = @parent_id;`
                        ).then(function () {
                                for (let prop in schedule.session_details) {
                                    if (schedule.session_details.hasOwnProperty(prop)) {
                                        if (schedule.session_details[prop].id) {
                                            const sqlInsertScheduleDetails = new sql.Connection(dbconfig, function () {
                                                let request = new sql.Request(sqlInsertScheduleDetails);
                                                request.input('id', sql.Int, schedule.session_details[prop].id);
                                                request.input('session_time', sql.VarChar, schedule.session_details[prop].session_time);
                                                request.input('type', sql.VarChar, 'ScheduleDetail');
                                                request.input('class', sql.VarChar, schedule.session_details[prop].class);
                                                request.input('parent_id', sql.Int, schedule.id);
                                                request.query(
                                                    `UPDATE ScheduleDetails
                                                    SET session_time = @session_time
                                                    ,type = @type
                                                    ,class = @class
                                                    ,parent_id = @parent_id
                                                    WHERE id = @id;`
                                                ).then(console.log("ScheduleDetails Updated")
                                                ).catch(function (err) {
                                                    console.log("update scheduleDetails: " + err);
                                                });
                                            });
                                        } 
                                        else {
                                        const sqlInsertScheduleDetails = new sql.Connection(dbconfig, function () {
                                            let request = new sql.Request(sqlInsertScheduleDetails);
                                            request.input('parent_id', sql.Int, schedule.id);
                                            request.input('type', sql.VarChar, 'ScheduleDetail');
                                            request.input('session_time', sql.VarChar, schedule.session_details[prop].session_time);
                                            request.input('class', sql.VarChar, schedule.session_details[prop].class);
                                            request.query(
                                                `INSERT INTO ScheduleDetails (type, session_time, class, parent_id)
                                                VALUES (@type, @session_time, @class, @parent_id);`
                                            ).then(console.log("ScheduleDetails Inserted")
                                            ).catch(function (err) {
                                                console.log("insert scheduleDetails: " + err);
                                            });
                                        });
                                    }
                                }
                            }          
                        }).catch(function (err) {
                            console.log("schedule delete" + err);
                        });
                    });
                }).catch(function (err) {
                        console.log("schedule " + err);
                });
            })
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
            const sqlDeleteSchedule = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlDeleteSchedule);
                request.input('id', sql.Int, req.body.id);
                request.query(
                    `DELETE FROM Schedules
                     WHERE id = @id`
                ).then(res.status(201).send("Schedule has been deleted.")
                ).catch(function (err) {
                    console.log("delete schedule: " + err);
                });
            });
        })
        .get(function (req, res) {
            const sqlSchedules = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlSchedules);
                request.query(
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
                });
            });
        });

    scheduleRouter.route('/schedules/:scheduleId')
        .get(function (req, res) {
            const sqlSchedule = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlSchedule);
                request.input('id', sql.Int, req.params.scheduleId);
                request.query(`SELECT
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
                        WHERE parent_id = @id`
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
                });
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
            const sqlDeleteSchedule = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlDeleteSchedule);
                request.input('id', sql.Int, req.params.scheduleId);
                request.query(
                    `DELETE FROM Schedules
                     WHERE id = @id`
                ).then(res.status(201).send("Schedule has been deleted.")).catch(function (err) {
                    console.log("delete schedule: " + err);
                });
            });
        });

    return scheduleRouter;
};

module.exports = scheduleRoutes;

export default scheduleRoutes;