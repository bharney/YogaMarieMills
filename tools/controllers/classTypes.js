import express from 'express';
import {secret} from '../../secrets';
import jwt from 'jwt-simple';
import moment from 'moment';
import { executeQuery } from '../sqlQuery';

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
            executeQuery(
                `INSERT INTO ClassTypes (type, title, short, description, image, href, component, detail, route)
                 VALUES (@type, @title, @short, @description, @image, @href, @component, @detail, @route)`,
                function (request, sql) {
                    request.input('title', sql.VarChar, classType.title);
                    request.input('short', sql.VarChar, classType.short);
                    request.input('description', sql.VarChar, classType.description);
                    request.input('image', sql.VarChar, classType.image);
                    request.input('href', sql.VarChar, classType.href);
                    request.input('type', sql.VarChar, classType.type);
                    request.input('component', sql.VarChar, classType.component);
                    request.input('detail', sql.VarChar, classType.detail);
                    request.input('route', sql.VarChar, classType.route);
                }
            ).then(function () {
                res.status(201).send(classType);
            }).catch(function (err) {
                console.log("insert ClassTypes: " + err);
                res.status(500).send("Unable to save class type.");
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
            executeQuery(
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
                WHERE id = @id`,
                function (request, sql) {
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
                }
            ).then(function () {
                res.status(201).send(classType);
            }).catch(function (err) {
                console.log("update ClassTypes: " + err);
                res.status(500).send("Unable to update class type.");
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
                `DELETE FROM ClassTypes
                 WHERE id = @id`,
                function (request, sql) {
                    request.input('id', sql.Int, req.body.id);
                }
            ).then(function () {
                res.status(201).send("ClassType has been deleted.");
            }).catch(function (err) {
                console.log("delete classType: " + err);
                res.status(500).send("Unable to delete class type.");
            });
        })
        .get(function (req, res) {
            executeQuery(`SELECT id
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
                    res.status(500).send("Unable to load class types.");
                });
        });

    classTypeRouter.route('/classTypes/:classTypeId')
        .get(function (req, res) {
            executeQuery(`SELECT id
                                ,title
                                ,short
                                ,description
                                ,image
                                ,href
                                ,type
                                ,component
                                FROM classTypes
                                WHERE id = @id`,
                function (request, sql) {
                    request.input('id', sql.Int, req.params.classTypeId);
                }
            ).then(function (recordset) {
                    if (recordset.length > 0) {
                        res.json(recordset);
                    }
                    else {
                        res.status(500).send("No ClassType found with this ID.");
                    }
                }).catch(function (err) {
                    console.log("ClassType: " + err);
                    res.status(500).send("Unable to load class type.");
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
                `DELETE FROM ClassTypes
                 WHERE id = @id`,
                function (request, sql) {
                    request.input('id', sql.Int, req.params.classTypeId);
                }
            ).then(function () {
                res.status(201).send("ClassType has been deleted.");
            }).catch(function (err) {
                console.log("delete ClassTypes: " + err);
                res.status(500).send("Unable to delete class type.");
            });
        });

    return classTypeRouter;
};

module.exports = classTypeRoutes;

export default classTypeRoutes;
