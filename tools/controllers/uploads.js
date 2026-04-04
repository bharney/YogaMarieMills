import express from 'express';
import path from 'path';
import multer from 'multer'
import secret from '../../secrets';
import jwt from 'jwt-simple';
import moment from 'moment';

const imageUploadPath = path.join(__dirname, '../../uploaded-images');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imageUploadPath);
    },
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname).toLowerCase();
        const baseName = path.basename(file.originalname, extension)
            .replace(/[^a-zA-Z0-9-_ ]/g, '')
            .trim()
            .replace(/\s+/g, '-');
        cb(null, `${Date.now()}-${baseName}${extension}`);
    }
});

const fileFilter = function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
        cb(null, true);
        return;
    }

    cb(new Error('Only .png, .jpg, .jpeg, and .gif files are allowed'));
};

let upload = multer({ storage: storage, fileFilter: fileFilter });

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
        const response = {
            message: 'File uploaded successfully',
            filename: req.file.filename,
            originalFilename: req.file.originalname,
            url: '/images/' + encodeURIComponent(req.file.filename)
        };

        res.json(response);
    })

    return uploadRouter;
};

module.exports = uploadRoute;

export default uploadRoute;



