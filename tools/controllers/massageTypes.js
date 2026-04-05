import express from 'express';
import {secret} from '../../secrets';
import jwt from 'jwt-simple';
import moment from 'moment';
import { executeQuery } from '../sqlQuery';

let massageTypeRoutes = function () {

    const massageTypeRouter = express.Router();

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
            executeQuery(
                `INSERT INTO MassageTypes (type, title, session_time, description, cost)
                 VALUES (@type, @title, @session_time, @description, @cost);
                 SELECT SCOPE_IDENTITY() AS parent_id;`,
                function (request, sql) {
                    request.input('type', sql.VarChar, massageType.type);
                    request.input('title', sql.VarChar, massageType.title);
                    request.input('session_time', sql.VarChar, massageType.session_time);
                    request.input('description', sql.VarChar, massageType.description);
                    request.input('cost', sql.VarChar, tryParseCurrency(massageType.cost));
                }
            ).then(function (recordset) {
                if (!recordset || recordset.length === 0) {
                    return res.status(500).send('Unable to create massage type parent row.');
                }
                const newId = recordset[0].parent_id;
                const detailPromises = Object.keys(massageType.massage_details || {}).map(function (prop) {
                    const detail = massageType.massage_details[prop];
                    return executeQuery(
                        `INSERT INTO MassageDetails (type, title, description, parent_id)
                         VALUES (@type, @title, @description, @parent_id);`,
                        function (request, sql) {
                            request.input('parent_id', sql.Int, newId);
                            request.input('type', sql.VarChar, 'MassageDetail');
                            request.input('title', sql.VarChar, detail.title);
                            request.input('description', sql.VarChar, detail.description);
                        }
                    );
                });
                return Promise.all(detailPromises).then(function () {
                    res.status(201).json(Object.assign({}, massageType, { id: newId }));
                });
            }).catch(function (err) {
                console.log("massageType: " + err);
                res.status(500).send("Unable to save massage type.");
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
            executeQuery(
                `UPDATE MassageTypes
                    SET type = @type
                    ,title = @title
                    , session_time = @session_time
                    , description = @description
                    , cost = @cost
                    WHERE id = @id;`,
                function (request, sql) {
                    request.input('id', sql.Int, massageType.id);
                    request.input('type', sql.VarChar, massageType.type);
                    request.input('title', sql.VarChar, massageType.title);
                    request.input('session_time', sql.VarChar, massageType.session_time);
                    request.input('description', sql.VarChar, massageType.description);
                    request.input('cost', sql.VarChar, tryParseCurrency(massageType.cost));
                }
            ).then(function () {
                const existingIds = (massageType.massage_details || [])
                    .filter(function (d) { return d.id; })
                    .map(function (d) { return d.id; });
                const deleteDetailQuery = existingIds.length > 0
                    ? `DELETE FROM MassageDetails WHERE id NOT IN (${existingIds.join(',')}) AND parent_id = ${massageType.id}`
                    : `DELETE FROM MassageDetails WHERE parent_id = ${massageType.id}`;
                return executeQuery(deleteDetailQuery);
            }).then(function () {
                const savePromises = (massageType.massage_details || []).map(function (detail) {
                    if (detail.id) {
                        return executeQuery(
                            `UPDATE MassageDetails
                                SET type = @type
                                ,title = @title
                                , description = @description
                                , parent_id = @parent_id
                                WHERE id = @id;`,
                            function (request, sql) {
                                request.input('id', sql.Int, detail.id);
                                request.input('parent_id', sql.Int, massageType.id);
                                request.input('type', sql.VarChar, 'MassageDetail');
                                request.input('title', sql.VarChar, detail.title);
                                request.input('description', sql.VarChar, detail.description);
                            }
                        );
                    }
                    return executeQuery(
                        `INSERT INTO MassageDetails (type, title, description, parent_id)
                        VALUES (@type, @title, @description, @parent_id);`,
                        function (request, sql) {
                            request.input('parent_id', sql.Int, massageType.id);
                            request.input('type', sql.VarChar, 'MassageDetail');
                            request.input('title', sql.VarChar, detail.title);
                            request.input('description', sql.VarChar, detail.description);
                        }
                    );
                });
                return Promise.all(savePromises);
            }).then(function () {
                res.status(201).json(massageType);
            }).catch(function (err) {
                console.log("MassageType " + err);
                res.status(500).send("Unable to update massage type.");
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
                `DELETE FROM MassageTypes
                 WHERE id = @id`,
                function (request, sql) {
                    request.input('id', sql.Int, req.body.id);
                }
            ).then(function () {
                res.status(201).send("MassageType has been deleted.");
            }).catch(function (err) {
                console.log("delete MassageType: " + err);
                res.status(500).send("Unable to delete massage type.");
            });
        })
        .get(function (req, res) {
            executeQuery(
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
                    res.status(500).send("Unable to load massage types.");
                });
        });

    massageTypeRouter.route('/massages/:massageTypeId')
        .get(function (req, res) {
            executeQuery(`SELECT id
                                ,type
                                ,venue
                                ,header
                                ,description
                                ,session_time
                                ,title
                                ,details
                                ,cost
                                FROM MassageTypes
                                WHERE id = @id`,
                function (request, sql) {
                    request.input('id', sql.Int, req.params.massageTypeId);
                }
            ).then(function (recordset) {
                    if (recordset.length > 0) {
                        res.json(recordset);
                    }
                    else {
                        res.status(500).send("No MassageType found with this ID.");
                    }
                }).catch(function (err) {
                    console.log("MassageType: " + err);
                    res.status(500).send("Unable to load massage type.");
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
                `DELETE FROM MassageTypes
                 WHERE id = @id`,
                function (request, sql) {
                    request.input('id', sql.Int, req.params.massageTypeId);
                }
            ).then(function () {
                res.status(201).send("MassageType has been deleted.");
            }).catch(function (err) {
                console.log("delete MassageType: " + err);
                res.status(500).send("Unable to delete massage type.");
            });
        });

    return massageTypeRouter;
};

module.exports = massageTypeRoutes;

export default massageTypeRoutes;
