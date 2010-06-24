
/*!
 * This will not be parsed... due to "*!"
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var sys = require('sys'),
    fs = require('fs');

/**
 * Files used by exports.output();
 */

var files = ['foo.js', 'bar.js'];

/**
 * Output contents of 'foo.js' and 'bar.js'
 *
 * ## WTF:
 *
 * This is just a stupid random demo, so... here is a list:
 *
 *   - foo.js
 *   - bar.js
 *
 * ## Examples:
 *
 *    require('foo').output();
 *
 * @param {String} nothing a string that does nothing
 * @return {Object} exports for chaining
 * @api public
 */

var output = exports.output = function(nothing){
    for (var i = 0, len = files.length; i < len; ++i) {
        var file = files[i];
        if (file.match(/\.js$/)) {
            fs.readFile(file, function(err, str){
               if (err) {
                   throw err;
               } else {
                   sys.puts(str); 
               }
            });
        }
    }
    return this;
}