/**
 * SQL queries
 */
var DB_powerSchool = require('../db.js').powerSchool;

/**
 * Exports
 */
// exports.disconnect = disconnect;
// exports.powerSchool = require('./powerSchoolQueries');
exports.rawQuery = require('./powerSchoolQueries/rawQuery.js');



/*==========  Functions  ==========*/
function disconnect() {
  // DB_pbis('close').close();
  // DB_powerSchool.disconnect();
}