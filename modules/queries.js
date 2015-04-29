/**
 * SQL queries
 */
var DB_pbis        = require('../db.js').pbis;
var DB_powerSchool = require('../db.js').powerSchool;

/**
 * Exports
 */
exports.disconnect = disconnect;

exports.crdcTables = require('./crdcTablesQueries');

exports.pbis        = require('./pbisQueries');
exports.powerSchool = require('./powerSchoolQueries');



/*==========  Functions  ==========*/
function disconnect() {
  DB_pbis('close').close();
  DB_powerSchool.disconnect();
}