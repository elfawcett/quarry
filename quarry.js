/**
* quarry - A PowerSchool data mining/aggregation tool.
**/
var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var serveStatic    = require('serve-static');
var serveFavicon   = require('serve-favicon');
var multer         = require('multer');

var path = require('path');

var passport           = require('passport');
var passportStrategies = require('./modules/passportStrategies');

var app = express();

/*==========  Middleware  ==========*/
app.set('port', 4005 );

app.set('views', path.join( __dirname, 'views' ));
app.set('view engine', 'jade');

app.use( bodyParser.urlencoded({ extended: false }) );
app.use( bodyParser.json() );
app.use( multer() );
app.use( serveFavicon( __dirname + '/public/favicon.ico' ));

app.use( passport.initialize() );

/*==========  Environment-specific  ==========*/
if ( app.get('env') == 'production' ) {
  app.use( morgan('combined') );
}

if ( app.get('env') == 'development' ) {
  app.set('port', 3012 );
  app.use( morgan('dev') );
}

/*==========  Routes  ==========*/
var routes = require('./routes')( app );

/*==========  Start listening  ==========*/
app.listen( app.get('port'), startServer );


/*==========  Functions  ==========*/
function startServer() {
  var self    = this;
  var env     = app.get('env');
  var address = self.address().address;
  var port    = self.address().port;

  console.log('\n** quarry:%s - http://%s:%s **\n', env, address, port );
}