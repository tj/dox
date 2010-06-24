
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

var files = ['foo.js', 'bar.js'];

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