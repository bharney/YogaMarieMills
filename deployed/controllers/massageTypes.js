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

var massageTypeRoutes = function massageTypeRoutes() {

    var massageTypeRouter = _express2.default.Router();
    var dbconfig = "mssql://yogamariemills:!Testing123@yogamariemills.database.windows.net/YogaMarieMills?encrypt=true";

    function tryParseCurrency(str) {
        if (typeof str !== "undefined" && str) {
            var parsed = str.match(/[\s-\d\,\.]+/g);
            if (isNaN(parseFloat(parsed))) return str;

            if (parsed) return parseFloat(+parsed[0].replace(/\./g, '').replace(/,/g, '.').replace(/\s/g, '')).toFixed(2);
        }
        return '';
    }

    massageTypeRouter.route('/massages').post(function (req, res) {
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
        var massageType = req.body;
        var sqlInsertMassageType = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlInsertMassageType);
            request.input('type', _mssql2.default.VarChar, massageType.type);
            request.input('title', _mssql2.default.VarChar, massageType.title);
            request.input('session_time', _mssql2.default.VarChar, massageType.session_time);
            request.input('description', _mssql2.default.VarChar, massageType.description);
            request.input('cost', _mssql2.default.VarChar, tryParseCurrency(massageType.cost));
            request.query('INSERT INTO MassageTypes (type, title, session_time, description, cost)\n                     VALUES (@type, @title, @session_time, @description, @cost); \n                     SELECT SCOPE_IDENTITY() AS parent_id;').then(function (recordset) {
                var _loop = function _loop(prop) {
                    if (massageType.massage_details.hasOwnProperty(prop)) {
                        var sqlInsertMassageDetails = new _mssql2.default.Connection(dbconfig, function () {
                            var request = new _mssql2.default.Request(sqlInsertMassageDetails);
                            request.input('parent_id', _mssql2.default.Int, recordset[0].parent_id);
                            request.input('type', _mssql2.default.VarChar, 'MassageDetail');
                            request.input('title', _mssql2.default.VarChar, massageType.massage_details[prop].title);
                            request.input('description', _mssql2.default.VarChar, massageType.massage_details[prop].description);
                            request.query('INSERT INTO MassageDetails (type, title, description, parent_id)\n                                     VALUES (@type, @title, @description, @parent_id);').then(console.log(massageType.massage_details[prop])).catch(function (err) {
                                console.log("massageDetails: " + err);
                            });
                        });
                    }
                };

                for (var prop in massageType.massage_details) {
                    _loop(prop);
                }
            }).catch(function (err) {
                console.log("massageType: " + err);
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
        var massageType = req.body;
        var sqlUpdateMassageType = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlUpdateMassageType);
            request.input('id', _mssql2.default.Int, massageType.id);
            request.input('type', _mssql2.default.VarChar, massageType.type);
            request.input('title', _mssql2.default.VarChar, massageType.title);
            request.input('session_time', _mssql2.default.VarChar, massageType.session_time);
            request.input('description', _mssql2.default.VarChar, massageType.description);
            request.input('cost', _mssql2.default.VarChar, tryParseCurrency(massageType.cost));
            request.query('UPDATE MassageTypes \n                        SET type = @type\n                        ,title = @title\n                        , session_time = @session_time\n                        , description = @description\n                        , cost = @cost\n                        WHERE id = @id;').then(function () {
                var sqlDeleteMassageDetails = new _mssql2.default.Connection(dbconfig, function () {
                    var request = new _mssql2.default.Request(sqlDeleteMassageDetails);
                    request.input('parent_id', _mssql2.default.Int, massageType.id);
                    request.query('DELETE FROM MassageDetails\n                            WHERE id NOT IN (' + massageType.massage_details.filter(function (massage_details) {
                        return massage_details.id;
                    }).map(function (obj) {
                        return obj.id;
                    }).join(',') + ')\n                            AND parent_id = @parent_id;').then(function () {
                        var _loop2 = function _loop2(prop) {
                            if (massageType.massage_details.hasOwnProperty(prop)) {
                                if (massageType.massage_details[prop].id) {
                                    var sqlUpdateMassageDetails = new _mssql2.default.Connection(dbconfig, function () {
                                        var request = new _mssql2.default.Request(sqlUpdateMassageDetails);
                                        request.input('id', _mssql2.default.Int, massageType.massage_details[prop].id);
                                        request.input('parent_id', _mssql2.default.Int, massageType.id);
                                        request.input('type', _mssql2.default.VarChar, 'MassageDetail');
                                        request.input('title', _mssql2.default.VarChar, massageType.massage_details[prop].title);
                                        request.input('description', _mssql2.default.VarChar, massageType.massage_details[prop].description);
                                        request.query('UPDATE MassageDetails \n                                                        SET type = @type\n                                                        ,title = @title\n                                                        , description = @description\n                                                        , parent_id = @parent_id\n                                                        WHERE id = @id;').then(console.log("MassageDetails Updated")).catch(function (err) {
                                            console.log("update MassageDetails: " + err);
                                        });
                                    });
                                } else {
                                    var sqlInsertMassageDetails = new _mssql2.default.Connection(dbconfig, function () {
                                        var request = new _mssql2.default.Request(sqlInsertMassageDetails);
                                        request.input('parent_id', _mssql2.default.Int, massageType.id);
                                        request.input('type', _mssql2.default.VarChar, 'MassageDetail');
                                        request.input('title', _mssql2.default.VarChar, massageType.massage_details[prop].title);
                                        request.input('description', _mssql2.default.VarChar, massageType.massage_details[prop].description);
                                        request.query('INSERT INTO MassageDetails (type, title, description, parent_id)\n                                                VALUES (@type, @title, @description, @parent_id);').then(console.log("MassageDetails Inserted")).catch(function (err) {
                                            console.log("insert MassageDetails: " + err);
                                        });
                                    });
                                }
                            }
                        };

                        for (var prop in massageType.massage_details) {
                            _loop2(prop);
                        }
                    }).catch(function (err) {
                        console.log("MassageDetails delete" + err);
                    });
                });
            }).catch(function (err) {
                console.log("MassageType " + err);
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
        var sqlDeleteMassageType = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlDeleteMassageType);
            request.input('id', _mssql2.default.Int, req.body.id);
            request.query('DELETE FROM MassageTypes\n                     WHERE id = @id').then(res.status(201).send("MassageType has been deleted.")).catch(function (err) {
                console.log("delete MassageType: " + err);
            });
        });
    }).get(function (req, res) {
        var sqlMassageTypes = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlMassageTypes);
            request.query('SELECT H.id AS id\n                    ,H.type AS type\n                    ,H.venue AS venue\n                    ,H.header AS header\n                    ,H.description AS description\n                    ,NULL AS session_time\n                    ,NULL AS title\n                    ,NULL AS parent_id\n                    ,NULL AS cost\n                    ,NULL AS icon\n                    ,NULL AS iconHeight\n                    ,NULL AS iconWidth\n                    FROM Headers H\n                    WHERE H.type IN (SELECT M.type FROM MassageTypes M)\n\n                    UNION ALL\n\n                    SELECT M.id AS id\n                    ,M.type AS type\n                    ,NULL AS venue\n                    ,NULL AS header\n                    ,NULL AS description\n                    ,M.session_time AS session_time\n                    ,M.title AS title\n                    ,NULL AS parent_id\n                    ,CASE WHEN ISNUMERIC(M.cost) = 1 \n                                 THEN FORMAT(TRY_PARSE(M.cost AS money), \'C\', \'de-de\') \n                                 ELSE M.cost END AS cost\n                    ,M.icon AS icon\n                    ,M.iconHeight AS iconHeight\n                    ,M.iconWidth AS iconWidth\n                    FROM MassageTypes M\n\n                    UNION ALL\n\n                    SELECT D.id AS id\n                    ,D.type AS type\n                    ,NULL as venue\n                    ,NULL as header\n                    ,D.description as description\n                    ,NULL as session_time\n                    ,D.title AS title\n                    ,D.parent_id AS parent_id\n                    ,NULL AS cost\n                    ,NULL AS icon\n                    ,NULL as iconHeight\n                    ,NULL AS iconWidth\n                    FROM MassageDetails D').then(function (recordset) {
                var massagePage = [];
                var counter = 0;
                for (var header_prop in recordset) {
                    if (recordset.hasOwnProperty(header_prop)) {
                        if (recordset[header_prop].header != null) {
                            var massage_header = {
                                id: recordset[header_prop].id,
                                header: recordset[header_prop].header,
                                venue: recordset[header_prop].venue,
                                description: recordset[header_prop].description,
                                type: recordset[header_prop].type,
                                massages: []
                            };
                            massagePage.push(massage_header);
                            var counter_detail = 0;
                            for (var massage_prop in recordset) {
                                if (recordset.hasOwnProperty(massage_prop)) {
                                    if (recordset[massage_prop].session_time != null) {
                                        if (recordset[header_prop].type == recordset[massage_prop].type) {
                                            var massages = {
                                                id: recordset[massage_prop].id,
                                                type: recordset[header_prop].type,
                                                session_time: recordset[massage_prop].session_time,
                                                title: recordset[massage_prop].title,
                                                cost: recordset[massage_prop].cost,
                                                icon: recordset[massage_prop].icon,
                                                iconHeight: recordset[massage_prop].iconHeight,
                                                iconWidth: recordset[massage_prop].iconWidth,
                                                massage_details: []
                                            };
                                            massagePage[counter].massages.push(massages);
                                            for (var detail_prop in recordset) {
                                                if (recordset.hasOwnProperty(detail_prop)) {
                                                    if (recordset[detail_prop].parent_id != null) {
                                                        if (recordset[massage_prop].id == recordset[detail_prop].parent_id) {
                                                            var massage_details = {
                                                                id: recordset[detail_prop].id,
                                                                title: recordset[detail_prop].title,
                                                                description: recordset[detail_prop].description
                                                            };
                                                            massagePage[counter].massages[counter_detail].massage_details.push(massage_details);
                                                        }
                                                    }
                                                }
                                            }
                                            counter_detail++;
                                        }
                                    }
                                }
                            }
                            counter++;
                        }
                    }
                }
                res.json(massagePage);
            }).catch(function (err) {
                console.log("massageTypes: " + err);
            });
        });
    });

    massageTypeRouter.route('/massages/:massageTypeId').get(function (req, res) {
        var sqlMassageType = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlMassageType);
            request.input('id', _mssql2.default.Int, req.params.massageTypeId);
            request.query('SELECT id\n                                ,type\n                                ,venue\n                                ,header\n                                ,description\n                                ,session_time\n                                ,title\n                                ,details\n                                ,cost\n                                FROM MassageTypes\n                                WHERE id = @id').then(function (recordset) {
                if (recordset.length > 0) {
                    res.json(recordset);
                } else {
                    res.status(500).send("No MassageType found with this ID.");
                }
            }).catch(function (err) {
                console.log("MassageType: " + err);
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
        var sqlDeleteMassageType = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlDeleteMassageType);
            request.input('id', _mssql2.default.Int, req.params.massageTypeId);
            request.query('DELETE FROM MassageTypes\n                     WHERE id = @id').then(res.status(201).send("MassageType has been deleted.")).catch(function (err) {
                console.log("delete MassageType: " + err);
            });
        });
    });

    return massageTypeRouter;
};

module.exports = massageTypeRoutes;

exports.default = massageTypeRoutes;