import express from 'express';
import sql from 'mssql';
import bcrypt from 'bcrypt-nodejs';
import secret from '../../secrets';
import jwt from 'jwt-simple';
import moment from 'moment';

let userRoutes = function () {

    const userRouter = express.Router();
    const dbconfig = "mssql://Application:!Testing123@BPHSERVER/YogaMarieMills";

    function encryptPassword(password) {
        console.log("password: " + password);

    }

    userRouter.route('/users')
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
            let user = (req.body);
            console.log("user: " + user.password);
            let password;

            bcrypt.hash(user.password, null, null, function (err, hash) {
                if (err) return;
                console.log("hash: " + hash);
                password = hash;
            });
            console.log("user.password: " + password);
            const sqlInsertLogin = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlInsertLogin);
                request.input('emailAddress', sql.VarChar, user.emailAddress);
                request.input('firstName', sql.VarChar, user.firstName);
                request.input('lastName', sql.VarChar, user.LastName);

                request.input('password', sql.VarChar, password);
                request.query(
                    `INSERT INTO Users (emailAddress, firstName, lastName, password, createdDate)
                     VALUES (@emailAddress, @firstName, @lastName, @password, GETDATE());`
                ).then(function () {
                    delete user.password;
                    res.status(201).send(user);
                }).catch(function (err) {
                    console.log("users: " + err);
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
            let user = (req.body);
            const sqlUpdateLogin = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlUpdateLogin);
                request.input('id', sql.Int, user.id);
                request.input('emailAddress', sql.VarChar, user.emailAddress);
                request.input('firstName', sql.VarChar, user.firstName);
                request.input('lastName', sql.VarChar, user.LastName);
                request.input('password', sql.VarChar, encryptPassword(user.password));
                request.query(
                    `UPDATE Users
                    SET emailAddress = @emailAddress
                    ,firstName = @firstName
                    ,lastName = @lastName
                    ,password = @password
                    ,changedDate = GETDATE()
                    WHERE id = @id`
                ).then(function () {
                    delete user.password;
                    res.status(201).send(user);
                }).catch(function (err) {
                    console.log("update user: " + err);
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
            const sqlDeleteLogin = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlDeleteLogin);
                request.input('id', sql.Int, req.body.id);
                request.query(
                    `DELETE FROM Users
                     WHERE id = @id`
                ).then(res.status(201).send("Login has been deleted.")).catch(function (err) {
                    console.log("delete user: " + err);
                });
            });
        })
        .get(function (req, res) {
            const sqlLogins = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlLogins);
                request.query(`SELECT id
                            ,emailAddress
                            ,firstName
                            ,lastName
                            ,'**********' AS password
                            ,createdDate
                            ,changedDate
                            FROM Users
                            ORDER BY id`
                ).then(function (recordset) {
                    res.json(recordset);
                }).catch(function (err) {
                    console.log("Users: " + err);
                });
            });
        });

    return userRouter;
};

module.exports = userRoutes;

export default userRoutes;
