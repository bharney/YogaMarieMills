'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _secrets = require('../secrets');

var _secrets2 = _interopRequireDefault(_secrets);

var _jwtSimple = require('jwt-simple');

var _jwtSimple2 = _interopRequireDefault(_jwtSimple);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var upload = (0, _multer2.default)();

var uploadRoute = function uploadRoute() {

    var uploadRouter = _express2.default.Router();

    uploadRouter.post('/uploads', upload.single('file'), function (req, res) {
        if (!req.headers.authorization) {
            return res.status(401).send({ message: "You are not authorized" });
        }
        var authorization = JSON.parse(req.headers.authorization.slice(7));
        var payload = _jwtSimple2.default.decode(authorization.token, _secrets2.default);
        if (!payload.sub) {
            return res.status(401).send({ message: "You are not authorized" });
        }
        if ((0, _moment2.default)().unix() > payload.exp) {
            return res.status(401).send({ message: "You are not authorized" });
        }
        var file = __dirname + "/temp/" + req.file.originalname;
        var response = void 0;
        if (_path2.default.extname(req.file.originalname).toLowerCase() === '.png' || _path2.default.extname(req.file.originalname).toLowerCase() === '.jpg' || _path2.default.extname(req.file.originalname).toLowerCase() === '.gif') {

            _fs2.default.readFile(req.file.path, function (err, data) {
                _fs2.default.writeFile(file, data, function (err) {
                    if (err) {
                        console.error(err);
                        response = {
                            message: 'Sorry, file couldn\'t be uploaded.',
                            filename: req.file.originalname
                        };
                    } else {
                        response = {
                            message: 'File uploaded successfully',
                            filename: req.file.originalname
                        };
                        var targetPath = __dirname + "../../../src/images/" + req.file.originalname;
                        _fs2.default.rename(file, targetPath, function (err) {
                            if (err) {
                                console.log("error moving file to working path " + err);
                            } else {
                                console.log("Upload moved from temp to working path.");
                            }
                        });
                    }
                    console.log(JSON.stringify(response));
                    res.end(JSON.stringify(response));
                });
            });
        } else {
            _fs2.default.unlink(req.file.path, function () {
                console.log("Only .png, .jpg, and .gif files are allowed!");
            });
        }
    });

    return uploadRouter;
};

module.exports = uploadRoute;

exports.default = uploadRoute;