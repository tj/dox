/*!
 * Module dependencies.
 */

var markdown = require('github-flavored-markdown').parse
  , dox = require('./dox');

/**
 * Parse comments in the given string of `coffee`.
 *
 * @param {String} coffee
 * @param {Object} options
 * @return {Array}
 * @see exports.parseComment
 * @api public
 */

exports.parseCommentsCoffee = function(coffee, options){
  options = options || {};
  coffee = coffee.replace(/\r\n/gm, '\n');

  var comments = []
    , raw = options.raw
    , comment
    , buf = ''
    , ignore
    , withinMultiline = false
    , withinSingle = false
    , code;

  for (var i = 0, len = coffee.length; i < len; ++i) {
    // start comment
    if (!withinMultiline && !withinSingle && '#' == coffee[i] && '#' == coffee[i+1] && '#' == coffee[i+2]) {
      // code following previous comment
      if (buf.trim().length) {
        comment = comments[comments.length - 1];
        if(comment) {
          comment.code = code = buf.trim();
          comment.ctx = exports.parseCodeContextCoffee(code);
        }
        buf = '';
      }
      i += 3;
      withinMultiline = true;
      ignore = '!' == coffee[i];
    // end comment
    } else if (withinMultiline && !withinSingle && '#' == coffee[i] && '#' == coffee[i+1] && '#' == coffee[i+2]) {
      i += 3;
      buf = buf.replace(/^ *# ?/gm, '');
      var comment = dox.parseComment(buf, options);
      comment.ignore = ignore;
      comments.push(comment);
      withinMultiline = ignore = false;
      buf = '';
    } else if (!withinSingle && !withinMultiline && '#' == coffee[i]) {
      withinSingle = true;
      buf += coffee[i];
    } else if (withinSingle && !withinMultiline && '\n' == coffee[i]) {
      withinSingle = false;
      buf += coffee[i];
    // buffer comment or code
    } else {
      buf += coffee[i];
    }
  }

  if (comments.length === 0) {
    comments.push({
      tags: [],
      description: {full: '', summary: '', body: ''},
      isPrivate: false
    });
  }

  // trailing code
  if (buf.trim().length) {
    comment = comments[comments.length - 1];
    code = buf.trim();
    comment.code = code;
    comment.ctx = exports.parseCodeContextCoffee(code);
  }

  return comments;
};

/**
 * Parse the context from the given `str` of coffee.
 *
 * This method attempts to discover the context
 * for the comment based on it's code. Currently
 * supports:
 *
 *   - function statements
 *   - function expressions
 *   - prototype methods
 *   - prototype properties
 *   - methods
 *   - properties
 *   - declarations
 *
 * @param {String} str
 * @return {Object}
 * @api public
 */

exports.parseCodeContextCoffee = function(str){
  var str = str.split('\n')[0];

  // function expression
  if (/^(\w+) *= *(\(.*\)|) *[-=]>/.exec(str)) {
    return {
        type: 'function'
      , name: RegExp.$1
      , string: RegExp.$1 + '()'
    };
  // prototype method
  } else if (/^(\w+)::(\w+) *= *(\(.*\)|) *[-=]>/.exec(str)) {
    return {
        type: 'method'
      , constructor: RegExp.$1
      , name: RegExp.$2
      , string: RegExp.$1 + '::' + RegExp.$2 + '()'
    };
  // prototype property
  } else if (/^(\w+)::(\w+) *= *([^\n]+)/.exec(str)) {
    return {
        type: 'property'
      , constructor: RegExp.$1
      , name: RegExp.$2
      , value: RegExp.$3
      , string: RegExp.$1 + '::' + RegExp.$2
    };
  // method
  } else if (/^(\w+)\.(\w+) *= *(\(.*\)|) *[-=]>/.exec(str)) {
    return {
        type: 'method'
      , receiver: RegExp.$1
      , name: RegExp.$2
      , string: RegExp.$1 + '.' + RegExp.$2 + '()'
    };
  // property
  } else if (/^(\w+)\.(\w+) *= *([^\n]+)/.exec(str)) {
    return {
        type: 'property'
      , receiver: RegExp.$1
      , name: RegExp.$2
      , value: RegExp.$3
      , string: RegExp.$1 + '.' + RegExp.$2
    };
  // declaration
  } else if (/^(\w+) *= *([^\n]+)/.exec(str)) {
    return {
        type: 'declaration'
      , name: RegExp.$1
      , value: RegExp.$2
      , string: RegExp.$1
    };
  }

  // CoffeeScript class syntax
  if (/^class +(\w+)/.exec(str)) {
    return {
        type: 'class'
      , name: RegExp.$1
      , string: 'class ' + RegExp.$1
    };
  }
};
