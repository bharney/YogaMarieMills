import express from 'express';
import webpack from 'webpack';
import path from 'path';
import config from '../webpack.config.dev';
import open from 'open';
import bodyParser from 'body-parser';
import { bootstrapKeyVaultSecrets } from './keyVaultBootstrap';
import { ensureSqlConnection } from './sqlQuery';

/* eslint-disable no-console */

const port = Number(process.env.PORT) || 3000;
const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));
app.use('/images', express.static(path.join(__dirname, '../uploaded-images')));
app.use('/images', express.static(path.join(__dirname, '../src/images')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

async function startServer() {
    await bootstrapKeyVaultSecrets();
    await ensureSqlConnection();

    const getRouterFactory = (modulePath) => {
        const mod = require(modulePath);
        return mod.default || mod;
    };

    const blogRouter = getRouterFactory('./controllers/blogs');
    const consultationRouter = getRouterFactory('./controllers/consultations');
    const classTypeRouter = getRouterFactory('./controllers/classTypes');
    const costRouter = getRouterFactory('./controllers/costs');
    const eventRouter = getRouterFactory('./controllers/events');
    const massageTypeRouter = getRouterFactory('./controllers/massageTypes');
    const scheduleRouter = getRouterFactory('./controllers/schedules');
    const testimonialRouter = getRouterFactory('./controllers/testimonials');
    const navbarRouter = getRouterFactory('./controllers/navbars');
    const uploadRouter = getRouterFactory('./controllers/uploads');
    const usersRouter = getRouterFactory('./controllers/users');
    const loginRouter = getRouterFactory('./controllers/login');

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

    const server = app.listen(port, function () {
        open(`http://localhost:${port}`);
    });

    server.on('error', function (err) {
        if (err.code === 'EADDRINUSE') {
            console.error(`Port ${port} is already in use. Stop the existing app process or set PORT to a different value.`);
            process.exit(1);
        }

        console.error(err);
        process.exit(1);
    });
}

startServer().catch(function (err) {
    console.error('Server startup failed:', err.message || err);
    process.exit(1);
});
