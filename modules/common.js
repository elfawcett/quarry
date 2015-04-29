/**
 * Common things reused throughout
 */

// Makes a PS date string ('DD-MON-YY') from Date object
exports.psDate = function( date ) {
  var d = date.getDate();
  var m = date.toDateString().substr(4, 3).toUpperCase();
  var y = date.toDateString().substr(13, 2);

  return d + '-' + m + '-' + y;
};

// Formulates a common WHERE clause reused throughout components
exports.whereClause = function( query, conditions, studentsSchoolid ) {
  var result      = {};
  var where       = '';
  var whereValues = [];

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

        whereValues.push( query.termID );
      }
    }
  }

  if ( query.hasOwnProperty('schoolid') ) {
    if ( query.schoolid !== '' ) {
      if ( where.length >= 1 ) {
        where += ' AND ';
      }

      // Check for including Students table
      if ( studentsSchoolid === true ) {
        where += '( storedgrades.schoolid = \'' + query.schoolid + '\' AND students.schoolid = \'' + query.schoolid + '\' ) ';
      } else {
        where += '( storedgrades.schoolid = \'' + query.schoolid + '\' ) ';
      }
      whereValues.push( query.schoolid );
    }
  }

  if ( query.hasOwnProperty('gender') ) {
    if ( query.gender !== '' ) {
      if ( where.length >= 1 ) {
        where += ' AND ';
      }

      where += 'students.gender = \'' + query.gender + '\'';
      whereValues.push( query.gender );
    }
  }

  if ( query.hasOwnProperty('course_number') ) {
    if ( query.course_number !== '' ) {
      if ( where.length >= 1 ) {
        where += ' AND ';
      }

      // Iterate through course_numbers and append
      var courseNumbers    = query.course_number.split(',');
      var courseNumbersStr = '';

      courseNumbers.forEach( function( courseNumber ) {
        if ( courseNumbersStr.length > 0 ) {
          courseNumbersStr += ',\'' + courseNumber + '\'';
        } else {
          courseNumbersStr += '\'' + courseNumber + '\'';
        }
      });

      where += ' storedgrades.course_number IN ( ' + courseNumbersStr + ' )';
      whereValues.push( query.course_number.toUpperCase() );
    }
  }

  if ( query.hasOwnProperty('grade_level') ) {
    if ( query.grade_level !== '' ) {
      if ( where.length >= 1 ) {
        where += ' AND ';
      }

      // Iterate through grade_levels and append
      var gradeLevels    = query.grade_level.split(',');
      var gradeLevelsStr = '';

      var ageStr = '';

      // Check for regular grade levels, or ages, which will be age:7, age:8, etc.
      gradeLevels.forEach( function( gradeLevel ) {
        var age = ( gradeLevel.match(/age:\d+/, 'ig') )
          ? gradeLevel.match(/age:\d+/, 'ig')[0].split(':')[1]
          : null
        ;

        if ( age ) {
          if ( ageStr.length > 0 ) {
            ageStr += ',\'' + age + '\'';
          } else {
            ageStr += '\'' + age + '\'';
          }
        } else {
          if ( gradeLevelsStr.length > 0 ) {
            gradeLevelsStr += ',\'' + gradeLevel + '\'';
          } else {
            gradeLevelsStr += '\'' + gradeLevel + '\'';
          }
        }
      });

      var gradeLevelClause = '';
      var ageClause = '';

      if ( gradeLevelsStr.length > 0 ) {
         gradeLevelClause = ' students.grade_level IN ( ' + gradeLevelsStr + ' ) ';
      }

      // TO_DATE - using DD-MON-RRRR instead of -YY.  PS dates are stored as -YY, but that doesn't specify the century.  Using RRRR
      // means Oracle will convert YY dates to YYYY dates if necessary.
      if ( ageStr.length > 0 ) {
        ageClause = ' TRUNC( MONTHS_BETWEEN( TRUNC( SYSDATE ), TO_DATE( students.dob, \'DD-MON-RRRR\' ) ) / 12 ) IN ( ' + ageStr + ' ) ';
      }

      // If grade levels AND ages are set, then we need to grade OR age, otherwise we can just append one or the other to the where clause
      if ( ageClause.length > 0 && gradeLevelClause.length > 0 ) {
        where += ' ( ' + gradeLevelClause + ' OR ' + ageClause + ' ) ';
      } else {
        if ( gradeLevelClause.length > 0 ) {
          where += gradeLevelClause;
        }
        if ( ageClause.length > 0 ) {
          where += ageClause;
        }
      }
    }
  }

  if ( query.hasOwnProperty('student_number') ) {
    if ( query.student_number !== '' ) {
      if ( where.length >= 1 ) {
        where += ' AND ';
      }

      // Iterate through student_numbers and append
      var studentNumbers    = query.student_number.split(',');
      var studentNumbersStr = '';

      studentNumbers.forEach( function( studentNumber ) {
        if ( studentNumber.length > 0 ) {
          if ( studentNumbersStr.length > 0 ) {
            studentNumbersStr += ',\'' + studentNumber + '\'';
          } else {
            studentNumbersStr += '\'' + studentNumber + '\'';
          }
        }
      });

      where += ' students.student_number IN ( ' + studentNumbersStr + ' )';
      // whereValues.push( query.student_number.toUpperCase() );
    }
  }

  var normalOperators = ['=', '!=', '>', '<', '>=', '<='];
  for ( var col in conditions ) {
    // We generate a new condition and append to the existing where.  condition should be fresh each iteration
    // Iterate conditions and add
    var conditionsValue;
    var conditionsOperator = '=';
    var condition          = '';

    // Property name (col) is the table column name.
    // If property value is a string or number, use that value.
    // If an object, the child object's property is the operator and the child value is the value
    if ( typeof conditions[ col ] === 'object' ) {
      var i = 0;
      for ( var operator in conditions[ col ] ) {
        // Override default operator and get value
        conditionsOperator = operator;
        conditionsValue    = conditions[ col ][ operator ];

        // For multiple conditions
        if ( i >= 1 ) {
          condition += ' AND ';
        }

        condition += ' ' + col + ' ' + conditionsOperator + ' ' + conditionsValue;

        i++;
      }
    } else {
      conditionsValue = conditions[ col ];
    }

    if ( where.length >= 1 ) {
      where += ' AND ';
    }

    where += condition;
  }

  // Implicit sessionid != '0'
  if ( where.length >= 1 ) {
    where += ' AND ';
  }
  where += ' storedgrades.sectionid != \'0\'';

  result.string = where;
  result.array  = whereValues;

  return result;
};