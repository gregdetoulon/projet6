var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
var logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var witRouter = require('./routes/wits');

var app = express();

// connect mongo DB
mongoose.connect('mongodb+srv://root:Levens06670@cluster0.umk4k.mongodb.net/projet6?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB reussie !'))
  .catch((err) => console.log(err));
mongoose.set('useCreateIndex', true);

app.use(session({
  secret: 'INCODE',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection })
}));




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/wits', witRouter);

// catch 404 and forward to error handler
//app.use(function(req, res, next) {
 // next(createError(404));
//});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
