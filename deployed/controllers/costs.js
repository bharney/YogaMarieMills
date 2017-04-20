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

var costRoutes = function costRoutes() {

    var costRouter = _express2.default.Router();
    var dbconfig = "mssql://yogamariemills:!Testing123@yogamariemills.database.windows.net/YogaMarieMills?encrypt=true";

    function tryParseCurrency(str) {
        if (typeof str !== "undefined" && str) {
            var parsed = str.match(/[\s-\d\,\.]+/g);
            if (isNaN(parseFloat(parsed))) return str;

            if (parsed) return parseFloat(+parsed[0].replace(/\./g, '').replace(/,/g, '.').replace(/\s/g, '')).toFixed(2);
        }
        return '';
    }

    costRouter.route('/costs').post(function (req, res) {
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
        var cost = req.body;
        var sqlInsertCost = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlInsertCost);
            request.input('type', _mssql2.default.VarChar, cost.type);
            request.input('course', _mssql2.default.VarChar, cost.course);
            request.input('cost', _mssql2.default.VarChar, tryParseCurrency(cost.cost));
            request.input('duration', _mssql2.default.VarChar, cost.duration);
            request.input('description', _mssql2.default.VarChar, cost.description);
            request.input('package', _mssql2.default.VarChar, cost.package);
            request.input('sequence', _mssql2.default.Int, cost.sequence);
            request.query('INSERT INTO Costs (type, course, cost, duration, description, package, sequence)\n                     VALUES (@type, @course, @cost, @duration, @description, @package, @sequence)').then(res.status(201).send(cost)).catch(function (err) {
                console.log("insert Costs: " + err);
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
        var cost = req.body;
        var sqlUpdateCost = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlUpdateCost);
            request.input('id', _mssql2.default.Int, cost.id);
            request.input('type', _mssql2.default.VarChar, cost.type);
            request.input('course', _mssql2.default.VarChar, cost.course);
            request.input('cost', _mssql2.default.VarChar, tryParseCurrency(cost.cost));
            request.input('duration', _mssql2.default.VarChar, cost.duration);
            request.input('description', _mssql2.default.VarChar, cost.description);
            request.input('package', _mssql2.default.VarChar, cost.package);
            request.input('sequence', _mssql2.default.Int, cost.sequence);
            request.query('UPDATE Costs\n                    SET type = @type\n                    ,course = @course\n                    ,cost = @cost\n                    ,duration = @duration\n                    ,description = @description\n                    ,package = @package\n                    ,sequence = @sequence\n                    WHERE id = @id').then(res.status(201).send(cost)).catch(function (err) {
                console.log("update Costs: " + err);
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
        var sqlDeleteCost = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlDeleteCost);
            request.input('id', _mssql2.default.Int, req.body.id);
            request.query('DELETE FROM Costs\n                     WHERE id = @id').then(res.status(201).send("Cost has been deleted.")).catch(function (err) {
                console.log("delete cost: " + err);
            });
        });
    }).get(function (req, res) {
        var sqlCosts = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlCosts);
            request.query('SELECT id\n                                ,type\n                                ,course\n                                ,CASE WHEN ISNUMERIC(cost) = 1 \n                                 THEN FORMAT(TRY_PARSE(cost AS money), \'C\', \'de-de\') \n                                 ELSE cost END AS cost\n                                ,duration\n                                ,description\n                                ,package \n                                ,sequence\n                                FROM Costs\n                                ORDER BY sequence').then(function (recordset) {
                res.json(recordset);
            }).catch(function (err) {
                console.log("costs: " + err);
            });
        });
    });

    costRouter.route('/costs/:costId').get(function (req, res) {
        var sqlCost = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlCost);
            request.input('id', _mssql2.default.Int, req.params.costId);
            request.query('SELECT id\n                                ,type\n                                ,course\n                                ,CASE WHEN ISNUMERIC(cost) = 1 \n                                 THEN FORMAT(TRY_PARSE(cost AS money), \'C\', \'de-de\') \n                                 ELSE cost END AS cost \n                                ,duration\n                                ,description\n                                ,package \n                                ,sequence\n                                FROM Costs\n                                WHERE id = @id').then(function (recordset) {
                if (recordset.length > 0) {
                    res.json(recordset);
                } else {
                    res.status(500).send("No Cost found with this ID.");
                }
            }).catch(function (err) {
                console.log("Cost: " + err);
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
        var sqlDeleteCost = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlDeleteCost);
            request.input('id', _mssql2.default.Int, req.params.costId);
            request.query('DELETE FROM Costs\n                     WHERE id = @id').then(res.status(201).send("Cost has been deleted.")).catch(function (err) {
                console.log("delete Costs: " + err);
            });
        });
    });

    return costRouter;
};

module.exports = costRoutes;

exports.default = costRoutes;