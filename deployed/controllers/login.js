'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mssql = require('mssql');

var _mssql2 = _interopRequireDefault(_mssql);

var _secrets = require('../secrets');

var _secrets2 = _interopRequireDefault(_secrets);

var _jwtSimple = require('jwt-simple');

var _jwtSimple2 = _interopRequireDefault(_jwtSimple);

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loginRoutes = function loginRoutes() {

    var loginRouter = _express2.default.Router();
    var dbconfig = "mssql://yogamariemills:!Testing123@yogamariemills.database.windows.net/YogaMarieMills?encrypt=true";

    function createToken(user, res, req) {
        delete user.password;
        var payload = {
            iss: req.hostname,
            sub: user.emailAddress,
            exp: (0, _moment2.default)().add(15, 'days').unix()
        };
        var token = _jwtSimple2.default.encode(payload, _secrets2.default);
        res.status(200).send({
            user: user,
            token: token
        });
    }

    loginRouter.route('/login').post(function (req, res) {
        var user = req.body;
        var sqlAuthorize = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlAuthorize);
            request.input('emailAddress', _mssql2.default.VarChar, user.emailAddress);
            request.query('SELECT top 1 id\n                                ,emailAddress\n                                ,password\n                                ,firstName\n                                ,lastName\n                                FROM Users\n                                WHERE emailAddress = @emailAddress').then(function (recordset) {
                if (recordset[0].emailAddress) {

                    _bcryptNodejs2.default.compare(user.password, recordset[0].password, function (err, isMatch) {
                        if (err) return;

                        if (!isMatch) {
                            res.send(401, { message: "Email Address or Password is incorrect." });
                        } else {
                            createToken(recordset[0], res, req);
                        }
                    });
                } else {
                    res.send(401, { message: "Email Address or Password is incorrect." });
                }
            }).catch(function (err) {
                console.log("login: " + err);
            });
        });
    });

    return loginRouter;
};

module.exports = loginRoutes;

exports.default = loginRoutes;