import express from 'express';
import sql from 'mssql';
import secret from '../../secrets';
import jwt from 'jwt-simple';
import bcrypt from 'bcrypt-nodejs';
import moment from 'moment';

let loginRoutes = function () {

    const loginRouter = express.Router();
    const dbconfig = "mssql://Application:!Testing123@BPHSERVER/YogaMarieMills";

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
            const sqlAuthorize = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlAuthorize);
                request.input('emailAddress', sql.VarChar, user.emailAddress);
                request.query(`SELECT top 1 id
                                ,emailAddress
                                ,password
                                ,firstName
                                ,lastName
                                FROM Users
                                WHERE emailAddress = @emailAddress`
                ).then(function (recordset) {
                    if (recordset[0].emailAddress) {

                        bcrypt.compare(user.password, recordset[0].password, function (err, isMatch) {
                            if (err) return;

                            if (!isMatch) {
                                res.send(401, { message: "Email Address or Password is incorrect."})
                            } else {
                                createToken(recordset[0], res, req)
                            }
                        });
                    }
                    else {
                        res.send(401, { message: "Email Address or Password is incorrect."});
                    }
                }).catch(function (err) {
                    console.log("login: " + err);
                });
            });
        });

    return loginRouter;
};

module.exports = loginRoutes;

export default loginRoutes;
