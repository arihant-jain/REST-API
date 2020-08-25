var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var indexRouter = require('./api/index');
var cafeRouter = require('./api/cafe');
var cupRouter = require('./api/cup');
var binRouter = require('./api/bin');
var saleRouter = require('./api/sale');
var returnRouter = require('./api/return');
var dishwasherRouter = require('./api/dishwasher');
var returnRate = require('./api/returnRate');
var analysisRouter = require('./api/analysis');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/api/cafe', cafeRouter);
app.use('/api/cup', cupRouter);
app.use('/api/bin', binRouter);
app.use('/api/sale', saleRouter);
app.use('/api/return', returnRouter);
app.use('/api/dishwasher', dishwasherRouter);
app.use('/api/returnrate', returnRate);
app.use('/api/analysis', analysisRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
