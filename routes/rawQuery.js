( function() {
  'use strict';

  /**
  *
  * Raw PS queries route module
  * This is pretty cool.  Wherever this module is mounted by the calling require() (/q in this case),
  * the paths become relative.  So in this module we define '/', but that actually ends up being '/q'
  **/
  var express = require('express');
  var router  = express.Router();

  var _q = require('../modules/queries');

  router.get('/', getQ );
  router.post('/', postQ );

  /**
  *
  * Export
  *
  **/
  module.exports = router;

  /**
  *
  * Functions
  *
  **/
  function getQ( req, res ) {
    res.render('rawQuery', { body: {} });
  }

  function postQ( req, res ) {
    var query = ( req.body.hasOwnProperty('query') ) ? req.body.query : '';
    // query = query.replace( /\r\n/g, ' ' );

    _q.rawQuery( query )
      .then( function( results ) {
        // console.log( results )

        res.render('rawQuery', { body: req.body, results: results.parsedResults, columns: results.selectedColumns });
      })
      .catch( function( err ) {
        res.status( 500 ).render('rawQuery', { body: req.body, err: err });
      })
    ;
  }
})();