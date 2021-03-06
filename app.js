var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var api = require('./routes/api');
var passport = require('passport');
var session = require('express-session');
var authenticate = require('./routes/authentication')(passport);
var initPassport = require('./passport-init');
var app = express();

//database setup
var mongoose = require('./node_modules/mongoose');
mongoose.connect('mongodb://csc309:banana@ds047722.mongolab.com:47722/heroku_v51bxlrz');

// view engine setup
app.set('views', path.join(__dirname, '/public/views'));
app.set('view engine', 'ejs');

// Initialize passport
initPassport(passport);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret:process.env.SESSION_SECRET || 'garyK',
    resave: false,
    saveUninitialized: true,
    cookie: { 
      maxAge: null 
    }
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/api', api);
app.use('/auth', authenticate);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
