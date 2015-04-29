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
    res.render('rawQuery', { body: {} });
  }

  function postQ( req, res ) {
    console.log( req.body )
    res.render('rawQuery', { body: req.body, results: ['hi','there','cats'] });
  }
})();