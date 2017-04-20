import express from 'express';
import sql from 'mssql';
import secret from '../../secrets';
import jwt from 'jwt-simple';
import moment from 'moment';

let costRoutes = function () {

    const costRouter = express.Router();
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

    costRouter.route('/costs')
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
            let cost = (req.body);
            const sqlInsertCost = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlInsertCost);
                request.input('type', sql.VarChar, cost.type);
                request.input('course', sql.VarChar, cost.course);
                request.input('cost', sql.VarChar, tryParseCurrency(cost.cost));
                request.input('duration', sql.VarChar, cost.duration);
                request.input('description', sql.VarChar, cost.description);
                request.input('package', sql.VarChar, cost.package);
                request.input('sequence', sql.Int, cost.sequence);
                request.query(
                    `INSERT INTO Costs (type, course, cost, duration, description, package, sequence)
                     VALUES (@type, @course, @cost, @duration, @description, @package, @sequence)`
                ).then(res.status(201).send(cost)).catch(function (err) {
                    console.log("insert Costs: " + err);
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
            let cost = (req.body);
            const sqlUpdateCost = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlUpdateCost);
                request.input('id', sql.Int, cost.id);
                request.input('type', sql.VarChar, cost.type);
                request.input('course', sql.VarChar, cost.course);
                request.input('cost', sql.VarChar, tryParseCurrency(cost.cost));
                request.input('duration', sql.VarChar, cost.duration);
                request.input('description', sql.VarChar, cost.description);
                request.input('package', sql.VarChar, cost.package);
                request.input('sequence', sql.Int, cost.sequence);
                request.query(
                    `UPDATE Costs
                    SET type = @type
                    ,course = @course
                    ,cost = @cost
                    ,duration = @duration
                    ,description = @description
                    ,package = @package
                    ,sequence = @sequence
                    WHERE id = @id`
                ).then(res.status(201).send(cost)).catch(function (err) {
                    console.log("update Costs: " + err);
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
            const sqlDeleteCost = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlDeleteCost);
                request.input('id', sql.Int, req.body.id);
                request.query(
                    `DELETE FROM Costs
                     WHERE id = @id`
                ).then(res.status(201).send("Cost has been deleted.")).catch(function (err) {
                    console.log("delete cost: " + err);
                });
            });
        })
        .get(function (req, res) {
            const sqlCosts = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlCosts);
                request.query(`SELECT id
                                ,type
                                ,course
                                ,CASE WHEN ISNUMERIC(cost) = 1 
                                 THEN FORMAT(TRY_PARSE(cost AS money), 'C', 'de-de') 
                                 ELSE cost END AS cost
                                ,duration
                                ,description
                                ,package 
                                ,sequence
                                FROM Costs
                                ORDER BY sequence`
                ).then(function (recordset) {
                    res.json(recordset);
                }).catch(function (err) {
                    console.log("costs: " + err);
                });
            });
        });

    costRouter.route('/costs/:costId')
        .get(function (req, res) {
            const sqlCost = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlCost);
                request.input('id', sql.Int, req.params.costId);
                request.query(`SELECT id
                                ,type
                                ,course
                                ,CASE WHEN ISNUMERIC(cost) = 1 
                                 THEN FORMAT(TRY_PARSE(cost AS money), 'C', 'de-de') 
                                 ELSE cost END AS cost 
                                ,duration
                                ,description
                                ,package 
                                ,sequence
                                FROM Costs
                                WHERE id = @id`
                ).then(function (recordset) {
                    if (recordset.length > 0) {
                        res.json(recordset);
                    }
                    else {
                        res.status(500).send("No Cost found with this ID.");
                    }
                }).catch(function (err) {
                    console.log("Cost: " + err);
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
            const sqlDeleteCost = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlDeleteCost);
                request.input('id', sql.Int, req.params.costId);
                request.query(
                    `DELETE FROM Costs
                     WHERE id = @id`
                ).then(res.status(201).send("Cost has been deleted.")).catch(function (err) {
                    console.log("delete Costs: " + err);
                });
            });
        });

    return costRouter;
};

module.exports = costRoutes;

export default costRoutes;
