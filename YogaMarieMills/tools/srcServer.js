import express from 'express';
import webpack from 'webpack';
import path from 'path';
import config from '../webpack.config.dev';
import open from 'open';
import bodyParser from 'body-parser';

/* eslint-disable no-console */

const port = 3000;
const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(bodyParser.urlencoded({ express: true }));
app.use(bodyParser.json());

import blogRouter from './controllers/blogs';
import consultationRouter from './controllers/consultations';
import classTypeRouter from './controllers/classTypes';
import costRouter from './controllers/costs';
import eventRouter from './controllers/events';
import massageTypeRouter from './controllers/massageTypes';
import scheduleRouter from './controllers/schedules';
import testimonialRouter from './controllers/testimonials';
import navbarRouter from './controllers/navbars';
import uploadRouter from './controllers/uploads';
import usersRouter from './controllers/users';
import loginRouter from './controllers/login';

app.use('/api', blogRouter(),
    consultationRouter(),
    classTypeRouter(),
    costRouter(),
    eventRouter(),
    massageTypeRouter(),
    scheduleRouter(),
    testimonialRouter(),
    navbarRouter(),
    uploadRouter(),
    usersRouter(),
    loginRouter());

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../src/index.html'));
});
 
app.listen(port, function (err) {
    if (err) {
        console.log(err);
    } else {
        open(`http://localhost:${port}`);
    }
});
