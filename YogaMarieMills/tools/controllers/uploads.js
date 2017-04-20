import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer'
import secret from '../../secrets';
import jwt from 'jwt-simple';
import moment from 'moment';

let upload = multer({ dest: '/temp/' });

let uploadRoute = function () {

    const uploadRouter = express.Router();

    uploadRouter.post('/uploads', upload.single('file'), function (req, res) {
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
        let file = __dirname + "/temp/" + req.file.originalname;
        let response;
        if (path.extname(req.file.originalname).toLowerCase() === '.png' ||
            path.extname(req.file.originalname).toLowerCase() === '.jpg' ||
            path.extname(req.file.originalname).toLowerCase() === '.gif') {

            fs.readFile(req.file.path, function (err, data) {
                fs.writeFile(file, data, function (err) {
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
                        const targetPath = __dirname + "../../../src/images/" + req.file.originalname
                        fs.rename(file, targetPath, function (err) {
                            if (err) {
                                console.log("error moving file to working path " + err);
                            }
                            else {
                                console.log("Upload moved from temp to working path.");
                            }
                        });
                    }
                    console.log(JSON.stringify(response));
                    res.end(JSON.stringify(response));
                });
            });
        } else {
            fs.unlink(req.file.path, function () {
                console.log("Only .png, .jpg, and .gif files are allowed!");
            });
        }
    })

    return uploadRouter;
};

module.exports = uploadRoute;

export default uploadRoute;



