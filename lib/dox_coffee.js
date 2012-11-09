/*!
 * Module dependencies.
 */

var dox = require('./dox');

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
    , indent;

  var getCodeContext = function () {
    var lines = buf.split('\n')
      , indent
      , indentre
      , i
      , len
      , code;
    // skip start empty lines
    while (lines.length>0 && lines[0].trim()==='') {
      lines.splice(0, 1);
    }
    // return if no content
    if (lines.length===0) {
      buf = '';
      return;
    }
    // get expected indent
    indent = lines[0].match(/^(\s*)/)[1];
    // remove 'indent' from beginning for each line
    indentre = new RegExp('^' + indent);
    for (i = 0, len = lines.length; i < len; i++) {
      // skip empty line
      if (lines[i].trim()==='') {
        continue;
      }
      lines[i] = lines[i].replace(indentre, '');
      // find line of same or little indent to stop there
      if (i!==0 && !lines[i].match(/^\s/)) {
        break;
      }
    }
    // cut below lines
    lines.length = i;
    code = lines.join('\n').trim();
    // add code to previous comment
    if (code.length) {
      comment = comments[comments.length - 1];
      if (comment) {
        indent = comment.indent;
        // find parent
        for (i = comments.length - 2; i>=0 ; i--) {
          if (comments[i].indent.search(indent)<0) {
            break;
          }
        }
        comment.code = code;
        comment.ctx = exports.parseCodeContextCoffee(code, i>=0 ? comments[i] : null);
      }
    }
    buf = '';
  }

  for (var i = 0, len = coffee.length; i < len; ++i) {
    // start comment
    if (!withinMultiline && !withinSingle && '#' == coffee[i] && '#' == coffee[i+1] && '#' == coffee[i+2]) {
      indent = buf.match(/([ \t]*)$/)[1];
      // code following previous comment
      getCodeContext();
      i += 3;
      withinMultiline = true;
      ignore = '!' == coffee[i];
    // end comment
    } else if (withinMultiline && !withinSingle && '#' == coffee[i] && '#' == coffee[i+1] && '#' == coffee[i+2]) {
      i += 3;
      buf = buf.replace(/^ *# ?/gm, '');
      var comment = dox.parseComment(buf, options);
      comment.ignore = ignore;
      comment.indent = indent;
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
  getCodeContext();

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

exports.parseCodeContextCoffee = function(str, parent) {
  var str = str.split('\n')[0]
    , class_name;

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

  if (parent && parent.ctx && parent.ctx.type==='class') {
    class_name = parent.ctx.name;
  }

  // CoffeeScript class syntax
  if (/^class +(\w+)/.exec(str)) {
    return {
        type: 'class'
      , name: RegExp.$1
      , string: 'class ' + RegExp.$1
    };
  } else if (!class_name) {
  // prototype method
  } else if (/^(\w+) *: *(\(.*\)|) *[-=]>/.exec(str)) {
    return {
        type: 'method'
      , constructor: class_name
      , name: RegExp.$1
      , string: class_name + '::' + RegExp.$1 + '()'
    };
  // prototype property
  } else if (/^(\w+) *: *([^\n]+)/.exec(str)) {
    return {
        type: 'property'
      , constructor: class_name
      , name: RegExp.$1
      , value: RegExp.$2
      , string: class_name + '::' + RegExp.$1
    };
  // method
  } else if (/^@(\w+) *: *(\(.*\)|) *[-=]>/.exec(str)) {
    return {
        type: 'method'
      , receiver: class_name
      , name: RegExp.$1
      , string: class_name + '.' + RegExp.$1 + '()'
    };
  // property
  } else if (/^@(\w+) *: *([^\n]+)/.exec(str)) {
    return {
        type: 'property'
      , receiver: class_name
      , name: RegExp.$1
      , value: RegExp.$2
      , string: class_name + '.' + RegExp.$1
    };
  }
};
