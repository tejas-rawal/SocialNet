var express = require('express');
var app = express();
var nodemailer = require('nodemailer');
var MemoryStore = require('connect').session.MemoryStore;

// Import data layer
var mongoose = require('mongoose');
var config = {
  mail: require('./config/mail')
};

// Import accounts
var Account = require('./models/Account')(config, mongoose, nodemailer);

app.configure(function(){
  app.set('view engine', 'jade');
  app.use(express.static(_dirname + '/public'));
  app.use(express.limit('1mb'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session(
    {secret: "SocialNet secret key", store: new MemoryStore()}));
  mongoose.connect('mongodb://localhost/nodebackbone');
});

app.get('/', function(req, res){
  res.render('index.jade');
});

app.get('/account/authenticated', function(res, req) {
  if( req.session.loggedIn ) {
    res.send(200);
  } esle {
    res.send(401);
  }
});

app.post('/register', function(req, res) {
  var firstName = req.param('firstName', '');
  var lastName = req.param('lastName', '');
  var email = req.param('email', null);
  var password = req.param('password', null);

  if( email == null || password == null ) {
    res.send(400);
    return;
  }

  Account.register(email, password, firstName, lastName);
  res.send(200);
});

app.post('/login', function(req, res) {
  console.log('login request');
  var email = req.param('email', null);
  var password = req.param('password', null);

  if( email == null || email.length < 1 || password == null || password.length < 1 ) {
    res.send(400);
    return;
  }

  Account.login(email, password, function(success) {
    if( !success ) {
      res.send(401);
      return;
    }
    console.log('login was successful');
    res.send(200);
  });
});

app.post('/forgotpassword', function(res, req) {
  var hostname = req.headers.host;
  var resetPasswordUrl = 'http://' + hostname + '/resetPassword';
  var email = req.param('email', null);
  if( email == null || email.length < 1 ) {
    res.send(400);
    return;
  }

  Account.forgotPassword(email, resetPasswordUrl, function(success) {
    if(success) {
      res.send(200);
    } else {
      res.send(400) // Account not found
    }
  });
});

app.get('/resetPassword', function(req, res) {
  var accountId = req.param('account', null);
  res.render('resetPassword.jade', {locals:{accountId:accountId}});
});

app.post('/resetPassword', function(req, res) {
  var accountId = req.param('accountId', null);
  var password = req.param('password', null);
  if(accountId != null && password != null) {
    Account.changePassword(accountId, password);
  }
  res.render('resetPasswordSuccess.jade');
});

app.listen(8080);