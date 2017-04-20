import express from 'express';
import sql from 'mssql';
import {secret, dbconfig} from '../../secrets';
import jwt from 'jwt-simple';
import moment from 'moment';

let classTypeRoutes = function () {

    const classTypeRouter = express.Router();

    classTypeRouter.route('/classTypes')
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
            let classType = (req.body);
            const sqlInsertClassType = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlInsertClassType);
                request.input('title', sql.VarChar, classType.title);
                request.input('short', sql.VarChar, classType.short);
                request.input('description', sql.VarChar, classType.description);
                request.input('image', sql.VarChar, classType.image);
                request.input('href', sql.VarChar, classType.href);
                request.input('type', sql.VarChar, classType.type);
                request.input('component', sql.VarChar, classType.component);
                request.input('detail', sql.VarChar, classType.detail);
                request.input('route', sql.VarChar, classType.route);
                request.query(
                    `INSERT INTO ClassTypes (type, title, short, description, image, href, type, component, detail, route)
                     VALUES (@type, @title, @short, @description, @image, @href, @type, @component, @detail, @route)`
                ).then(res.status(201).send(classType)).catch(function (err) {
                    console.log("insert ClassTypes: " + err);
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
            let classType = (req.body);
            const sqlUpdateClassType = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlUpdateClassType);
                request.input('id', sql.Int, classType.id);
                request.input('title', sql.VarChar, classType.title);
                request.input('short', sql.VarChar, classType.short);
                request.input('description', sql.VarChar, classType.description);
                request.input('image', sql.VarChar, classType.image);
                request.input('href', sql.VarChar, classType.href);
                request.input('type', sql.VarChar, classType.type);
                request.input('component', sql.VarChar, classType.component);
                request.input('detail', sql.VarChar, classType.detail);
                request.input('route', sql.VarChar, classType.route);
                request.query(
                    `UPDATE ClassTypes
                    SET title = @title
                    ,short = @short
                    ,description = @description
                    ,image = @image
                    ,href = @href
                    ,type = @type
                    ,component = @component
                    ,detail = @detail
                    ,route = @route
                    WHERE id = @id`
                ).then(res.status(201).send(classType)).catch(function (err) {
                    console.log("update ClassTypes: " + err);
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
            const sqlDeleteClassType = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlDeleteClassType);
                request.input('id', sql.Int, req.body.id);
                request.query(
                    `DELETE FROM ClassTypes
                     WHERE id = @id`
                ).then(res.status(201).send("ClassType has been deleted.")).catch(function (err) {
                    console.log("delete classType: " + err);
                });
            });
        })
        .get(function (req, res) {
            const sqlClassTypes = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlClassTypes);
                request.query(`SELECT id 
                                ,type
                                ,title
                                ,image
                                ,short
                                ,description
                                ,href
                                ,component
                                ,detail
                                ,route
                                FROM ClassTypes`).then(function (recordset) {
                        res.json(recordset);
                    }).catch(function (err) {
                        console.log("get classTypes: " + err);
                    });
            });
        });

    classTypeRouter.route('/classTypes/:classTypeId')
        .get(function (req, res) {
            const sqlClassType = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlClassType);
                request.input('id', sql.Int, req.params.classTypeId);
                request.query(`SELECT id
                                ,title
                                ,short
                                ,description
                                ,image
                                ,href
                                ,type
                                ,component
                                FROM classTypes
                                WHERE id = @id`
                ).then(function (recordset) {
                    if (recordset.length > 0) {
                        res.json(recordset);
                    }
                    else {
                        res.status(500).send("No ClassType found with this ID.");
                    }
                }).catch(function (err) {
                    console.log("ClassType: " + err);
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
            const sqlDeleteClassType = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlDeleteClassType);
                request.input('id', sql.Int, req.params.classTypeId);
                request.query(
                    `DELETE FROM ClassTypes
                     WHERE id = @id`
                ).then(res.status(201).send("ClassType has been deleted.")).catch(function (err) {
                    console.log("delete ClassTypes: " + err);
                });
            });
        });

    return classTypeRouter;
};

module.exports = classTypeRoutes;

export default classTypeRoutes;