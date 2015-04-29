/**
* quarry - A PowerSchool data mining/aggregation tool.
**/
var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var serveStatic    = require('serve-static');
var serveFavicon   = require('serve-favicon');

var passport           = require('passport');
var passportStrategies = require('./modules/passportStrategies');

var app = express();

/*==========  Routes  ==========*/
var routes = require('./routes')( app );

/*==========  Middleware  ==========*/
app.set('port', 4005 );
app.use( configureExpress );
app.use( configurePassport );

/*==========  Environment-specific  ==========*/
if ( app.get('env') == 'production' ) {
  app.use( morgan('combined') );
}

if ( app.get('env') == 'development' ) {
  app.set('port', 3012 );
  app.use( morgan('dev') );
}

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

function configureExpress() {
  app.use( bodyParser.urlencoded({ extended: false }) );
  app.use( bodyParser.json() );

  app.use( serveFavicon( __dirname + '/public/favicon.ico' ));
}

function configurePassport() {
  app.use( passport.initialize() );
}