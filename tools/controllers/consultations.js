import express from 'express';
import sql from 'mssql';
import secret from '../../secrets';
import jwt from 'jwt-simple';
import moment from 'moment';

let consultationRoutes = function () {

    const consultationRouter = express.Router();
    const dbconfig = "mssql://Application:!Testing123@BPHSERVER/YogaMarieMills";

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
            const sqlUpdateConsultation = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlUpdateConsultation);
                request.input('venue', sql.VarChar, consultation.venue);
                request.input('short', sql.VarChar, consultation.short);
                request.input('description', sql.VarChar, consultation.description);
                request.input('type', sql.VarChar, 'diet');
                request.query(
                    `UPDATE Headers 
                     SET venue = @venue
                     , short = @short
                     , description = @description
                     FROM Headers
                     WHERE type = @type;`
                ).then(function () {
                        const sqlDeleteConsultationDetails = new sql.Connection(dbconfig, function () {
                        let request = new sql.Request(sqlDeleteConsultationDetails);
                        request.query(
                            `DELETE FROM Consultations
                            WHERE id NOT IN (${consultation.consultationDetails.filter(consultationDetails => consultationDetails.id).map(function(obj){return obj.id;}).join(',')})`
                        ).then(function () {
                                for (let prop in consultation.consultationDetails) {
                                    if (consultation.consultationDetails.hasOwnProperty(prop)) {
                                        if (consultation.consultationDetails[prop].id) {
                                             const sqlUpdateConsultationDetails = new sql.Connection(dbconfig, function () {
                                                let request = new sql.Request(sqlUpdateConsultationDetails);
                                                request.input('id', sql.Int, consultation.consultationDetails[prop].id);
                                                request.input('title', sql.VarChar, consultation.consultationDetails[prop].title);
                                                request.input('session_time', sql.VarChar, consultation.consultationDetails[prop].session_time);
                                                request.input('consultation', sql.VarChar, consultation.consultationDetails[prop].consultation);
                                                request.input('consultation_desc', sql.VarChar, consultation.consultationDetails[prop].consultation_desc);
                                                request.input('cost', sql.VarChar, tryParseCurrency(consultation.consultationDetails[prop].cost));
                                                request.query(
                                                    `UPDATE Consultations 
                                                    SET title = @title
                                                    , session_time = @session_time
                                                    , short = @consultation
                                                    , description = @consultation_desc
                                                    , cost = @cost
                                                    WHERE id = @id;`
                                                ).then(console.log("ConsultationDetails Updated")
                                                ).catch(function (err) {
                                                    console.log("update ConsultationDetails: " + err);
                                                });
                                            });
                                        } 
                                        else {
                                        const sqlInsertConsultationDetails = new sql.Connection(dbconfig, function () {
                                            let request = new sql.Request(sqlInsertConsultationDetails);
                                            request.input('type', sql.VarChar, 'diet');
                                            request.input('title', sql.VarChar, consultation.consultationDetails[prop].title);
                                            request.input('session_time', sql.VarChar, consultation.consultationDetails[prop].session_time);
                                            request.input('consultation', sql.VarChar, consultation.consultationDetails[prop].consultation);
                                            request.input('consultation_desc', sql.VarChar, consultation.consultationDetails[prop].consultation_desc);
                                            request.input('cost', sql.VarChar, tryParseCurrency(consultation.consultationDetails[prop].cost));
                                            request.query(
                                                `INSERT INTO Consultations (type, title, session_time, short, description, cost)
                                                VALUES (@type, @title, @session_time, @consultation, @consultation_desc, @cost);`
                                            ).then(console.log("ConsultationDetails Inserted")
                                            ).catch(function (err) {
                                                console.log("insert ConsultationDetails: " + err);
                                            });
                                        });
                                    }
                                }
                            }          
                        }).catch(function (err) {
                            console.log("ConsultationDetails delete" + err);
                        });
                    });
                }).catch(function (err) {
                        console.log("ConsultationDetails " + err);
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
                    JOIN Consultations C
                    ON H.type = C.type`
                ).then(function (recordset) {
                    let consultationDetails = [];
                    for (let consultationProp in recordset) {
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
