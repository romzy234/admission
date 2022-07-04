var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// Dot ENV For Keys 
require('dotenv').config()
console.log(process.env.NAME)

// DB ORM Connector
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');

var app = express();

mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,useUnifiedTopology:true
},(error)=>{
  if(error){console.log(error.message)}else{
    console.log("database connected Successfully");
  }
});
// Create A New Staff
require("./auto/createStaff")

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

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
