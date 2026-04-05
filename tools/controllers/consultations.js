import express from 'express';
import {secret} from '../../secrets';
import jwt from 'jwt-simple';
import moment from 'moment';
import { executeQuery } from '../sqlQuery';

let consultationRoutes = function () {

    const consultationRouter = express.Router();

    function tryParseCurrency(str) {
        if (typeof (str) !== "undefined" && str) {
            let parsed = str.match(/[\s-\d\,\.]+/g);
            if (isNaN(parseFloat(parsed)))
                return str

            if (parsed)
                return parseFloat(+parsed[0].replace(/\./g, '').replace(/,/g, '.').replace(/\s/g, '')).toFixed(2);
        }
        return ''
    }

    consultationRouter.route('/consultations')
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
            let consultation = (req.body);
            const insertPromises = Object.keys(consultation.consultationDetails || {}).map(function (prop) {
                const detail = consultation.consultationDetails[prop];
                return executeQuery(
                    `INSERT INTO Consultations (type, title, session_time, short, description, cost)
                     VALUES (@type, @title, @session_time, @consultation, @consultation_desc, @cost);`,
                    function (request, sql) {
                        request.input('type', sql.VarChar, 'diet');
                        request.input('title', sql.VarChar, detail.title);
                        request.input('session_time', sql.VarChar, detail.session_time);
                        request.input('consultation', sql.VarChar, detail.consultation);
                        request.input('consultation_desc', sql.VarChar, detail.consultation_desc);
                        request.input('cost', sql.VarChar, tryParseCurrency(detail.cost));
                    }
                );
            });
            Promise.all(insertPromises).then(function () {
                res.status(201).send(consultation);
            }).catch(function (err) {
                console.log("insert Consultations: " + err);
                res.status(500).send("Unable to save consultation.");
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
            let consultation = (req.body);
            const consultationDetails = consultation.consultationDetails || [];
            const existingIds = consultationDetails
                .filter(function (d) { return d.id; })
                .map(function (d) { return d.id; });
            const deleteQuery = existingIds.length > 0
                ? `DELETE FROM Consultations WHERE type = 'diet' AND id NOT IN (${existingIds.join(',')})`
                : `DELETE FROM Consultations WHERE type = 'diet'`;

            executeQuery(
                `UPDATE Headers
                 SET venue = @venue
                 , short = @short
                 , description = @description
                 FROM Headers
                 WHERE type = @type;`,
                function (request, sql) {
                    request.input('venue', sql.VarChar, consultation.venue);
                    request.input('short', sql.VarChar, consultation.short);
                    request.input('description', sql.VarChar, consultation.description);
                    request.input('type', sql.VarChar, 'diet');
                }
            ).then(function () {
                return executeQuery(deleteQuery);
            }).then(function () {
                const savePromises = consultationDetails.map(function (detail) {
                    if (detail.id) {
                        return executeQuery(
                            `UPDATE Consultations
                             SET title = @title
                             , session_time = @session_time
                             , short = @consultation
                             , description = @consultation_desc
                             , cost = @cost
                             WHERE id = @id;`,
                            function (request, sql) {
                                request.input('id', sql.Int, detail.id);
                                request.input('title', sql.VarChar, detail.title);
                                request.input('session_time', sql.VarChar, detail.session_time);
                                request.input('consultation', sql.VarChar, detail.consultation);
                                request.input('consultation_desc', sql.VarChar, detail.consultation_desc);
                                request.input('cost', sql.VarChar, tryParseCurrency(detail.cost));
                            }
                        );
                    }
                    return executeQuery(
                        `INSERT INTO Consultations (type, title, session_time, short, description, cost)
                         VALUES (@type, @title, @session_time, @consultation, @consultation_desc, @cost);`,
                        function (request, sql) {
                            request.input('type', sql.VarChar, 'diet');
                            request.input('title', sql.VarChar, detail.title);
                            request.input('session_time', sql.VarChar, detail.session_time);
                            request.input('consultation', sql.VarChar, detail.consultation);
                            request.input('consultation_desc', sql.VarChar, detail.consultation_desc);
                            request.input('cost', sql.VarChar, tryParseCurrency(detail.cost));
                        }
                    );
                });
                return Promise.all(savePromises);
            }).then(function () {
                return res.status(200).json(consultation);
            }).catch(function (err) {
                console.log("ConsultationDetails " + err);
                return res.status(500).send({ message: 'Unable to save consultation details.' });
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
                `DELETE FROM Consultations
                 WHERE id = @id`,
                function (request, sql) {
                    request.input('id', sql.Int, req.body.id);
                }
            ).then(function () {
                res.status(201).send("Consultation has been deleted.");
            }).catch(function (err) {
                console.log("delete Consultation: " + err);
                res.status(500).send("Unable to delete consultation.");
            });
        })
        .get(function (req, res) {
            executeQuery(
                `SELECT C.id AS id
                ,C.type AS type
                ,H.header AS header
                ,H.short AS short
                ,H.description AS description
                ,H.venue AS venue
                ,C.session_time AS session_time
                ,C.title AS title
                ,C.short AS consultation
                ,C.description AS consultation_desc
                ,CASE WHEN ISNUMERIC(C.cost) = 1
                             THEN FORMAT(TRY_PARSE(C.cost AS money), 'C', 'de-de')
                             ELSE C.cost END AS cost
                ,C.icon AS icon
                ,C.iconHeight AS iconHeight
                ,C.iconWidth AS iconWidth
                FROM Headers H
                LEFT JOIN Consultations C
                ON H.type = C.type
                WHERE H.type = 'diet'`
            ).then(function (recordset) {
                    if (!recordset || recordset.length === 0) {
                        return res.json({
                            header: '',
                            short: '',
                            description: '',
                            venue: '',
                            consultationDetails: []
                        });
                    }

                    let consultationDetails = [];
                    for (let consultationProp in recordset) {
                        if (recordset.hasOwnProperty(consultationProp)) {
                            // LEFT JOIN rows with no Consultations match have null id — skip them
                            if (recordset[consultationProp].id !== null) {
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
                    }
                    let consultation = {
                        header: recordset[0].header,
                        short: recordset[0].short,
                        description: recordset[0].description,
                        venue: recordset[0].venue,
                        consultationDetails: consultationDetails
                    };
                    res.json(consultation);
                }).catch(function (err) {
                    console.log("consultations: " + err);
                    res.status(500).send("Unable to load consultations.");
                });
        });

    consultationRouter.route('/consultations/:consultationId')
        .get(function (req, res) {
            executeQuery(`SELECT id
                                ,type
                                ,session_time
                                ,title
                                ,consultation
                                ,consultation_desc
                                ,cost
                                FROM consultations
                                WHERE id = @id`,
                function (request, sql) {
                    request.input('id', sql.Int, req.params.consultationId);
                }
            ).then(function (recordset) {
                    if (recordset.length > 0) {
                        res.json(recordset);
                    }
                    else {
                        res.status(500).send("No Consultation found with this ID.");
                    }
                }).catch(function (err) {
                    console.log("Consultation: " + err);
                    res.status(500).send("Unable to load consultation.");
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
                `DELETE FROM Consultations
                 WHERE id = @id`,
                function (request, sql) {
                    request.input('id', sql.Int, req.params.consultationId);
                }
            ).then(function () {
                res.status(201).send("Consultation has been deleted.");
            }).catch(function (err) {
                console.log("delete Consultation: " + err);
                res.status(500).send("Unable to delete consultation.");
            });
        });

    return consultationRouter;
};

module.exports = consultationRoutes;

export default consultationRoutes;
