var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
// var adminRouter = require('./routes/admin');
// var userRouter = require('./routes/user');
var cors = require('cors');
const routers = require('./routes/routers');
// var auth = require('./service/auth_service')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

routers(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  const error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  console.log(error);
  res.send(error.message);
});

module.exports = app;
