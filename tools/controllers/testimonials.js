import express from 'express';
import {secret} from '../../secrets';
import jwt from 'jwt-simple';
import moment from 'moment';
import { executeQuery } from '../sqlQuery';

let testimonialRoutes = function () {

    const testimonialRouter = express.Router();

    testimonialRouter.route('/testimonials')
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
            let testimonial = (req.body);
            const insertPromises = Object.keys(testimonial.testimonial_details || {}).map(function (prop) {
                return executeQuery(
                    `INSERT INTO Testimonials (type, testimonial, name)
                     VALUES (@type, @testimonial, @name)`,
                    function (request, sql) {
                        request.input('type', sql.VarChar, testimonial.type);
                        request.input('testimonial', sql.VarChar, testimonial.testimonial);
                        request.input('name', sql.VarChar, testimonial.name);
                    }
                );
            });
            Promise.all(insertPromises).then(function () {
                res.status(201).send(testimonial);
            }).catch(function (err) {
                console.log("insert testimonial: " + err);
                res.status(500).send("Unable to save testimonial.");
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
            let testimonial = (req.body);
            const existingIds = (testimonial.testimonial_details || [])
                .filter(function (d) { return d.id; })
                .map(function (d) { return d.id; });
            const deleteQuery = existingIds.length > 0
                ? `DELETE FROM Testimonials WHERE id NOT IN (${existingIds.join(',')})`
                : `DELETE FROM Testimonials`;

            executeQuery(
                `UPDATE Headers
                 SET short = @short
                 ,description = @description
                 FROM Headers
                 WHERE type = @type;`,
                function (request, sql) {
                    request.input('short', sql.VarChar, testimonial.short);
                    request.input('description', sql.VarChar, testimonial.description);
                    request.input('type', sql.VarChar, 'Testimonial');
                }
            ).then(function () {
                return executeQuery(deleteQuery);
            }).then(function () {
                const savePromises = (testimonial.testimonial_details || []).map(function (detail) {
                    if (detail.id) {
                        return executeQuery(
                            `UPDATE Testimonials
                            SET testimonial = @testimonial
                            ,name = @name
                            WHERE id = @id`,
                            function (request, sql) {
                                request.input('id', sql.Int, detail.id);
                                request.input('testimonial', sql.VarChar, detail.testimonial);
                                request.input('name', sql.VarChar, detail.name);
                            }
                        );
                    }
                    return executeQuery(
                        `INSERT INTO Testimonials (type, testimonial, name)
                        VALUES (@type, @testimonial, @name)`,
                        function (request, sql) {
                            request.input('type', sql.VarChar, 'Testimonial');
                            request.input('testimonial', sql.VarChar, detail.testimonial);
                            request.input('name', sql.VarChar, detail.name);
                        }
                    );
                });
                return Promise.all(savePromises);
            }).then(function () {
                res.status(201).json(testimonial);
            }).catch(function (err) {
                console.log("Testimonial: " + err);
                res.status(500).send("Unable to save testimonials.");
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
                `DELETE FROM Testimonials
                 WHERE id = @id`,
                function (request, sql) {
                    request.input('id', sql.Int, req.body.id);
                }
            ).then(function () {
                res.status(201).send("Testimonial has been deleted.");
            }).catch(function (err) {
                console.log("delete testimonial: " + err);
                res.status(500).send("Unable to delete testimonial.");
            });
        })
        .get(function (req, res) {
            executeQuery(
                `SELECT
                    H.id
                    ,H.type
                    ,H.short AS short
                    ,H.header AS header
                    ,H.description AS description
                    ,NULL AS testimonial
                    ,NULL AS name
                    FROM Headers H
                    WHERE H.type IN (SELECT T.type FROM Testimonials T)

                    UNION ALL

                    SELECT T.id AS id
                    ,T.type AS type
                    ,NULL as short
                    ,NULL as header
                    ,NULL as description
                    ,T.testimonial AS testimonial
                    ,T.name AS name
                    FROM Testimonials T`
            ).then(function (recordset) {
                    if (!recordset || recordset.length === 0) {
                        return res.json({
                            header: '',
                            short: '',
                            description: '',
                            testimonial_details: []
                        });
                    }

                    let testimonials = {
                        header: recordset[0].header,
                        short: recordset[0].short,
                        description: recordset[0].description,
                        testimonial_details: []
                    };
                    for (let testimonialProp in recordset) {
                        if (recordset.hasOwnProperty(testimonialProp)) {
                            if (recordset[testimonialProp].testimonial != null) {
                                let testimonial = {
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
                    res.status(500).send("Unable to load testimonials.");
                });
        });

    testimonialRouter.route('/testimonials/:testimonialId')
        .get(function (req, res) {
            executeQuery(
                `SELECT id
                    ,type
                    ,testimonial
                    ,name
                    FROM Testimonials
                    WHERE id = @id`,
                function (request, sql) {
                    request.input('id', sql.Int, req.params.testimonialId);
                }
            ).then(function (recordset) {
                    res.json(recordset);
                }).catch(function (err) {
                    console.log("testimonials: " + err);
                    res.status(500).send("Unable to load testimonial.");
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
                `DELETE FROM Testimonials
                 WHERE id = @id`,
                function (request, sql) {
                    request.input('id', sql.Int, req.params.testimonialId);
                }
            ).then(function () {
                res.status(201).send("Testimonial has been deleted.");
            }).catch(function (err) {
                console.log("delete testimonial: " + err);
                res.status(500).send("Unable to delete testimonial.");
            });
        });

    return testimonialRouter;
};

module.exports = testimonialRoutes;

export default testimonialRoutes;
