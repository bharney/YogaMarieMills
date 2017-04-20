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

var testimonialRoutes = function testimonialRoutes() {

    var testimonialRouter = _express2.default.Router();
    var dbconfig = "mssql://yogamariemills:!Testing123@yogamariemills.database.windows.net/YogaMarieMills?encrypt=true";

    testimonialRouter.route('/testimonials').post(function (req, res) {
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
        var testimonial = req.body;
        for (var prop in testimonial.testimonial_details) {
            if (testimonial.testimonial_details.hasOwnProperty(prop)) {
                (function () {
                    var sqlInsertTestimonial = new _mssql2.default.Connection(dbconfig, function () {
                        var request = new _mssql2.default.Request(sqlInsertTestimonial);
                        request.input('type', _mssql2.default.VarChar, testimonial.type);
                        request.input('testimonial', _mssql2.default.VarChar, testimonial.testimonial);
                        request.input('name', _mssql2.default.VarChar, testimonial.name);
                        request.query('INSERT INTO Testimonials (type, testimonial, name)\n                             VALUES (@type, @testimonial, @name)').then(res.status(201).send(testimonial)).catch(function (err) {
                            console.log("insert testimonial: " + err);
                        });
                    });
                })();
            }
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
        var testimonial = req.body;
        var sqlUpdateConsultation = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlUpdateConsultation);
            request.input('short', _mssql2.default.VarChar, testimonial.short);
            request.input('description', _mssql2.default.VarChar, testimonial.description);
            request.input('type', _mssql2.default.VarChar, 'Testimonial');
            request.query('UPDATE Headers \n                     SET short = @short\n                     ,description = @description\n                     FROM Headers\n                     WHERE type = @type;').then(function () {
                var sqlDeleteTestimonials = new _mssql2.default.Connection(dbconfig, function () {
                    var request = new _mssql2.default.Request(sqlDeleteTestimonials);
                    request.query('DELETE FROM Testimonials\n                            WHERE id NOT IN (' + testimonial.testimonial_details.filter(function (testimonial_details) {
                        return testimonial_details.id;
                    }).map(function (obj) {
                        return obj.id;
                    }).join(',') + ')').then(function () {
                        var _loop = function _loop(prop) {
                            if (testimonial.testimonial_details.hasOwnProperty(prop)) {
                                if (testimonial.testimonial_details[prop].id) {
                                    var sqlUpdateTestimonial = new _mssql2.default.Connection(dbconfig, function () {
                                        var request = new _mssql2.default.Request(sqlUpdateTestimonial);
                                        request.input('id', _mssql2.default.Int, testimonial.testimonial_details[prop].id);
                                        request.input('testimonial', _mssql2.default.VarChar, testimonial.testimonial_details[prop].testimonial);
                                        request.input('name', _mssql2.default.VarChar, testimonial.testimonial_details[prop].name);
                                        request.query('UPDATE Testimonials\n                                                    SET testimonial = @testimonial\n                                                    ,name = @name\n                                                    WHERE id = @id').then(console.log("TestimonialDetails Updated")).catch(function (err) {
                                            console.log("update TestimonialDetails: " + err);
                                        });
                                    });
                                } else {
                                    var sqlInsertTestimonial = new _mssql2.default.Connection(dbconfig, function () {
                                        var request = new _mssql2.default.Request(sqlInsertTestimonial);
                                        request.input('type', _mssql2.default.VarChar, 'Testimonial');
                                        request.input('testimonial', _mssql2.default.VarChar, testimonial.testimonial_details[prop].testimonial);
                                        request.input('name', _mssql2.default.VarChar, testimonial.testimonial_details[prop].name);
                                        request.query('INSERT INTO Testimonials (type, testimonial, name)\n                                                VALUES (@type, @testimonial, @name)').then(console.log("TestimonialDetails Inserted")).catch(function (err) {
                                            console.log("insert TestimonialDetails: " + err);
                                        });
                                    });
                                }
                            }
                        };

                        for (var prop in testimonial.testimonial_details) {
                            _loop(prop);
                        }
                    }).catch(function (err) {
                        console.log("Testimonial delete" + err);
                    });
                });
            }).catch(function (err) {
                console.log("Testimonial Header: " + err);
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
        var sqlDeleteTestimonial = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlDeleteTestimonial);
            request.input('id', _mssql2.default.Int, req.body.id);
            request.query('DELETE FROM Testimonials\n                     WHERE id = @id').then(res.status(201).send("Testimonial has been deleted.")).catch(function (err) {
                console.log("delete testimonial: " + err);
            });
        });
    }).get(function (req, res) {
        var sqlTestimonials = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlTestimonials);
            request.query('SELECT\n                        H.id\n                        ,H.type\n                        ,H.short AS short\n                        ,H.header AS header\n                        ,H.description AS description\n                        ,NULL AS testimonial\n                        ,NULL AS name\n                        FROM Headers H\n                        WHERE H.type IN (SELECT T.type FROM Testimonials T)\n\n                        UNION ALL\n\n                        SELECT T.id AS id\n                        ,T.type AS type\n                        ,NULL as short\n                        ,NULL as header\n                        ,NULL as description\n                        ,T.testimonial AS testimonial\n                        ,T.name AS name\n                        FROM Testimonials T').then(function (recordset) {
                var testimonials = {
                    header: recordset[0].header,
                    short: recordset[0].short,
                    description: recordset[0].description,
                    testimonial_details: []
                };
                for (var testimonialProp in recordset) {
                    if (recordset.hasOwnProperty(testimonialProp)) {
                        if (recordset[testimonialProp].testimonial != null) {
                            var testimonial = {
                                id: recordset[testimonialProp].id,
                                type: recordset[testimonialProp].type,
                                testimonial: recordset[testimonialProp].testimonial,
                                name: recordset[testimonialProp].name
                            };
                            testimonials.testimonial_details.push(testimonial);
                        }
                    }
                }
                res.json(testimonials);
            }).catch(function (err) {
                console.log("testimonials: " + err);
            });
        });
    });

    testimonialRouter.route('/testimonials/:testimonialId').get(function (req, res) {
        var sqlTestimonials = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlTestimonials);
            request.query('SELECT id\n                    ,type\n                    ,testimonial\n                    ,name\n                    FROM Testimonials').then(function (recordset) {
                res.json(recordset);
            }).catch(function (err) {
                console.log("testimonials: " + err);
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
        var sqlDeleteTestimonial = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlDeleteTestimonial);
            request.input('id', _mssql2.default.Int, req.params.testimonialId);
            request.query('DELETE FROM Testimonials\n                     WHERE id = @id').then(res.status(201).send("Testimonial has been deleted.")).catch(function (err) {
                console.log("delete testimonial: " + err);
            });
        });
    });

    return testimonialRouter;
};

module.exports = testimonialRoutes;

exports.default = testimonialRoutes;