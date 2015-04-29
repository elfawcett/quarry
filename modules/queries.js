/**
 * SQL queries
 */
var DB_powerSchool = require('../db.js').powerSchool;

/**
 * Exports
 */
exports.disconnect = disconnect;

exports.crdcTables = require('./crdcTablesQueries');

exports.powerSchool = require('./powerSchoolQueries');



/*==========  Functions  ==========*/
function disconnect() {
  // DB_pbis('close').close();
  DB_powerSchool.disconnect();
}