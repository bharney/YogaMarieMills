import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import { secret } from '../../secrets';
import jwt from 'jwt-simple';
import moment from 'moment';
import { executeQuery } from '../sqlQuery';

let userRoutes = function () {

    const userRouter = express.Router();

    function encryptPassword(password) {
        console.log("password: " + password);

    }

    userRouter.route('/users')
        .post(function (req, res) {
            // if (!req.headers.authorization) {
            //     return res.status(401).send({ message: "You are not authorized" })
            // }
            // const authorization = JSON.parse(req.headers.authorization.slice(7));
            // const payload = jwt.decode(authorization.token, secret);
            // if (!payload.sub) {
            //     return res.status(401).send({ message: "You are not authorized" })
            // }
            // if (moment().unix() > payload.exp) {
            //     return res.status(401).send({ message: "You are not authorized" })
            // }
            let user = (req.body);
            bcrypt.hash(user.password, null, null, function (err, hash) {
                if (err) {
                    console.log("bcrypt error: " + err);
                    return res.status(500).send({ message: "Error creating user" });
                }
                executeQuery(
                    `INSERT INTO Users (emailAddress, firstName, lastName, password, createdDate)
                     VALUES (@emailAddress, @firstName, @lastName, @password, GETDATE());`,
                    function (request, sql) {
                        request.input('emailAddress', sql.VarChar, user.emailAddress);
                        request.input('firstName', sql.VarChar, user.firstName);
                        request.input('lastName', sql.VarChar, user.lastName);
                        request.input('password', sql.VarChar, hash);
                    }
                ).then(function () {
                    delete user.password;
                    res.status(201).send(user);
                }).catch(function (err) {
                    console.log("users: " + err);
                    res.status(500).send("Unable to create user.");
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
            executeQuery(
                `UPDATE Users
                SET emailAddress = @emailAddress
                ,firstName = @firstName
                ,lastName = @lastName
                ,password = @password
                ,changedDate = GETDATE()
                WHERE id = @id`,
                function (request, sql) {
                    request.input('id', sql.Int, user.id);
                    request.input('emailAddress', sql.VarChar, user.emailAddress);
                    request.input('firstName', sql.VarChar, user.firstName);
                    request.input('lastName', sql.VarChar, user.LastName);
                    request.input('password', sql.VarChar, encryptPassword(user.password));
                }
            ).then(function () {
                delete user.password;
                res.status(201).send(user);
            }).catch(function (err) {
                console.log("update user: " + err);
                res.status(500).send("Unable to update user.");
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
                `DELETE FROM Users
                 WHERE id = @id`,
                function (request, sql) {
                    request.input('id', sql.Int, req.body.id);
                }
            ).then(function () {
                res.status(201).send("Login has been deleted.");
            }).catch(function (err) {
                console.log("delete user: " + err);
                res.status(500).send("Unable to delete user.");
            });
        })
        .get(function (req, res) {
            executeQuery(
                `SELECT id
                            ,emailAddress
                            ,firstName
                            ,lastName
                            ,'**********' AS password
                            FROM Users
                            ORDER BY id`
            ).then(function (recordset) {
                res.json(recordset);
            }).catch(function (err) {
                console.log("Users: " + err);
                res.status(500).send("Unable to load users.");
            });
        });

    return userRouter;
};

module.exports = userRoutes;

export default userRoutes;
