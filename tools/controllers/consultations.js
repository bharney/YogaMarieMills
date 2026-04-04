import express from 'express';
import sql from 'mssql';
import {secret, dbconfig} from '../../secrets';
import jwt from 'jwt-simple';
import moment from 'moment';

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
            for (let prop in consultation.consultationDetails) {
                if (consultation.consultationDetails.hasOwnProperty(prop)) {
                    const sqlInsertConsultation = new sql.Connection(dbconfig, function () {
                        let request = new sql.Request(sqlInsertConsultation);
                        request.input('type', sql.VarChar, 'diet');
                        request.input('title', sql.VarChar, consultation.consultationDetails[prop].title);
                        request.input('session_time', sql.VarChar, consultation.consultationDetails[prop].session_time);
                        request.input('consultation', sql.VarChar, consultation.consultationDetails[prop].consultation);
                        request.input('consultation_desc', sql.VarChar, consultation.consultationDetails[prop].consultation_desc);
                        request.input('cost', sql.VarChar, tryParseCurrency(consultation.consultationDetails[prop].cost));
                        request.query(
                            `INSERT INTO Consultations (type, title, session_time, short, description, cost)
                             VALUES (@type, @title, @session_time, @consultation, @consultation_desc, @cost);`
                        ).then(console.log("post insert: " + consultation)).catch(function (err) {
                            console.log("insert Consultations: " + err);
                        });
                    });
                }
            }
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
            const sqlUpdateConsultation = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlUpdateConsultation);
                request.input('venue', sql.VarChar, consultation.venue);
                request.input('short', sql.VarChar, consultation.short);
                request.input('description', sql.VarChar, consultation.description);
                request.input('type', sql.VarChar, 'diet');

                const existingIds = consultationDetails
                    .filter(consultationDetail => consultationDetail.id)
                    .map(function (obj) { return obj.id; });
                const deleteQuery = existingIds.length > 0
                    ? `DELETE FROM Consultations WHERE type = 'diet' AND id NOT IN (${existingIds.join(',')})`
                    : `DELETE FROM Consultations WHERE type = 'diet'`;

                request.query(
                    `UPDATE Headers
                     SET venue = @venue
                     , short = @short
                     , description = @description
                     FROM Headers
                     WHERE type = @type;`
                ).then(function () {
                    return new sql.Request(sqlUpdateConsultation).query(deleteQuery);
                }).then(function () {
                    const saveRequests = consultationDetails.map(function (detail) {
                        if (detail.id) {
                            let updateRequest = new sql.Request(sqlUpdateConsultation);
                            updateRequest.input('id', sql.Int, detail.id);
                            updateRequest.input('title', sql.VarChar, detail.title);
                            updateRequest.input('session_time', sql.VarChar, detail.session_time);
                            updateRequest.input('consultation', sql.VarChar, detail.consultation);
                            updateRequest.input('consultation_desc', sql.VarChar, detail.consultation_desc);
                            updateRequest.input('cost', sql.VarChar, tryParseCurrency(detail.cost));
                            return updateRequest.query(
                                `UPDATE Consultations
                                 SET title = @title
                                 , session_time = @session_time
                                 , short = @consultation
                                 , description = @consultation_desc
                                 , cost = @cost
                                 WHERE id = @id;`
                            );
                        }

                        let insertRequest = new sql.Request(sqlUpdateConsultation);
                        insertRequest.input('type', sql.VarChar, 'diet');
                        insertRequest.input('title', sql.VarChar, detail.title);
                        insertRequest.input('session_time', sql.VarChar, detail.session_time);
                        insertRequest.input('consultation', sql.VarChar, detail.consultation);
                        insertRequest.input('consultation_desc', sql.VarChar, detail.consultation_desc);
                        insertRequest.input('cost', sql.VarChar, tryParseCurrency(detail.cost));
                        return insertRequest.query(
                            `INSERT INTO Consultations (type, title, session_time, short, description, cost)
                             VALUES (@type, @title, @session_time, @consultation, @consultation_desc, @cost);`
                        );
                    });

                    return Promise.all(saveRequests);
                }).then(function () {
                    return res.status(200).json(consultation);
                }).catch(function (err) {
                    console.log("ConsultationDetails " + err);
                    return res.status(500).send({ message: 'Unable to save consultation details.' });
                });
            })
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
            const sqlDeleteConsultation = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlDeleteConsultation);
                request.input('id', sql.Int, req.body.id);
                request.query(
                    `DELETE FROM Consultations
                     WHERE id = @id`
                ).then(res.status(201).send("Consultation has been deleted.")).catch(function (err) {
                    console.log("delete Consultation: " + err);
                });
            });
        })
        .get(function (req, res) {
            const sqlConsultations = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlConsultations);
                request.query(
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
                });
            });
        });

    consultationRouter.route('/consultations/:consultationId')
        .get(function (req, res) {
            const sqlConsultation = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlConsultation);
                request.input('id', sql.Int, req.params.consultationId);
                request.query(`SELECT id
                                ,type
                                ,session_time
                                ,title
                                ,consultation
                                ,consultation_desc
                                ,cost
                                FROM consultations
                                WHERE id = @id`
                ).then(function (recordset) {
                    if (recordset.length > 0) {
                        res.json(recordset);
                    }
                    else {
                        res.status(500).send("No Consultation found with this ID.");
                    }
                }).catch(function (err) {
                    console.log("Consultation: " + err);
                });
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
            const sqlDeleteConsultation = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlDeleteConsultation);
                request.input('id', sql.Int, req.params.consultationId);
                request.query(
                    `DELETE FROM Consultations
                     WHERE id = @id`
                ).then(res.status(201).send("Consultation has been deleted.")).catch(function (err) {
                    console.log("delete Consultation: " + err);
                });
            });
        });

    return consultationRouter;
};

module.exports = consultationRoutes;

export default consultationRoutes;
