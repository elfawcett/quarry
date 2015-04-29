( function() {
  'use strict';

  var Q              = require('q');
  var _utils         = require('../common.js');
  var DB_powerSchool = require('../../db.js').powerSchool;

  /**
  * Exports
  **/
  module.exports = query;


  /*==========  Functions  ==========*/
  function query( args ) {
    var deferred = Q.defer();

    // Check for args/query
    var query      = ( args && args.hasOwnProperty('query') ) ? args.query : {};
    var conditions = ( args && args.hasOwnProperty('conditions') ) ? args.conditions : {};

    // Outer query that pull counts from subquery results
    var select = [
      'storedgrades.course_name'
    , 'storedgrades.course_number'
    , 'storedgrades.schoolid'
    ];

    var from = ['storedgrades'];

    // Generate a where clause for the school and term only
    var where = ' storedgrades.course_number IS NOT NULL ';

    if ( query.hasOwnProperty('termID') ) {
      if ( query.termID !== '' ) {
        if ( where.length >= 1 ) {
          where += ' AND ';
        }

        // Three chars long gets the LIKE treatment
        if ( query.termID.length === 3 ) {
          // For withdrawn students, the termid goes 'negative', so we look for -240_ or 240_ in this case
          if ( query.includeWithdrawn === '1' ) {
            where += '(storedgrades.termid LIKE \'' + query.termID + '_\' OR storedgrades.termid LIKE \'-' + query.termID + '_\')';
          } else {
            where += 'storedgrades.termid LIKE \'' + query.termID + '_\'';
          }
        } else {
          if ( query.includeWithdrawn === '1' ) {
            where += '(storedgrades.termid = \'' + query.termID + '\' OR storedgrades.termid = \'-' + query.termID + '\')';
          } else {
            where += 'storedgrades.termid = \'' + query.termID + '\'';
          }

        }
      }
    }

    if ( query.hasOwnProperty('schoolid') ) {
      if ( query.schoolid !== '' ) {
        if ( where.length >= 1 ) {
          where += ' AND ';
        }

        // Check for including Students table
        where += '( storedgrades.schoolid = \'' + query.schoolid + '\' ) ';
      }
    }

    // This is overall nice, but overall overkill I think, at least for now
    var order = {};

    // Connect
    DB_powerSchool.connect( function( err ) {
      if ( err ) {
        deferred.reject( err );
      }

      // Show query
      var SQL = this.query()
        .select( select.toString() ) // Array.toString() because escaping is failing
        .from( from, false )         // Second argument is escaping
        .where( where )
        .add(' GROUP BY storedgrades.course_number, storedgrades.course_name, storedgrades.schoolid ')
        .add(' ORDER BY storedgrades.course_name ')
        .sql()
      ;

      // console.log('Course List SQL:\n', SQL, '\n');

      // Query
      this.query()
        .select( select.toString() )
        .from( from, false )
        .where( where )
        .add(' GROUP BY storedgrades.course_number, storedgrades.course_name, storedgrades.schoolid ')
        .add(' ORDER BY storedgrades.schoolid, storedgrades.course_name ')
        .execute( deferred.makeNodeResolver(), {
          cast   : false // Typecasting really messed with PS 'dates'
        })
      ;
    });

    return deferred.promise;
  }
})();