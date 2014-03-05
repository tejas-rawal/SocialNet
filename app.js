var express = require('express');
var app = express();

app.configure(function(){
  app.set('view engine', 'jade');
  app.use(express.static(_dirname + '/public'));
});

app.get('/', function(req, res){
  res.render('index.jade', {layout:false});
});

app.listen(8080);