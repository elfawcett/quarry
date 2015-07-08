( function() {
  'use strict';

  var Q              = require('q');
  var DB_powerSchool = require('../../db.js').powerSchool;

  /**
  * Exports
  **/
  module.exports = rawQuery;


  // // Array syntax
  // var select = [
  //   'ps_customfields.getcf(\'Students\',s.id,\'area\')homeschool'
  // , 's.lastfirst'
  // , 's.student_number'
  // , 's.grade_level'
  // , 'a.att_date'
  // , 'ac.att_code'
  // , 'p.abbreviation'
  // , 's.schoolid'
  // ];

  // // Object notation aliasing produces "attendance AS a", which doesn't seem to work with PS
  // var from = ['attendance a'];

  // // Escaping is not working out
  // var joins = {
  //   attendance_code: {
  //     type       : 'INNER'
  //   , table      : 'attendance_code ac'
  //   , conditions : 'a.attendance_codeid=ac.id'
  //   , escape     : false
  //   }
  // , students: {
  //     type       : 'INNER'
  //   , table      : 'students s'
  //   , conditions : 'a.studentid=s.id'
  //   , escape     : false
  //   }
  // , period: {
  //     type       : 'INNER'
  //   , table      : 'period p'
  //   , conditions : 'a.periodid=p.id'
  //   , escape     : false
  //   }
  // };

  // /* These could be split up and refactored into individual .and( condition, values ) */
  // var where  = 'a.att_date = ?' //\'14-NOV-14\''
  // + ' AND s.schoolid IN ?' //210'
  // + ' AND p.abbreviation IN ?' //\'P4\''
  // + ' AND ac.att_code IS NOT ?'//NOT NULL'
  // + ' AND rownum < ?' //150'
  // ;

  // var whereValues = [
  //   '14-NOV-14'    // replace with var attDate
  // , ['220', '210'] // replace wtih var schools[]
  // , ['P1', 'P4']   // replace with var periods[]
  // , null           // may not work.  may just be static part of where
  // , 150            // maybe replace with var hardLimit just to prevent impossible page loads
  // ];

  // // This is overall nice, but overall overkill I think, at least for now
  // var order = {
  //   // true = ASC, false = DESC
  //   'ps_customfields.getcf(\'Students\',s.id,\'area\')' : { order: true, escape: false }
  // , 's.schoolid'                                        : { order: true, escape: false }
  // , 'p.abbreviation'                                    : { order: true, escape: false }
  // , 's.lastfirst'                                       : { order: true, escape: false }
  // };

  /*==========  Functions  ==========*/
  // Selects attendance for all home schools, AM and PM, WSL and BF
  function rawQuery( sql ) {
    var deferred = Q.defer();

    DB_powerSchool( function( err, connection ) {
      if ( err ) {
        deferred.reject( err );
        return;
      }

      // Adjust the sql string
      // Check for block commenting
      var split = '';
      if ( sql.indexOf('/--') !== -1 && sql.indexOf('--/') !== -1 ) {
        split = sql.split('/--');
        if ( String( split[0] ).trim().length > 0 ) {
          split = String( split[0].split('--/')[1] ).trim();
        } else {
          split = String( split[1].split('--/')[1] ).trim();
        }
      }

      sql = ( split.length > 1 ) ? split : sql;

      // Execute query
      // .execute( sql, bindablesObject, optionsObject, callback )
      connection.execute( sql, {}, { maxRows: 100000 }, function( err, results ) {
        if ( err ) {
          deferred.reject({ err: err, sql: sql });
          return;
        }

        // Set a placeholder for parsedResults and selectedColumns
        results.parsedResults   = [];
        results.selectedColumns = [];

        // Stick the statement on there too
        results.sql = sql;

        // Parse the results against metaData I guess in order send an array of objects
        if ( results.hasOwnProperty('rows') ) {
          if ( typeof results.rows === 'undefined' ) {
            results.rows = [];
          }

          var parsedResults = [];

          results.rows.forEach( function( row ) {
            var tempObj = {};

            // Each row is a dumb array of values
            row.forEach( function( value, i ) {
              var colName = ( results.hasOwnProperty('metaData') ) ? results.metaData[ i ].name : 'unknownCol';
              tempObj[ colName ] = value;

              // Add column name to selectedColumns if it doesn't exist
              if ( results.selectedColumns.indexOf( colName ) === -1 ) {
                results.selectedColumns.push( colName );
              }
            });

            // Add tempObj to parsedResults
            parsedResults.push( tempObj );
          });

          // Attach parsedResults to results object
          results.parsedResults = parsedResults;
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