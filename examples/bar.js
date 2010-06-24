
/*!
 * This will not be parsed... due to "*!"
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var sys = require('sys');

/**
 * Output _foo_ and _bar_, seperated by ` + `.
 *
 * @param {String} foo
 * @param {String} bar
 * @api public
 */

function bar(foo, bar){
    sys.puts([foo, bar].join(' + '));
}

/**
 * Export bar().
 */

exports.bar = bar;