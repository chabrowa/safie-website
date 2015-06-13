var express = require('express');
var handlebar = require('express-handlebars');

var app = express();
var router = require(__dirname + '/app/routes');

app.engine('html', handlebar({defaultLayout: 'main'}));
app.set('view engine', 'html');
app.set('views', __dirname + '/app/views');
app.set('port', (process.env.PORT || 3001));

var options = {
  dotfiles: 'ignore',
  etag: false,
  index: false,
  maxAge: '0',
  redirect: false
};

app.use(express.static(__dirname + '/app/public', options));
app.use(router.router);

var server = app.listen(app.get('port'), function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('hello :]' + host+ ":" + port);
});


