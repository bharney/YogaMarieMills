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

var consultationRoutes = function consultationRoutes() {

    var consultationRouter = _express2.default.Router();
    var dbconfig = "mssql://yogamariemills:!Testing123@yogamariemills.database.windows.net/YogaMarieMills?encrypt=true";

    function tryParseCurrency(str) {
        if (typeof str !== "undefined" && str) {
            var parsed = str.match(/[\s-\d\,\.]+/g);
            if (isNaN(parseFloat(parsed))) return str;

            if (parsed) return parseFloat(+parsed[0].replace(/\./g, '').replace(/,/g, '.').replace(/\s/g, '')).toFixed(2);
        }
        return '';
    }

    consultationRouter.route('/consultations').post(function (req, res) {
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
        var consultation = req.body;

        var _loop = function _loop(prop) {
            if (consultation.consultationDetails.hasOwnProperty(prop)) {
                var sqlInsertConsultation = new _mssql2.default.Connection(dbconfig, function () {
                    var request = new _mssql2.default.Request(sqlInsertConsultation);
                    request.input('type', _mssql2.default.VarChar, 'diet');
                    request.input('title', _mssql2.default.VarChar, consultation.consultationDetails[prop].title);
                    request.input('session_time', _mssql2.default.VarChar, consultation.consultationDetails[prop].session_time);
                    request.input('consultation', _mssql2.default.VarChar, consultation.consultationDetails[prop].consultation);
                    request.input('consultation_desc', _mssql2.default.VarChar, consultation.consultationDetails[prop].consultation_desc);
                    request.input('cost', _mssql2.default.VarChar, tryParseCurrency(consultation.consultationDetails[prop].cost));
                    request.query('INSERT INTO Consultations (type, title, session_time, short, description, cost)\n                             VALUES (@type, @title, @session_time, @consultation, @consultation_desc, @cost);').then(console.log("post insert: " + consultation)).catch(function (err) {
                        console.log("insert Consultations: " + err);
                    });
                });
            }
        };

        for (var prop in consultation.consultationDetails) {
            _loop(prop);
        }
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
        var consultation = req.body;
        var sqlUpdateConsultation = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlUpdateConsultation);
            request.input('venue', _mssql2.default.VarChar, consultation.venue);
            request.input('short', _mssql2.default.VarChar, consultation.short);
            request.input('description', _mssql2.default.VarChar, consultation.description);
            request.input('type', _mssql2.default.VarChar, 'diet');
            request.query('UPDATE Headers \n                     SET venue = @venue\n                     , short = @short\n                     , description = @description\n                     FROM Headers\n                     WHERE type = @type;').then(function () {
                var sqlDeleteConsultationDetails = new _mssql2.default.Connection(dbconfig, function () {
                    var request = new _mssql2.default.Request(sqlDeleteConsultationDetails);
                    request.query('DELETE FROM Consultations\n                            WHERE id NOT IN (' + consultation.consultationDetails.filter(function (consultationDetails) {
                        return consultationDetails.id;
                    }).map(function (obj) {
                        return obj.id;
                    }).join(',') + ')').then(function () {
                        var _loop2 = function _loop2(prop) {
                            if (consultation.consultationDetails.hasOwnProperty(prop)) {
                                if (consultation.consultationDetails[prop].id) {
                                    var sqlUpdateConsultationDetails = new _mssql2.default.Connection(dbconfig, function () {
                                        var request = new _mssql2.default.Request(sqlUpdateConsultationDetails);
                                        request.input('id', _mssql2.default.Int, consultation.consultationDetails[prop].id);
                                        request.input('title', _mssql2.default.VarChar, consultation.consultationDetails[prop].title);
                                        request.input('session_time', _mssql2.default.VarChar, consultation.consultationDetails[prop].session_time);
                                        request.input('consultation', _mssql2.default.VarChar, consultation.consultationDetails[prop].consultation);
                                        request.input('consultation_desc', _mssql2.default.VarChar, consultation.consultationDetails[prop].consultation_desc);
                                        request.input('cost', _mssql2.default.VarChar, tryParseCurrency(consultation.consultationDetails[prop].cost));
                                        request.query('UPDATE Consultations \n                                                    SET title = @title\n                                                    , session_time = @session_time\n                                                    , short = @consultation\n                                                    , description = @consultation_desc\n                                                    , cost = @cost\n                                                    WHERE id = @id;').then(console.log("ConsultationDetails Updated")).catch(function (err) {
                                            console.log("update ConsultationDetails: " + err);
                                        });
                                    });
                                } else {
                                    var sqlInsertConsultationDetails = new _mssql2.default.Connection(dbconfig, function () {
                                        var request = new _mssql2.default.Request(sqlInsertConsultationDetails);
                                        request.input('type', _mssql2.default.VarChar, 'diet');
                                        request.input('title', _mssql2.default.VarChar, consultation.consultationDetails[prop].title);
                                        request.input('session_time', _mssql2.default.VarChar, consultation.consultationDetails[prop].session_time);
                                        request.input('consultation', _mssql2.default.VarChar, consultation.consultationDetails[prop].consultation);
                                        request.input('consultation_desc', _mssql2.default.VarChar, consultation.consultationDetails[prop].consultation_desc);
                                        request.input('cost', _mssql2.default.VarChar, tryParseCurrency(consultation.consultationDetails[prop].cost));
                                        request.query('INSERT INTO Consultations (type, title, session_time, short, description, cost)\n                                                VALUES (@type, @title, @session_time, @consultation, @consultation_desc, @cost);').then(console.log("ConsultationDetails Inserted")).catch(function (err) {
                                            console.log("insert ConsultationDetails: " + err);
                                        });
                                    });
                                }
                            }
                        };

                        for (var prop in consultation.consultationDetails) {
                            _loop2(prop);
                        }
                    }).catch(function (err) {
                        console.log("ConsultationDetails delete" + err);
                    });
                });
            }).catch(function (err) {
                console.log("ConsultationDetails " + err);
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
        var sqlDeleteConsultation = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlDeleteConsultation);
            request.input('id', _mssql2.default.Int, req.body.id);
            request.query('DELETE FROM Consultations\n                     WHERE id = @id').then(res.status(201).send("Consultation has been deleted.")).catch(function (err) {
                console.log("delete Consultation: " + err);
            });
        });
    }).get(function (req, res) {
        var sqlConsultations = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlConsultations);
            request.query('SELECT C.id AS id\n                    ,C.type AS type\n                    ,H.header AS header\n                    ,H.short AS short\n                    ,H.description AS description \n                    ,H.venue AS venue\n                    ,C.session_time AS session_time\n                    ,C.title AS title\n                    ,C.short AS consultation\n                    ,C.description AS consultation_desc\n                    ,CASE WHEN ISNUMERIC(C.cost) = 1 \n                                 THEN FORMAT(TRY_PARSE(C.cost AS money), \'C\', \'de-de\') \n                                 ELSE C.cost END AS cost\n                    ,C.icon AS icon\n                    ,C.iconHeight AS iconHeight\n                    ,C.iconWidth AS iconWidth\n                    FROM Headers H\n                    JOIN Consultations C\n                    ON H.type = C.type').then(function (recordset) {
                var consultationDetails = [];
                for (var consultationProp in recordset) {
                    if (recordset.hasOwnProperty(consultationProp)) {
                        consultationDetails.push({
                            id: recordset[consultationProp].id,
                            type: recordset[consultationProp].type,
                            session_time: recordset[consultationProp].session_time,
                            title: recordset[consultationProp].title,
                            consultation: recordset[consultationProp].consultation,
                            consultation_desc: recordset[consultationProp].consultation_desc,
                            cost: recordset[consultationProp].cost,
                            icon: recordset[consultationProp].icon,
                            iconWidth: recordset[consultationProp].iconWidth,
                            iconHeight: recordset[consultationProp].iconHeight
                        });
                    }
                }
                var consultation = {
                    header: recordset[0].header,
                    short: recordset[0].short,
                    description: recordset[0].description,
                    venue: recordset[0].venue,
                    consultationDetails: consultationDetails
                };
                res.json(consultation);
            }).catch(function (err) {
                console.log("consultations: " + err);
            });
        });
    });

    consultationRouter.route('/consultations/:consultationId').get(function (req, res) {
        var sqlConsultation = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlConsultation);
            request.input('id', _mssql2.default.Int, req.params.consultationId);
            request.query('SELECT id\n                                ,type\n                                ,session_time\n                                ,title\n                                ,consultation\n                                ,consultation_desc\n                                ,cost\n                                FROM consultations\n                                WHERE id = @id').then(function (recordset) {
                if (recordset.length > 0) {
                    res.json(recordset);
                } else {
                    res.status(500).send("No Consultation found with this ID.");
                }
            }).catch(function (err) {
                console.log("Consultation: " + err);
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
        var sqlDeleteConsultation = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlDeleteConsultation);
            request.input('id', _mssql2.default.Int, req.params.consultationId);
            request.query('DELETE FROM Consultations\n                     WHERE id = @id').then(res.status(201).send("Consultation has been deleted.")).catch(function (err) {
                console.log("delete Consultation: " + err);
            });
        });
    });

    return consultationRouter;
};

module.exports = consultationRoutes;

exports.default = consultationRoutes;