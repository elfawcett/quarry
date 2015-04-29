/**
*
* quarry routes
*
**/
module.exports = function( app ) {
  /*==========  Landing  ==========*/
  app.get('/', landing );

  /*==========  Modules  ==========*/
  app.use('/q', require('./rawQuery') );
};

function landing( req, res ) {
  res.send('quarry time.  Get out your pickaxe.');
}