/**
*
* quarry routes
*
**/
module.exports = function( app ) {
  /*==========  Landing  ==========*/
  app.get('/', landing );
};

function landing( req, res ) {
  res.send('quarry time.  Get out your pickaxe.');
}