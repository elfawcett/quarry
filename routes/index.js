/**
*
* quarry routes
*
**/
var passport = require('passport');

module.exports = function( app ) {
  /* Auth on all routes */
  app.all('*', passport.authenticate('basic'), function( req, res, next ) {
    next();
  });

  /*==========  Landing  ==========*/
  app.get('/', landing );

  /*==========  Modules  ==========*/
  app.use('/q', require('./rawQuery') );
};

function landing( req, res ) {
  // res.send('quarry time.  Get out your pickaxe.');
  res.render('landing');
}