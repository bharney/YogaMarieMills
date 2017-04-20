var express = require('express');
var path = require('path');
var compression = require('compression');
var bodyParser = require('body-parser');

/*eslint-disable no-console */

var port = process.env.port || 80;
var app = express();

app.use(compression());
app.use(express.static(path.join(__dirname, 'app')));

app.use(bodyParser.urlencoded({ express: true }));
app.use(bodyParser.json());

var blogRouter = require('./controllers/blogs');
var consultationRouter = require('./controllers/consultations');
var classTypeRouter = require('./controllers/classTypes');
var costRouter = require('./controllers/costs');
var eventRouter = require('./controllers/events');
var massageTypeRouter = require('./controllers/massageTypes');
var scheduleRouter = require('./controllers/schedules');
var testimonialRouter = require('./controllers/testimonials');
var navbarRouter = require('./controllers/navbars');
var uploadRouter = require('./controllers/uploads');
var usersRouter = require('./controllers/users');
var loginRouter = require('./controllers/login');

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

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'app/index.html'));
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`server started port: ${port}`);
  }
});