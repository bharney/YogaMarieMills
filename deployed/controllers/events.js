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

var eventRoutes = function eventRoutes() {

    var eventRouter = _express2.default.Router();
    var dbconfig = "mssql://yogamariemills:!Testing123@yogamariemills.database.windows.net/YogaMarieMills?encrypt=true";

    function tryParseCurrency(str) {
        if (typeof str !== "undefined" && str) {
            var parsed = str.match(/[\s-\d\,\.]+/g);
            if (isNaN(parseFloat(parsed))) return str;

            if (parsed) return parseFloat(+parsed[0].replace(/\./g, '').replace(/,/g, '.').replace(/\s/g, '')).toFixed(2);
        }
        return '';
    }

    eventRouter.route('/events').post(function (req, res) {
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
        var eventType = req.body;
        function replaceAll(str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        }
        var generateType = function generateType(eventType) {
            return replaceAll(eventType.header, ' ', '-');
        };
        eventType.type = generateType(eventType);

        var sqlInsertEventType = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlInsertEventType);
            request.input('type', _mssql2.default.VarChar, eventType.type);
            request.input('header', _mssql2.default.VarChar, eventType.header);
            request.input('venue', _mssql2.default.VarChar, eventType.venue);
            request.input('short', _mssql2.default.VarChar, eventType.short);
            request.input('session_time', _mssql2.default.VarChar, eventType.session_time);
            request.input('title', _mssql2.default.VarChar, eventType.title);
            request.input('description', _mssql2.default.VarChar, eventType.description);
            request.input('cost', _mssql2.default.VarChar, tryParseCurrency(eventType.cost));
            request.input('image', _mssql2.default.VarChar, eventType.image);
            request.input('start_date', _mssql2.default.Date, eventType.start_date);
            request.input('end_date', _mssql2.default.Date, eventType.end_date);
            request.input('navbar_type', _mssql2.default.VarChar, 'Events');
            request.input('name', _mssql2.default.VarChar, eventType.header);
            request.input('route', _mssql2.default.VarChar, 'Events/' + eventType.type);
            request.input('href', _mssql2.default.VarChar, 'http://www.yogamariemills/Events');
            request.input('parent_id', _mssql2.default.Int, 20);
            request.query('INSERT INTO Navbar_Items (type, name, route, href, parent_id)\n                    VALUES (@navbar_type, @name, @route, @href, @parent_id);\n\n                    INSERT INTO Headers (type, header, venue)\n                    VALUES (@type, @header, @venue);\n\n                    INSERT INTO EventTypes (type, title, session_time, short, description, cost, image, start_date, end_date)\n                    VALUES (@type, @title, @session_time, @short, @description, @cost, @image, @start_date, @end_date);').then(res.status(201).send(eventType)).catch(function (err) {
                console.log("insert EventTypes: " + err);
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
        var eventType = req.body;
        var sqlUpdateEventType = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlUpdateEventType);
            request.input('id', _mssql2.default.Int, eventType.id);
            request.input('type', _mssql2.default.VarChar, eventType.type);
            request.input('header', _mssql2.default.VarChar, eventType.header);
            request.input('venue', _mssql2.default.VarChar, eventType.venue);
            request.input('short', _mssql2.default.VarChar, eventType.short);
            request.input('session_time', _mssql2.default.VarChar, eventType.session_time);
            request.input('title', _mssql2.default.VarChar, eventType.title);
            request.input('description', _mssql2.default.VarChar, eventType.description);
            request.input('cost', _mssql2.default.VarChar, tryParseCurrency(eventType.cost));
            request.input('image', _mssql2.default.VarChar, eventType.image);
            request.input('start_date', _mssql2.default.Date, eventType.start_date);
            request.input('end_date', _mssql2.default.Date, eventType.end_date);
            request.input('navbar_type', _mssql2.default.VarChar, 'Events');
            request.input('name', _mssql2.default.VarChar, eventType.header);
            request.input('route', _mssql2.default.VarChar, 'Events' + eventType.type);
            request.input('href', _mssql2.default.VarChar, 'http://www.yogamariemills/Events');
            request.input('parent_id', _mssql2.default.Int, 20);
            request.query('UPDATE Navbar_Items \n                     SET type = @navbar_type\n                     , name = @name\n                     , route = @route\n                     , href = @href\n                     WHERE id = @id;\n\n                     UPDATE Headers \n                     SET header = @header\n                     , venue = @venue\n                     , type = @type\n                     FROM Headers H\n                     JOIN EventTypes E\n                     ON H.type = E.type\n                     WHERE E.id = @id;\n                     \n                     UPDATE EventTypes \n                     SET type = @type\n                     , title = @title\n                     , session_time = @session_time\n                     , short = @short\n                     , description = @description\n                     , cost = @cost\n                     , image = @image\n                     , start_date = @start_date\n                     , end_date = @end_date\n                     WHERE id = @id;').then(res.status(201).send(eventType)).catch(function (err) {
                console.log("update EventTypes: " + err);
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
        var eventType = req.body;
        var sqlDeleteEventType = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlDeleteEventType);
            request.input('id', _mssql2.default.Int, eventType.id);
            request.input('type', _mssql2.default.VarChar, eventType.type);
            request.input('navbar_type', _mssql2.default.VarChar, 'Events/' + eventType.type);
            request.query('DELETE FROM EventTypes\n                     WHERE id = @id;\n                     \n                     DELETE FROM Headers\n                     WHERE type = @type;\n                     \n                     DELETE FROM Navbar_Items\n                     WHERE route = @navbar_type;').then(res.status(201).send("EventType has been deleted.")).catch(function (err) {
                console.log("delete EventType: " + err);
            });
        });
    }).get(function (req, res) {
        var sqlEventTypes = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlEventTypes);
            request.query('SELECT E.id AS id\n                    ,E.type AS type\n                    ,H.header AS header\n                    ,H.venue AS venue\n                    ,E.session_time AS session_time\n                    ,E.title AS title\n                    ,E.short AS short\n                    ,E.description AS description\n                    ,CASE WHEN ISNUMERIC(E.cost) = 1 \n                                 THEN FORMAT(TRY_PARSE(E.cost AS money), \'C\', \'de-de\') \n                                 ELSE E.cost END AS cost\n                    ,E.image AS image\n                    ,E.start_date AS start_date\n                    ,E.end_date AS end_date\n                    FROM Headers H\n                    JOIN EventTypes E\n                    ON H.type = E.type').then(function (recordset) {
                res.json(recordset);
            }).catch(function (err) {
                console.log("events: " + err);
            });
        });
    });

    eventRouter.route('/events/:eventId').get(function (req, res) {
        var sqlEventType = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlEventType);
            request.input('id', _mssql2.default.Int, req.params.eventId);
            request.query('SELECT id\n                                ,type\n                                ,session_time\n                                ,title\n                                ,event\n                                ,event_desc\n                                ,cost\n                                FROM events\n                                WHERE id = @id').then(function (recordset) {
                if (recordset.length > 0) {
                    res.json(recordset);
                } else {
                    res.status(500).send("No EventType found with this ID.");
                }
            }).catch(function (err) {
                console.log("EventType: " + err);
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
        var sqlDeleteEventType = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlDeleteEventType);
            request.input('id', _mssql2.default.Int, req.params.eventId);
            request.query('DELETE FROM EventTypes\n                     WHERE id = @id').then(res.status(201).send("EventType has been deleted.")).catch(function (err) {
                console.log("delete EventType: " + err);
            });
        });
    });

    return eventRouter;
};

module.exports = eventRoutes;

exports.default = eventRoutes;