import express from 'express';
import sql from 'mssql';
import secret from '../../secrets';
import jwt from 'jwt-simple';
import moment from 'moment';

let massageTypeRoutes = function () {

    const massageTypeRouter = express.Router();
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

    massageTypeRouter.route('/massages')
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
            let massageType = (req.body);
            const sqlInsertMassageType = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlInsertMassageType);
                request.input('type', sql.VarChar, massageType.type);
                request.input('title', sql.VarChar, massageType.title);
                request.input('session_time', sql.VarChar, massageType.session_time);
                request.input('description', sql.VarChar, massageType.description);
                request.input('cost', sql.VarChar, tryParseCurrency(massageType.cost));
                request.query(
                    `INSERT INTO MassageTypes (type, title, session_time, description, cost)
                     VALUES (@type, @title, @session_time, @description, @cost); 
                     SELECT SCOPE_IDENTITY() AS parent_id;`
                ).then(function (recordset) {
                    for (let prop in massageType.massage_details) {
                        if (massageType.massage_details.hasOwnProperty(prop)) {
                            const sqlInsertMassageDetails = new sql.Connection(dbconfig, function () {
                                let request = new sql.Request(sqlInsertMassageDetails);
                                request.input('parent_id', sql.Int, recordset[0].parent_id);
                                request.input('type', sql.VarChar, 'MassageDetail');
                                request.input('title', sql.VarChar, massageType.massage_details[prop].title);
                                request.input('description', sql.VarChar, massageType.massage_details[prop].description);
                                request.query(
                                    `INSERT INTO MassageDetails (type, title, description, parent_id)
                                     VALUES (@type, @title, @description, @parent_id);`
                                ).then(
                                    console.log(massageType.massage_details[prop])
                                    ).catch(function (err) {
                                        console.log("massageDetails: " + err);
                                    });
                            });
                        }
                    }
                }).catch(function (err) {
                    console.log("massageType: " + err);
                });
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
            let massageType = (req.body);
            const sqlUpdateMassageType = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlUpdateMassageType);
                request.input('id', sql.Int, massageType.id);
                request.input('type', sql.VarChar, massageType.type);
                request.input('title', sql.VarChar, massageType.title);
                request.input('session_time', sql.VarChar, massageType.session_time);
                request.input('description', sql.VarChar, massageType.description);
                request.input('cost', sql.VarChar, tryParseCurrency(massageType.cost));
                request.query(
                    `UPDATE MassageTypes 
                        SET type = @type
                        ,title = @title
                        , session_time = @session_time
                        , description = @description
                        , cost = @cost
                        WHERE id = @id;`
                ).then(function () {
                        const sqlDeleteMassageDetails = new sql.Connection(dbconfig, function () {
                        let request = new sql.Request(sqlDeleteMassageDetails);
                        request.input('parent_id', sql.Int, massageType.id);
                        request.query(
                            `DELETE FROM MassageDetails
                            WHERE id NOT IN (${massageType.massage_details.filter(massage_details => massage_details.id).map(function(obj){return obj.id;}).join(',')})
                            AND parent_id = @parent_id;`
                        ).then(function () {
                                for (let prop in massageType.massage_details) {
                                    if (massageType.massage_details.hasOwnProperty(prop)) {
                                        if (massageType.massage_details[prop].id) {
                                           const sqlUpdateMassageDetails = new sql.Connection(dbconfig, function () {
                                                let request = new sql.Request(sqlUpdateMassageDetails);
                                                request.input('id', sql.Int, massageType.massage_details[prop].id);
                                                request.input('parent_id', sql.Int, massageType.id);
                                                request.input('type', sql.VarChar, 'MassageDetail');
                                                request.input('title', sql.VarChar, massageType.massage_details[prop].title);
                                                request.input('description', sql.VarChar, massageType.massage_details[prop].description);
                                                request.query(
                                                    `UPDATE MassageDetails 
                                                        SET type = @type
                                                        ,title = @title
                                                        , description = @description
                                                        , parent_id = @parent_id
                                                        WHERE id = @id;`
                                                ).then(console.log("MassageDetails Updated")
                                                ).catch(function (err) {
                                                    console.log("update MassageDetails: " + err);
                                                });
                                            });
                                        } 
                                        else {
                                        const sqlInsertMassageDetails = new sql.Connection(dbconfig, function () {
                                            let request = new sql.Request(sqlInsertMassageDetails);
                                            request.input('parent_id', sql.Int, massageType.id);
                                            request.input('type', sql.VarChar, 'MassageDetail');
                                            request.input('title', sql.VarChar, massageType.massage_details[prop].title);
                                            request.input('description', sql.VarChar, massageType.massage_details[prop].description);
                                            request.query(
                                                `INSERT INTO MassageDetails (type, title, description, parent_id)
                                                VALUES (@type, @title, @description, @parent_id);`
                                            ).then(console.log("MassageDetails Inserted")
                                            ).catch(function (err) {
                                                console.log("insert MassageDetails: " + err);
                                            });
                                        });
                                    }
                                }
                            }          
                        }).catch(function (err) {
                            console.log("MassageDetails delete" + err);
                        });
                    });
                }).catch(function (err) {
                        console.log("MassageType " + err);
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
            const sqlDeleteMassageType = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlDeleteMassageType);
                request.input('id', sql.Int, req.body.id);
                request.query(
                    `DELETE FROM MassageTypes
                     WHERE id = @id`
                ).then(res.status(201).send("MassageType has been deleted.")).catch(function (err) {
                    console.log("delete MassageType: " + err);
                });
            });
        })
        .get(function (req, res) {
            const sqlMassageTypes = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlMassageTypes);
                request.query(
                    `SELECT H.id AS id
                    ,H.type AS type
                    ,H.venue AS venue
                    ,H.header AS header
                    ,H.description AS description
                    ,NULL AS session_time
                    ,NULL AS title
                    ,NULL AS parent_id
                    ,NULL AS cost
                    ,NULL AS icon
                    ,NULL AS iconHeight
                    ,NULL AS iconWidth
                    FROM Headers H
                    WHERE H.type IN (SELECT M.type FROM MassageTypes M)

                    UNION ALL

                    SELECT M.id AS id
                    ,M.type AS type
                    ,NULL AS venue
                    ,NULL AS header
                    ,NULL AS description
                    ,M.session_time AS session_time
                    ,M.title AS title
                    ,NULL AS parent_id
                    ,CASE WHEN ISNUMERIC(M.cost) = 1 
                                 THEN FORMAT(TRY_PARSE(M.cost AS money), 'C', 'de-de') 
                                 ELSE M.cost END AS cost
                    ,M.icon AS icon
                    ,M.iconHeight AS iconHeight
                    ,M.iconWidth AS iconWidth
                    FROM MassageTypes M

                    UNION ALL

                    SELECT D.id AS id
                    ,D.type AS type
                    ,NULL as venue
                    ,NULL as header
                    ,D.description as description
                    ,NULL as session_time
                    ,D.title AS title
                    ,D.parent_id AS parent_id
                    ,NULL AS cost
                    ,NULL AS icon
                    ,NULL as iconHeight
                    ,NULL AS iconWidth
                    FROM MassageDetails D`
                ).then(function (recordset) {
                    let massagePage = [];
                    let counter = 0;
                    for (let header_prop in recordset) {
                        if (recordset.hasOwnProperty(header_prop)) {
                            if (recordset[header_prop].header != null) {
                                let massage_header = {
                                    id: recordset[header_prop].id,
                                    header: recordset[header_prop].header,
                                    venue: recordset[header_prop].venue,
                                    description: recordset[header_prop].description,
                                    type: recordset[header_prop].type,
                                    massages: []
                                };
                                massagePage.push(massage_header);
                                let counter_detail = 0;
                                for (let massage_prop in recordset) {
                                    if (recordset.hasOwnProperty(massage_prop)) {
                                        if (recordset[massage_prop].session_time != null) {
                                            if (recordset[header_prop].type == recordset[massage_prop].type) {
                                                let massages = {
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
                                                for (let detail_prop in recordset) {
                                                    if (recordset.hasOwnProperty(detail_prop)) {
                                                        if (recordset[detail_prop].parent_id != null) {
                                                            if (recordset[massage_prop].id == recordset[detail_prop].parent_id) {
                                                                let massage_details = {
                                                                    id: recordset[detail_prop].id,
                                                                    title: recordset[detail_prop].title,
                                                                    description: recordset[detail_prop].description,
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

    massageTypeRouter.route('/massages/:massageTypeId')
        .get(function (req, res) {
            const sqlMassageType = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlMassageType);
                request.input('id', sql.Int, req.params.massageTypeId);
                request.query(`SELECT id
                                ,type
                                ,venue
                                ,header
                                ,description
                                ,session_time
                                ,title
                                ,details
                                ,cost
                                FROM MassageTypes
                                WHERE id = @id`
                ).then(function (recordset) {
                    if (recordset.length > 0) {
                        res.json(recordset);
                    }
                    else {
                        res.status(500).send("No MassageType found with this ID.");
                    }
                }).catch(function (err) {
                    console.log("MassageType: " + err);
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
            const sqlDeleteMassageType = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlDeleteMassageType);
                request.input('id', sql.Int, req.params.massageTypeId);
                request.query(
                    `DELETE FROM MassageTypes
                     WHERE id = @id`
                ).then(res.status(201).send("MassageType has been deleted.")).catch(function (err) {
                    console.log("delete MassageType: " + err);
                });
            });
        });

    return massageTypeRouter;
};

module.exports = massageTypeRoutes;

export default massageTypeRoutes;
