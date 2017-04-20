'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mssql = require('mssql');

var _mssql2 = _interopRequireDefault(_mssql);

var _secrets = require('../secrets');

var _secrets2 = _interopRequireDefault(_secrets);

var _jwtSimple = require('jwt-simple');

var _jwtSimple2 = _interopRequireDefault(_jwtSimple);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scheduleRoutes = function scheduleRoutes() {

    var scheduleRouter = _express2.default.Router();
    var dbconfig = "mssql://yogamariemills:!Testing123@yogamariemills.database.windows.net/YogaMarieMills?encrypt=true";

    scheduleRouter.route('/schedules').post(function (req, res) {
        if (!req.headers.authorization) {
            return res.status(401).send({ message: "You are not authorized" });
        }
        var authorization = JSON.parse(req.headers.authorization.slice(7));
        var payload = _jwtSimple2.default.decode(authorization.token, _secrets2.default);
        if (!payload.sub) {
            return res.status(401).send({ message: "You are not authorized" });
        }
        if ((0, _moment2.default)().unix() > payload.exp) {
            return res.status(401).send({ message: "You are not authorized" });
        }
        var schedule = req.body;
        var sqlInsertSchedule = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlInsertSchedule);
            request.input('type', _mssql2.default.VarChar, 'Schedule');
            request.input('session_date', _mssql2.default.Date, schedule.session_date);
            request.query('INSERT INTO Schedules (type, session_date)\n                     VALUES (@type, @session_date); \n                     SELECT SCOPE_IDENTITY() AS parent_id;').then(function (recordset) {
                var _loop = function _loop(prop) {
                    if (schedule.session_details.hasOwnProperty(prop)) {
                        var sqlInsertScheduleDetails = new _mssql2.default.Connection(dbconfig, function () {
                            var request = new _mssql2.default.Request(sqlInsertScheduleDetails);
                            request.input('parent_id', _mssql2.default.Int, recordset[0].parent_id);
                            request.input('type', _mssql2.default.VarChar, 'ScheduleDetail');
                            request.input('session_time', _mssql2.default.VarChar, schedule.session_details[prop].session_time);
                            request.input('class', _mssql2.default.VarChar, schedule.session_details[prop].class);
                            request.query('INSERT INTO ScheduleDetails (type, session_time, class, parent_id)\n                                     VALUES (@type, @session_time, @class, @parent_id);').then(console.log(schedule.session_details[prop])).catch(function (err) {
                                console.log("scheduleDetails: " + err);
                            });
                        });
                    }
                };

                for (var prop in schedule.session_details) {
                    _loop(prop);
                }
            }).catch(function (err) {
                console.log("schedules: " + err);
            });
        });
    }).put(function (req, res) {
        if (!req.headers.authorization) {
            return res.status(401).send({ message: "You are not authorized" });
        }
        var authorization = JSON.parse(req.headers.authorization.slice(7));
        var payload = _jwtSimple2.default.decode(authorization.token, _secrets2.default);
        if (!payload.sub) {
            return res.status(401).send({ message: "You are not authorized" });
        }
        if ((0, _moment2.default)().unix() > payload.exp) {
            return res.status(401).send({ message: "You are not authorized" });
        }
        var schedule = req.body;
        var sqlUpdateSchedule = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlUpdateSchedule);
            request.input('id', _mssql2.default.Int, schedule.id);
            request.input('type', _mssql2.default.VarChar, 'Schedule');
            request.input('session_date', _mssql2.default.Date, schedule.session_date);
            request.query('UPDATE Schedules\n                    SET session_date = @session_date\n                    ,type = @type\n                    WHERE id = @id;').then(function () {
                var sqlDeleteScheduleDetails = new _mssql2.default.Connection(dbconfig, function () {
                    var request = new _mssql2.default.Request(sqlDeleteScheduleDetails);
                    request.input('parent_id', _mssql2.default.Int, schedule.id);
                    request.query('DELETE FROM ScheduleDetails\n                            WHERE id NOT IN (' + schedule.session_details.filter(function (session_details) {
                        return session_details.id;
                    }).map(function (obj) {
                        return obj.id;
                    }).join(',') + ')\n                            AND parent_id = @parent_id;').then(function () {
                        var _loop2 = function _loop2(prop) {
                            if (schedule.session_details.hasOwnProperty(prop)) {
                                if (schedule.session_details[prop].id) {
                                    var sqlInsertScheduleDetails = new _mssql2.default.Connection(dbconfig, function () {
                                        var request = new _mssql2.default.Request(sqlInsertScheduleDetails);
                                        request.input('id', _mssql2.default.Int, schedule.session_details[prop].id);
                                        request.input('session_time', _mssql2.default.VarChar, schedule.session_details[prop].session_time);
                                        request.input('type', _mssql2.default.VarChar, 'ScheduleDetail');
                                        request.input('class', _mssql2.default.VarChar, schedule.session_details[prop].class);
                                        request.input('parent_id', _mssql2.default.Int, schedule.id);
                                        request.query('UPDATE ScheduleDetails\n                                                    SET session_time = @session_time\n                                                    ,type = @type\n                                                    ,class = @class\n                                                    ,parent_id = @parent_id\n                                                    WHERE id = @id;').then(console.log("ScheduleDetails Updated")).catch(function (err) {
                                            console.log("update scheduleDetails: " + err);
                                        });
                                    });
                                } else {
                                    var _sqlInsertScheduleDetails = new _mssql2.default.Connection(dbconfig, function () {
                                        var request = new _mssql2.default.Request(_sqlInsertScheduleDetails);
                                        request.input('parent_id', _mssql2.default.Int, schedule.id);
                                        request.input('type', _mssql2.default.VarChar, 'ScheduleDetail');
                                        request.input('session_time', _mssql2.default.VarChar, schedule.session_details[prop].session_time);
                                        request.input('class', _mssql2.default.VarChar, schedule.session_details[prop].class);
                                        request.query('INSERT INTO ScheduleDetails (type, session_time, class, parent_id)\n                                                VALUES (@type, @session_time, @class, @parent_id);').then(console.log("ScheduleDetails Inserted")).catch(function (err) {
                                            console.log("insert scheduleDetails: " + err);
                                        });
                                    });
                                }
                            }
                        };

                        for (var prop in schedule.session_details) {
                            _loop2(prop);
                        }
                    }).catch(function (err) {
                        console.log("schedule delete" + err);
                    });
                });
            }).catch(function (err) {
                console.log("schedule " + err);
            });
        });
    }).delete(function (req, res) {
        if (!req.headers.authorization) {
            return res.status(401).send({ message: "You are not authorized" });
        }
        var authorization = JSON.parse(req.headers.authorization.slice(7));
        var payload = _jwtSimple2.default.decode(authorization.token, _secrets2.default);
        if (!payload.sub) {
            return res.status(401).send({ message: "You are not authorized" });
        }
        if ((0, _moment2.default)().unix() > payload.exp) {
            return res.status(401).send({ message: "You are not authorized" });
        }
        var sqlDeleteSchedule = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlDeleteSchedule);
            request.input('id', _mssql2.default.Int, req.body.id);
            request.query('DELETE FROM Schedules\n                     WHERE id = @id').then(res.status(201).send("Schedule has been deleted.")).catch(function (err) {
                console.log("delete schedule: " + err);
            });
        });
    }).get(function (req, res) {
        var sqlSchedules = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlSchedules);
            request.query('SELECT\n                        H.id\n                        ,H.type AS type\n                        ,H.venue AS venue\n                        ,H.header AS header\n                        ,H.description AS description\n                        ,NULL AS session_date\n                        ,NULL AS DateSort\n                        ,NULL AS session_time\n                        ,NULL AS class\n                        ,NULL AS parent_id\n                        FROM Headers H\n                        WHERE H.type IN (SELECT SC.type FROM Schedules SC)\n\n                        UNION ALL\n\n                        SELECT \n                        S.id\n                        ,S.type AS type\n                        ,NULL as venue\n                        ,NULL as header\n                        ,NULL as description\n                        ,DATENAME(DW, S.session_date) + \' \' + CONVERT(VARCHAR, S.session_date, 107) AS session_date\n                        ,S.session_date as DateSort\n                        ,NULL AS session_time\n                        ,NULL AS class\n                        ,NULL AS parent_id\n                        FROM Schedules S\n                        WHERE session_date >= DATEADD(day, DATEDIFF(day, 0, GETDATE()), 0)\n                                                \n                        UNION ALL\n\n                        SELECT \n                        D.id\n                        ,D.type AS type\n                        ,NULL as venue\n                        ,NULL as header\n                        ,NULL as description\n                        ,NULL AS session_date\n                        ,NULL AS DateSort\n                        ,D.session_time AS session_time\n                        ,D.class AS class\n                        ,D.parent_id AS parent_id\n                        FROM ScheduleDetails D\n                        ORDER BY header desc, DateSort').then(function (recordset) {
                var schedulePage = {
                    id: recordset[0].id,
                    type: recordset[0].type,
                    header: recordset[0].header,
                    venue: recordset[0].venue,
                    description: recordset[0].description,
                    session_dates: []
                };
                var counter = 0;
                for (var date_prop in recordset) {
                    if (recordset.hasOwnProperty(date_prop)) {
                        if (recordset[date_prop].session_date != null) {
                            var session_dates = {
                                id: recordset[date_prop].id,
                                type: recordset[date_prop].type,
                                session_date: recordset[date_prop].session_date,
                                session_details: []
                            };
                            schedulePage.session_dates.push(session_dates);

                            for (var time_prop in recordset) {
                                if (recordset.hasOwnProperty(time_prop)) {
                                    if (recordset[time_prop].session_time != null) {
                                        if (recordset[date_prop].id == recordset[time_prop].parent_id) {
                                            var session_details = {
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

    scheduleRouter.route('/schedules/:scheduleId').get(function (req, res) {
        var sqlSchedule = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlSchedule);
            request.input('id', _mssql2.default.Int, req.params.scheduleId);
            request.query('SELECT\n                        S.id\n                        ,S.type AS type\n                        ,DATENAME(DW, S.session_date) + \' \' + CONVERT(VARCHAR, S.session_date, 107) AS session_date\n                        ,NULL AS session_time\n                        ,NULL AS class\n                        ,NULL AS parent_id\n                        FROM Schedules S\n                        WHERE id = @id\n\n                        UNION ALL\n\n                        SELECT \n                        D.id\n                        ,D.type AS type\n                        ,NULL AS session_date\n                        ,D.session_time AS session_time\n                        ,D.class AS class\n                        ,D.parent_id AS parent_id\n                        FROM ScheduleDetails D\n                        WHERE parent_id = @id').then(function (recordset) {
                if (recordset.length > 0) {
                    var session_dates = {
                        id: recordset[0].id,
                        session_date: recordset[0].session_date,
                        session_details: []
                    };
                    for (var time_prop in recordset) {
                        if (recordset.hasOwnProperty(time_prop)) {
                            if (recordset[time_prop].session_time != null) {
                                var session_details = {
                                    id: recordset[time_prop].id,
                                    session_time: recordset[time_prop].session_time,
                                    class: recordset[time_prop].class
                                };
                                session_dates.session_details.push(session_details);
                            }
                        }
                    }

                    res.json(session_dates);
                } else {
                    res.status(500).send("No Schedule found with this ID.");
                }
            }).catch(function (err) {
                console.log("schedule: " + err);
            });
        });
    }).delete(function (req, res) {
        if (!req.headers.authorization) {
            return res.status(401).send({ message: "You are not authorized" });
        }
        var authorization = JSON.parse(req.headers.authorization.slice(7));
        var payload = _jwtSimple2.default.decode(authorization.token, _secrets2.default);
        if (!payload.sub) {
            return res.status(401).send({ message: "You are not authorized" });
        }
        if ((0, _moment2.default)().unix() > payload.exp) {
            return res.status(401).send({ message: "You are not authorized" });
        }
        var sqlDeleteSchedule = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlDeleteSchedule);
            request.input('id', _mssql2.default.Int, req.params.scheduleId);
            request.query('DELETE FROM Schedules\n                     WHERE id = @id').then(res.status(201).send("Schedule has been deleted.")).catch(function (err) {
                console.log("delete schedule: " + err);
            });
        });
    });

    return scheduleRouter;
};

module.exports = scheduleRoutes;

exports.default = scheduleRoutes;