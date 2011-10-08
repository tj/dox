#!/usr/bin/env node

/**
 * Module dependencies.
 */

var jade = require('jade')
  , fs = require('fs');

function highlight(js) {
  return js
    .replace(/\b(undefined|null|return|function|exports|case|default|switch|if|else)\b/g, '<span class="keyword">$1</span>')
    .replace(/('[^']*')/g, "<span class='string'>$1</span>")
    .replace(/(\d+(\.\d+)?)/g, "<span class='number'>$1</span>");
}

var buf = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(chunk){ buf += chunk; });
process.stdin.on('end', function(){
  var obj = JSON.parse(buf);
  fs.readFile('page.jade', 'utf8', function(err, str){
    if (err) throw err;
    var locals = {};
    locals.comments = obj;
    locals.highlight = highlight;
    process.stdout.write(jade.render(str, { locals: locals }));
  });
}).resume();