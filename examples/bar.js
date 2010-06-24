
/*!
 * This will not be parsed... due to "*!"
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var sys = require('sys');

function bar(foo, bar){
    sys.puts([foo, bar].join(' + '));
}

exports.bar = bar;