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

var classTypeRoutes = function classTypeRoutes() {

    var classTypeRouter = _express2.default.Router();
    var dbconfig = "mssql://yogamariemills:!Testing123@yogamariemills.database.windows.net/YogaMarieMills?encrypt=true";

    classTypeRouter.route('/classTypes').post(function (req, res) {
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
        var classType = req.body;
        var sqlInsertClassType = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlInsertClassType);
            request.input('title', _mssql2.default.VarChar, classType.title);
            request.input('short', _mssql2.default.VarChar, classType.short);
            request.input('description', _mssql2.default.VarChar, classType.description);
            request.input('image', _mssql2.default.VarChar, classType.image);
            request.input('href', _mssql2.default.VarChar, classType.href);
            request.input('type', _mssql2.default.VarChar, classType.type);
            request.input('component', _mssql2.default.VarChar, classType.component);
            request.input('detail', _mssql2.default.VarChar, classType.detail);
            request.input('route', _mssql2.default.VarChar, classType.route);
            request.query('INSERT INTO ClassTypes (type, title, short, description, image, href, type, component, detail, route)\n                     VALUES (@type, @title, @short, @description, @image, @href, @type, @component, @detail, @route)').then(res.status(201).send(classType)).catch(function (err) {
                console.log("insert ClassTypes: " + err);
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
        var classType = req.body;
        var sqlUpdateClassType = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlUpdateClassType);
            request.input('id', _mssql2.default.Int, classType.id);
            request.input('title', _mssql2.default.VarChar, classType.title);
            request.input('short', _mssql2.default.VarChar, classType.short);
            request.input('description', _mssql2.default.VarChar, classType.description);
            request.input('image', _mssql2.default.VarChar, classType.image);
            request.input('href', _mssql2.default.VarChar, classType.href);
            request.input('type', _mssql2.default.VarChar, classType.type);
            request.input('component', _mssql2.default.VarChar, classType.component);
            request.input('detail', _mssql2.default.VarChar, classType.detail);
            request.input('route', _mssql2.default.VarChar, classType.route);
            request.query('UPDATE ClassTypes\n                    SET title = @title\n                    ,short = @short\n                    ,description = @description\n                    ,image = @image\n                    ,href = @href\n                    ,type = @type\n                    ,component = @component\n                    ,detail = @detail\n                    ,route = @route\n                    WHERE id = @id').then(res.status(201).send(classType)).catch(function (err) {
                console.log("update ClassTypes: " + err);
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
        var sqlDeleteClassType = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlDeleteClassType);
            request.input('id', _mssql2.default.Int, req.body.id);
            request.query('DELETE FROM ClassTypes\n                     WHERE id = @id').then(res.status(201).send("ClassType has been deleted.")).catch(function (err) {
                console.log("delete classType: " + err);
            });
        });
    }).get(function (req, res) {
        var sqlClassTypes = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlClassTypes);
            request.query('SELECT id \n                                ,type\n                                ,title\n                                ,image\n                                ,short\n                                ,description\n                                ,href\n                                ,component\n                                ,detail\n                                ,route\n                                FROM ClassTypes').then(function (recordset) {
                res.json(recordset);
            }).catch(function (err) {
                console.log("get classTypes: " + err);
            });
        });
    });

    classTypeRouter.route('/classTypes/:classTypeId').get(function (req, res) {
        var sqlClassType = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlClassType);
            request.input('id', _mssql2.default.Int, req.params.classTypeId);
            request.query('SELECT id\n                                ,title\n                                ,short\n                                ,description\n                                ,image\n                                ,href\n                                ,type\n                                ,component\n                                FROM classTypes\n                                WHERE id = @id').then(function (recordset) {
                if (recordset.length > 0) {
                    res.json(recordset);
                } else {
                    res.status(500).send("No ClassType found with this ID.");
                }
            }).catch(function (err) {
                console.log("ClassType: " + err);
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
        var sqlDeleteClassType = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlDeleteClassType);
            request.input('id', _mssql2.default.Int, req.params.classTypeId);
            request.query('DELETE FROM ClassTypes\n                     WHERE id = @id').then(res.status(201).send("ClassType has been deleted.")).catch(function (err) {
                console.log("delete ClassTypes: " + err);
            });
        });
    });

    return classTypeRouter;
};

module.exports = classTypeRoutes;

exports.default = classTypeRoutes;