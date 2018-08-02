/* Functions to manipulate a string of SQL */

/**
 * Looks for "block comment" tags (/-- and --/) returns a string
 * without the content between the tags.
 *
 * @param {string} string SQL string to manipulate
 */
exports.blockComment = function(string) {
  var split
  var a, commented, b

  if (string.indexOf('/--') !== -1 && string.indexOf('--/') !== -1) {
    // Split at the first comment mark
    split = string.split('/--')
    // First half is a
    a = String(split[0])

    // Split the second half at the ending comment mark
    split = split[1].split('--/')
    // First half is commented out
    commented = String(split[0])
    // Second half is b
    b = String(split[1])

    // Overwrite split as adjusted SQL
    split = String(a).trim() + ' ' + String(b).trim()
  }

  return split ? split : string
}

/**
 * Capitalizes most keywords like SELECT, FROM, WHERE, etc.
 * @param {string} string SQL string
 */
exports.capitalizeKeywords = function(string) {
  var re = /(^select\s|(?:\()select|\sfrom\s|\sand\s|\sor\s|\sinner\sjoin\s|\sleft\sjoin\s|\swhere\s|\son\s|\sorder by\s)/gim
  return string.replace(re, function(x) {
    return x.toUpperCase()
  })
}

/**
 * Adds extra line feeds after/before keywords.
 * @param {string} string SQL
 */
exports.extraReturns = function(string) {
  var re = /(^select\s(?!\r\n|\n)|(?:\()select(?!\r\n|\n)|\sfrom\s(?!\r\n|\n)|\sinner\sjoin\s(?!\r\n|\n)|\sleft\sjoin\s(?!\r\n|\n)|\swhere\s(?!\r\n|\n)|(?!\()\sorder by\s(?!\n))/gim
  return string.replace(re, function(x) {
    return x.toLowerCase().indexOf('select') !== -1 ? x.trim() + '\r\n' : '\r\n' + x.trim() + '\r\n'
  })
}
