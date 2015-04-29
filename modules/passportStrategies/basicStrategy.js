( function() {
  'use strict';

  var passport      = require('passport');
  var BasicStrategy = require('passport-http').BasicStrategy;
  var users         = require('./_localAuth.js');

  /*==========  Passport config  ==========*/
  passport.serializeUser   = serializeUser;
  passport.deserializeUser = deserializeUser;

  /*==========  Exports  ==========*/
  module.exports = passport.use( new BasicStrategy( verifyCallback ));

  /*==========  Functions  ==========*/
  function verifyCallback( username, password, done ) {
    findUserByUsername( username, function( err, user ) {
      if ( !user ) {
        return done( null, false, { message: 'Username not found.' });
      }

      if ( password !== user.password ) {
        return done( null, false, { message: 'Incorrect password.' });
      }

      // Success
      return done( null, user );
    });
  }

  function serializeUser( user, done ) {
    done( null, user.id );
  }

  function deserializeUser( id, done ) {
    if ( findUserById( id ) ) {
      done( null, user );
    } else {
      done('Could not find user.', false );
    }
  }

  function findUserByUsername( username, callback ) {
    if ( typeof username !== 'string' ) {
      callback('Missing username', null );
    }

    var exists = false;

    users.forEach( function( user ) {
      if ( user.username === username ) {
        exists = user;
      }
    });

    return ( !exists ) ? callback('User not found', null ) : callback( null, exists );
  }

  function findUserById( id, callback ) {
    users.forEach( function( user ) {
      if ( user.id === id ) {
        return user;
      }
    });

    return false;
  }
})();