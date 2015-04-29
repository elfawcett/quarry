( function() {
  'use strict';

  var Q              = require('q');
  var DB_powerSchool = require('../../db.js').powerSchool;

  /**
  * Exports
  **/
  module.exports = rawQuery;


  // Array syntax
  var select = [
    'ps_customfields.getcf(\'Students\',s.id,\'area\')homeschool'
  , 's.lastfirst'
  , 's.student_number'
  , 's.grade_level'
  , 'a.att_date'
  , 'ac.att_code'
  , 'p.abbreviation'
  , 's.schoolid'
  ];

  // Object notation aliasing produces "attendance AS a", which doesn't seem to work with PS
  var from = ['attendance a'];

  // Escaping is not working out
  var joins = {
    attendance_code: {
      type       : 'INNER'
    , table      : 'attendance_code ac'
    , conditions : 'a.attendance_codeid=ac.id'
    , escape     : false
    }
  , students: {
      type       : 'INNER'
    , table      : 'students s'
    , conditions : 'a.studentid=s.id'
    , escape     : false
    }
  , period: {
      type       : 'INNER'
    , table      : 'period p'
    , conditions : 'a.periodid=p.id'
    , escape     : false
    }
  };

  /* These could be split up and refactored into individual .and( condition, values ) */
  var where  = 'a.att_date = ?' //\'14-NOV-14\''
  + ' AND s.schoolid IN ?' //210'
  + ' AND p.abbreviation IN ?' //\'P4\''
  + ' AND ac.att_code IS NOT ?'//NOT NULL'
  + ' AND rownum < ?' //150'
  ;

  var whereValues = [
    '14-NOV-14'    // replace with var attDate
  , ['220', '210'] // replace wtih var schools[]
  , ['P1', 'P4']   // replace with var periods[]
  , null           // may not work.  may just be static part of where
  , 150            // maybe replace with var hardLimit just to prevent impossible page loads
  ];

  // This is overall nice, but overall overkill I think, at least for now
  var order = {
    // true = ASC, false = DESC
    'ps_customfields.getcf(\'Students\',s.id,\'area\')' : { order: true, escape: false }
  , 's.schoolid'                                        : { order: true, escape: false }
  , 'p.abbreviation'                                    : { order: true, escape: false }
  , 's.lastfirst'                                       : { order: true, escape: false }
  };

  /*==========  Functions  ==========*/
  // Selects attendance for all home schools, AM and PM, WSL and BF
  function rawQuery( sql ) {
    var deferred = Q.defer();

    DB_powerSchool( function( err, connection ) {
      if ( err ) {
        deferred.reject( err );
        return;
      }

      // Execute query
      connection.execute( sql, function( err, results ) {
        if ( err ) {
          deferred.reject( err );
          return;
        }

        deferred.resolve( results );

        // Release connection
        connection.release( function( err ) {
          if ( err ) {
            console.log( err );
          }
        });
      });

    });


    return deferred.promise;
  }
})();