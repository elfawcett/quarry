( function() {
  'use strict';

  var passport      = require('passport');
  var LocalStrategy = require('passport-local').Strategy;

  var users = [];

  var localUser = {
    id       : 1
  , username : 'nhrec'
  , password : 'nhrec2015'
  };

  users.push( localUser );

  /*==========  Passport config  ==========*/
  passport.serializeUser   = serializeUser;
  passport.deserializeUser = deserializeUser;

  /*==========  Exports  ==========*/
  exports.LocalStrategy = passport.use( new LocalStrategy( verifyCallback ));

  /*==========  Functions  ==========*/
  function verifyCallback( username, password, done ) {
    if ( username !== localUser.username ) {
      return done( null, false, { message: 'Incorrect username.' });
    }

    if ( password !== localUser.password ) {
      return done( null, false, { message: 'Incorrect password.' });
    }

    // Success
    return done( null, localUser );
  }

  function serializeUser( user, foo, done ) {
    done( null, user.id );
  }

  function deserializeUser( id, done ) {
    users.forEach( function( user ) {
      if ( user.id === id ) {
        done( null, user );
      }
    });

    done('Could not find user.', false );
  }
})();