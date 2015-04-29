/**
* quarry - A PowerSchool data mining/aggregation tool.
**/
var express = require('express');
var morgan  = require('morgan');

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
  app.use( express.favicon() );
  app.use( express.bodyParser() );
  app.use( express.methodOverride() );
  app.use( app.router );
  app.use( express.static( path.join( __dirname, 'public' )) );
}

function configurePassport() {
  app.use( passport.initialize() );
}