( function() {
  'use strict';

  var authFile = require('./_localAuth.js');

  var local = require('./localStrategy.js');
  var basic = require('./basicStrategy.js');

  module.exports = {
    local: local
  , basic: basic
  };
})();