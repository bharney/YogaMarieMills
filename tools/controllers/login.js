import express from 'express';
import { secret } from '../../secrets';
import jwt from 'jwt-simple';
import bcrypt from 'bcrypt-nodejs';
import moment from 'moment';
import { executeQuery } from '../sqlQuery';

let loginRoutes = function () {

    const loginRouter = express.Router();

    function createToken(user, res, req) {
        delete user.password;
        const payload = {
            iss: req.hostname,
            sub: user.emailAddress,
            exp: moment().add(15, 'days').unix()
        }
        const token = jwt.encode(payload, secret);
        res.status(200).send({
            user: user,
            token: token
        });
    }

    loginRouter.route('/login')
        .post(function (req, res) {
            let user = (req.body);
            executeQuery(
                `SELECT top 1 id
                                ,emailAddress
                                ,password
                                ,firstName
                                ,lastName
                                FROM Users
                                WHERE emailAddress = @emailAddress`,
                function (request, sql) {
                    request.input('emailAddress', sql.VarChar, user.emailAddress);
                }
            ).then(function (recordset) {
                    if (!recordset || recordset.length === 0 || !recordset[0].emailAddress) {
                        return res.send(401, { message: "Email Address is incorrect." });
                    }

                    console.log("password: " + user.password)
                    bcrypt.compare(user.password, recordset[0].password, function (err, isMatch) {
                        if (err) return;

                        if (!isMatch) {
                            res.send(401, { message: "Password is incorrect." })
                        } else {
                            createToken(recordset[0], res, req)
                        }
                    });
                }).catch(function (err) {
                    console.log("login: " + err);
                    res.status(500).send("Unable to process login.");
                });
        });

    return loginRouter;
};

module.exports = loginRoutes;

export default loginRoutes;
