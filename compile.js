#!/usr/bin/env node

/**
 * Module dependencies.
 */

var jade = require('jade')
  , fs = require('fs');

var buf = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(chunk){ buf += chunk; });
process.stdin.on('end', function(){
  var obj = JSON.parse(buf);
  fs.readFile('page.jade', 'utf8', function(err, str){
    if (err) throw err;
    jade.render(str, obj, function(err, html){
      if (err) throw err;
      process.stdout.write(html);
    });
  });
}).resume();