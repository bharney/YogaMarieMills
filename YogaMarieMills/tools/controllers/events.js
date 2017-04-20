import express from 'express';
import sql from 'mssql';
import secret from '../../secrets';
import jwt from 'jwt-simple';
import moment from 'moment';

let eventRoutes = function () {

    const eventRouter = express.Router();
    const dbconfig = "mssql://Application:!Testing123@BPHSERVER/YogaMarieMills";

    function tryParseCurrency(str) {
        if (typeof (str) !== "undefined" && str) {
            let parsed = str.match(/[\s-\d\,\.]+/g);
            if (isNaN(parseFloat(parsed)))
                return str

            if (parsed)
                return parseFloat(+parsed[0].replace(/\./g, '').replace(/,/g, '.').replace(/\s/g, '')).toFixed(2);
        }
        return ''
    }

    eventRouter.route('/events')
        .post(function (req, res) {
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
            let eventType = (req.body);
            function replaceAll(str, find, replace) {
                return str.replace(new RegExp(find, 'g'), replace);
            }
            const generateType = (eventType) => {
                return replaceAll(eventType.header, ' ', '-');
            };
            eventType.type = generateType(eventType);

            const sqlInsertEventType = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlInsertEventType);
                request.input('type', sql.VarChar, eventType.type);
                request.input('header', sql.VarChar, eventType.header);
                request.input('venue', sql.VarChar, eventType.venue);
                request.input('short', sql.VarChar, eventType.short);
                request.input('session_time', sql.VarChar, eventType.session_time);
                request.input('title', sql.VarChar, eventType.title);
                request.input('description', sql.VarChar, eventType.description);
                request.input('cost', sql.VarChar, tryParseCurrency(eventType.cost));
                request.input('image', sql.VarChar, eventType.image);
                request.input('start_date', sql.Date, eventType.start_date);
                request.input('end_date', sql.Date, eventType.end_date);
                request.input('navbar_type', sql.VarChar, 'Events');
                request.input('name', sql.VarChar, eventType.header);
                request.input('route', sql.VarChar, 'Events/' + eventType.type);
                request.input('href', sql.VarChar, 'http://www.yogamariemills/Events');
                request.input('parent_id', sql.Int, 20);
                request.query(
                    `INSERT INTO Navbar_Items (type, name, route, href, parent_id)
                    VALUES (@navbar_type, @name, @route, @href, @parent_id);

                    INSERT INTO Headers (type, header, venue)
                    VALUES (@type, @header, @venue);

                    INSERT INTO EventTypes (type, title, session_time, short, description, cost, image, start_date, end_date)
                    VALUES (@type, @title, @session_time, @short, @description, @cost, @image, @start_date, @end_date);`
                ).then(res.status(201).send(eventType)).catch(function (err) {
                    console.log("insert EventTypes: " + err);
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
            let eventType = (req.body);
            const sqlUpdateEventType = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlUpdateEventType);
                request.input('id', sql.Int, eventType.id);
                request.input('type', sql.VarChar, eventType.type);
                request.input('header', sql.VarChar, eventType.header);
                request.input('venue', sql.VarChar, eventType.venue);
                request.input('short', sql.VarChar, eventType.short);
                request.input('session_time', sql.VarChar, eventType.session_time);
                request.input('title', sql.VarChar, eventType.title);
                request.input('description', sql.VarChar, eventType.description);
                request.input('cost', sql.VarChar, tryParseCurrency(eventType.cost));
                request.input('image', sql.VarChar, eventType.image);
                request.input('start_date', sql.Date, eventType.start_date);
                request.input('end_date', sql.Date, eventType.end_date);
                request.input('navbar_type', sql.VarChar, 'Events');
                request.input('name', sql.VarChar, eventType.header);
                request.input('route', sql.VarChar, 'Events' + eventType.type);
                request.input('href', sql.VarChar, 'http://www.yogamariemills/Events');
                request.input('parent_id', sql.Int, 20);
                request.query(
                    `UPDATE Navbar_Items 
                     SET type = @navbar_type
                     , name = @name
                     , route = @route
                     , href = @href
                     WHERE id = @id;

                     UPDATE Headers 
                     SET header = @header
                     , venue = @venue
                     , type = @type
                     FROM Headers H
                     JOIN EventTypes E
                     ON H.type = E.type
                     WHERE E.id = @id;
                     
                     UPDATE EventTypes 
                     SET type = @type
                     , title = @title
                     , session_time = @session_time
                     , short = @short
                     , description = @description
                     , cost = @cost
                     , image = @image
                     , start_date = @start_date
                     , end_date = @end_date
                     WHERE id = @id;`
                ).then(res.status(201).send(eventType)).catch(function (err) {
                    console.log("update EventTypes: " + err);
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
            let eventType = (req.body);
            const sqlDeleteEventType = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlDeleteEventType);
                request.input('id', sql.Int, eventType.id);
                request.input('type', sql.VarChar, eventType.type);
                request.input('navbar_type', sql.VarChar, 'Events/' + eventType.type);
                request.query(
                    `DELETE FROM EventTypes
                     WHERE id = @id;
                     
                     DELETE FROM Headers
                     WHERE type = @type;
                     
                     DELETE FROM Navbar_Items
                     WHERE route = @navbar_type;`
                ).then(res.status(201).send("EventType has been deleted.")).catch(function (err) {
                    console.log("delete EventType: " + err);
                });
            });
        })
        .get(function (req, res) {
            const sqlEventTypes = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlEventTypes);
                request.query(
                    `SELECT E.id AS id
                    ,E.type AS type
                    ,H.header AS header
                    ,H.venue AS venue
                    ,E.session_time AS session_time
                    ,E.title AS title
                    ,E.short AS short
                    ,E.description AS description
                    ,CASE WHEN ISNUMERIC(E.cost) = 1 
                                 THEN FORMAT(TRY_PARSE(E.cost AS money), 'C', 'de-de') 
                                 ELSE E.cost END AS cost
                    ,E.image AS image
                    ,E.start_date AS start_date
                    ,E.end_date AS end_date
                    FROM Headers H
                    JOIN EventTypes E
                    ON H.type = E.type`
                ).then(function (recordset) {
                    res.json(recordset);
                }).catch(function (err) {
                    console.log("events: " + err);
                });
            });
        });

    eventRouter.route('/events/:eventId')
        .get(function (req, res) {
            const sqlEventType = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlEventType);
                request.input('id', sql.Int, req.params.eventId);
                request.query(`SELECT id
                                ,type
                                ,session_time
                                ,title
                                ,event
                                ,event_desc
                                ,cost
                                FROM events
                                WHERE id = @id`
                ).then(function (recordset) {
                    if (recordset.length > 0) {
                        res.json(recordset);
                    }
                    else {
                        res.status(500).send("No EventType found with this ID.");
                    }
                }).catch(function (err) {
                    console.log("EventType: " + err);
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
            const sqlDeleteEventType = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlDeleteEventType);
                request.input('id', sql.Int, req.params.eventId);
                request.query(
                    `DELETE FROM EventTypes
                     WHERE id = @id`
                ).then(res.status(201).send("EventType has been deleted.")).catch(function (err) {
                    console.log("delete EventType: " + err);
                });
            });
        });

    return eventRouter;
};

module.exports = eventRoutes;

export default eventRoutes;