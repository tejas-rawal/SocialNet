var express = require('express');
var app = express();

app.configure(function(){
  app.set('view engine', 'jade');
  app.use(express.static(_dirname + '/public'));
});

app.get('/', function(req, res){
  res.render('index.jade', {layout:false});
});

app.get('/account/authenticated', function(res, req) {
  if( req.session.loggedIn ) {
    res.send(200);
  } esle {
    res.send(401);
  }
});

app.listen(8080);