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

var navbarRoutes = function navbarRoutes() {

    var navbarRouter = _express2.default.Router();
    var dbconfig = "mssql://yogamariemills:!Testing123@yogamariemills.database.windows.net/YogaMarieMills?encrypt=true";

    navbarRouter.route('/navbars').post(function (req, res) {
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
        var navbar_item = req.body;
        var sqlInsertNavbar = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlInsertNavbar);
            request.input('type', _mssql2.default.VarChar, navbar_item.type);
            request.input('name', _mssql2.default.VarChar, navbar_item.name);
            request.input('route', _mssql2.default.VarChar, navbar_item.route);
            request.input('href', _mssql2.default.VarChar, navbar_item.href);
            request.input('parent_id', _mssql2.default.Int, navbar_item.parent_id);
            request.query('INSERT INTO Navbar_Items (type, name, route, href, parent_id)\n                    VALUES (@type, @name, @route, @href, @parent_id);').then(res.status(201).send(navbar_item)).catch(function (err) {
                console.log("insert Navbar: " + err);
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
        var navbar_item = req.body;
        var sqlUpdateNavbar = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlUpdateNavbar);
            request.input('id', _mssql2.default.Int, navbar_item.id);
            request.input('type', _mssql2.default.VarChar, navbar_item.type);
            request.input('name', _mssql2.default.VarChar, navbar_item.name);
            request.input('route', _mssql2.default.VarChar, navbar_item.route);
            request.input('href', _mssql2.default.VarChar, navbar_item.href);
            request.input('parent_id', _mssql2.default.Int, navbar_item.parent_id);
            request.query('UPDATE Navbar_Items \n                     SET type = @type\n                     , name = @name\n                     , route = @route\n                     , href = @href\n                     WHERE id = @id;').then(res.status(201).send(navbar_item)).catch(function (err) {
                console.log("update Navbars: " + err);
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
        var sqlDeleteNavbar = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlDeleteNavbar);
            request.input('id', _mssql2.default.Int, req.body.id);
            request.query('DELETE FROM Navbar_Items\n                     WHERE id = @id').then(res.status(201).send("Navbar has been deleted.")).catch(function (err) {
                console.log("delete Navbar: " + err);
            });
        });
    }).get(function (req, res) {
        var sqlNavbars = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlNavbars);
            request.query('SELECT id\n                    ,type\n                    ,name\n                    ,href\n                    ,route\n                    ,parent_id\n                    FROM Navbar_Items').then(function (recordset) {
                var navbar_items = [];

                for (var navbar_prop in recordset) {
                    if (recordset.hasOwnProperty(navbar_prop)) {
                        if (recordset[navbar_prop].parent_id == null) {
                            var submenu_items = [];
                            navbar_items.push({
                                id: recordset[navbar_prop].id,
                                name: recordset[navbar_prop].name,
                                href: recordset[navbar_prop].href,
                                route: recordset[navbar_prop].route,
                                subMenu: submenu_items
                            });
                            for (var submenu_prop in recordset) {
                                if (recordset.hasOwnProperty(submenu_prop)) {
                                    if (recordset[submenu_prop].parent_id != null) {
                                        if (recordset[navbar_prop].id == recordset[submenu_prop].parent_id) {
                                            submenu_items.push({
                                                id: recordset[submenu_prop].id,
                                                name: recordset[submenu_prop].name,
                                                href: recordset[submenu_prop].href,
                                                route: recordset[submenu_prop].route
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                res.json(navbar_items);
            }).catch(function (err) {
                console.log("navbars: " + err);
            });
        });
    });

    navbarRouter.route('/navbars/:navbarId').get(function (req, res) {
        var sqlNavbar = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlNavbar);
            request.input('id', _mssql2.default.Int, req.params.navbarId);
            request.query('SELECT id\n                                ,type\n                                ,venue\n                                ,header\n                                ,description\n                                ,session_time\n                                ,title\n                                ,details\n                                ,cost\n                                FROM Navbar_Items\n                                WHERE id = @id').then(function (recordset) {
                if (recordset.length > 0) {
                    res.json(recordset);
                } else {
                    res.status(500).send("No Navbar found with this ID.");
                }
            }).catch(function (err) {
                console.log("Navbar: " + err);
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
        var sqlDeleteNavbar = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlDeleteNavbar);
            request.input('id', _mssql2.default.Int, req.params.navbarId);
            request.query('DELETE FROM Navbar_Items\n                     WHERE id = @id').then(res.status(201).send("Navbar has been deleted.")).catch(function (err) {
                console.log("delete Navbar: " + err);
            });
        });
    });

    return navbarRouter;
};

module.exports = navbarRoutes;

exports.default = navbarRoutes;