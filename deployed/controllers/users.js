'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mssql = require('mssql');

var _mssql2 = _interopRequireDefault(_mssql);

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

var _secrets = require('../secrets');

var _secrets2 = _interopRequireDefault(_secrets);

var _jwtSimple = require('jwt-simple');

var _jwtSimple2 = _interopRequireDefault(_jwtSimple);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userRoutes = function userRoutes() {

    var userRouter = _express2.default.Router();
    var dbconfig = "mssql://yogamariemills:!Testing123@yogamariemills.database.windows.net/YogaMarieMills?encrypt=true";

    function encryptPassword(password) {
        console.log("password: " + password);
    }

    userRouter.route('/users').post(function (req, res) {
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
        var user = req.body;
        console.log("user: " + user.password);
        var password = void 0;

        _bcryptNodejs2.default.hash(user.password, null, null, function (err, hash) {
            if (err) return;
            console.log("hash: " + hash);
            password = hash;
        });
        console.log("user.password: " + password);
        var sqlInsertLogin = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlInsertLogin);
            request.input('emailAddress', _mssql2.default.VarChar, user.emailAddress);
            request.input('firstName', _mssql2.default.VarChar, user.firstName);
            request.input('lastName', _mssql2.default.VarChar, user.LastName);

            request.input('password', _mssql2.default.VarChar, password);
            request.query('INSERT INTO Users (emailAddress, firstName, lastName, password, createdDate)\n                     VALUES (@emailAddress, @firstName, @lastName, @password, GETDATE());').then(function () {
                delete user.password;
                res.status(201).send(user);
            }).catch(function (err) {
                console.log("users: " + err);
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
        var user = req.body;
        var sqlUpdateLogin = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlUpdateLogin);
            request.input('id', _mssql2.default.Int, user.id);
            request.input('emailAddress', _mssql2.default.VarChar, user.emailAddress);
            request.input('firstName', _mssql2.default.VarChar, user.firstName);
            request.input('lastName', _mssql2.default.VarChar, user.LastName);
            request.input('password', _mssql2.default.VarChar, encryptPassword(user.password));
            request.query('UPDATE Users\n                    SET emailAddress = @emailAddress\n                    ,firstName = @firstName\n                    ,lastName = @lastName\n                    ,password = @password\n                    ,changedDate = GETDATE()\n                    WHERE id = @id').then(function () {
                delete user.password;
                res.status(201).send(user);
            }).catch(function (err) {
                console.log("update user: " + err);
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
        var sqlDeleteLogin = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlDeleteLogin);
            request.input('id', _mssql2.default.Int, req.body.id);
            request.query('DELETE FROM Users\n                     WHERE id = @id').then(res.status(201).send("Login has been deleted.")).catch(function (err) {
                console.log("delete user: " + err);
            });
        });
    }).get(function (req, res) {
        var sqlLogins = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlLogins);
            request.query('SELECT id\n                            ,emailAddress\n                            ,firstName\n                            ,lastName\n                            ,\'**********\' AS password\n                            ,createdDate\n                            ,changedDate\n                            FROM Users\n                            ORDER BY id').then(function (recordset) {
                res.json(recordset);
            }).catch(function (err) {
                console.log("Users: " + err);
            });
        });
    });

    return userRouter;
};

module.exports = userRoutes;

exports.default = userRoutes;