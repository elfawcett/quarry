( function() {
  'use strict';

  /**
  *
  * Raw PS queries route module
  **/
  var express = require('express');
  var router  = express.Router();

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
    res.send('hi there')
  }

  function postQ( req, res ) {
    res.send( req.body );
  }
})();