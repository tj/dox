/*!
 * Module dependencies.
 */

var markdown = require('github-flavored-markdown').parse
  , escape = require('./utils').escape;

/**
 * Expose api.
 */

exports.api = require('./api');

/**
 * Parse comments in the given string of `js`.
 *
 * @param {String} js
 * @param {Object} options
 * @return {Array}
 * @see exports.parseComment
 * @api public
 */

exports.parseComments = function(js, options){
  options = options || {};
  js = js.replace(/\r\n/gm, '\n');

  var comments = []
    , raw = options.raw
    , comment
    , buf = ''
    , ignore
    , withinMultiline = false
    , withinSingle = false
    , code;

  for (var i = 0, len = js.length; i < len; ++i) {
    // start comment
    if (!withinMultiline && !withinSingle && '/' == js[i] && '*' == js[i+1]) {
      // code following previous comment
      if (buf.trim().length) {
        comment = comments[comments.length - 1];
        if(comment) {
          comment.code = code = buf.trim();
          comment.ctx = exports.parseCodeContext(code);
        }
        buf = '';
      }
      i += 2;
      withinMultiline = true;
      ignore = '!' == js[i];
    // end comment
    } else if (withinMultiline && !withinSingle && '*' == js[i] && '/' == js[i+1]) {
      i += 2;
      buf = buf.replace(/^[ \t]*\* ?/gm, '');
      var comment = exports.parseComment(buf, options);
      comment.ignore = ignore;
      comments.push(comment);
      withinMultiline = ignore = false;
      buf = '';
    } else if (!withinSingle && !withinMultiline && '/' == js[i] && '/' == js[i+1]) {
      withinSingle = true;
      buf += js[i];
    } else if (withinSingle && !withinMultiline && '\n' == js[i]) {
      withinSingle = false;
      buf += js[i];
    // buffer comment or code
    } else {
      buf += js[i];
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
    comment.ctx = exports.parseCodeContext(code);
  }

  return comments;
};

/**
 * Parse the given comment `str`.
 *
 * The comment object returned contains the following
 *
 *  - `tags`  array of tag objects
 *  - `description` the first line of the comment
 *  - `body` lines following the description
 *  - `content` both the description and the body
 *  - `isPrivate` true when "@api private" is used
 *
 * @param {String} str
 * @param {Object} options
 * @return {Object}
 * @see exports.parseTag
 * @api public
 */

exports.parseComment = function(str, options) {
  str = str.trim();
  options = options || {};

  var comment = { tags: [] }
    , raw = options.raw
    , description = {};

  // parse comment body
  description.full = str.split('\n@')[0];
  description.summary = description.full.split('\n\n')[0];
  description.body = description.full.split('\n\n').slice(1).join('\n\n');
  comment.description = description;

  // parse tags
  if (~str.indexOf('\n@')) {
    var tags = '@' + str.split('\n@').slice(1).join('\n@');
    comment.tags = tags.split('\n').map(exports.parseTag);
    comment.isPrivate = comment.tags.some(function(tag){
      return 'api' == tag.type && 'private' == tag.visibility;
    })
  }

  // markdown
  if (!raw) {
    description.full = markdown(description.full);
    description.summary = markdown(description.summary);
    description.body = markdown(description.body);
  }

  return comment;
}

/**
 * Parse tag string "@param {Array} name description" etc.
 *
 * @param {String}
 * @return {Object}
 * @api public
 */

exports.parseTag = function(str) {
  var tag = {}
    , parts = str.split(/ +/)
    , type = tag.type = parts.shift().replace('@', '')
    , suffix = parts.join(' ');

  switch (type) {
    case 'param':
      if (/^(\{.*\})? *([^ ]*) *(.*)$/.exec(suffix)) {
        if (RegExp.$2) {
          tag.name = RegExp.$2;
        }
        if (RegExp.$3) {
          tag.description = RegExp.$3;
        }
        if (RegExp.$1) {
            tag.types = exports.parseTagTypes(RegExp.$1);
        }
      }
      break;
    case 'return':
      if (/^(\{.*\})? *(.*)$/.exec(suffix)) {
        if (RegExp.$2) {
          tag.description = RegExp.$2;
        }
        if (RegExp.$1) {
            tag.types = exports.parseTagTypes(RegExp.$1);
        }
      }
      break;
    case 'see':
      if (~str.indexOf('http')) {
        tag.title = parts.length > 1
          ? parts.shift()
          : '';
        tag.url = parts.join(' ');
      } else {
        tag.local = parts.join(' ');
      }
    case 'api':
      tag.visibility = parts.shift();
      break;
    case 'type':
      tag.types = exports.parseTagTypes(suffix);
      break;
    case 'memberOf':
      tag.parent = parts.shift();
      break;
    case 'augments':
      tag.otherClass = parts.shift();
      break;
    case 'borrows':
      tag.otherMemberName = parts.join(' ').split(' as ')[0];
      tag.thisMemberName = parts.join(' ').split(' as ')[1];
      break;
    case 'throws':
      tag.types = exports.parseTagTypes(parts.shift());
      tag.description = parts.join(' ');
      break;
    default:
      tag.string = parts.join(' ');
      break;
  }

  return tag;
}

/**
 * Parse tag type string "{Array|Object}" etc.
 *
 * @param {String} str
 * @return {Array}
 * @api public
 */

exports.parseTagTypes = function(str) {
  // validate input
  if ( !str
    || str.trim().length < 2
    || str.trim().charAt(0) != "{"
    || str.trim().charAt(str.trim().length - 1) != "}" ) {
    return null;
  }

  var typeStr = str.trim().substr(1, str.trim().length - 2)
    , types = {};
  
  //any type
  if (typeStr == "*") {
    types.matcher = "any";
  //unknown type
  } else if (typeStr == "?") {
    types.matcher = "unknown";
  // nullable type
  } else if (/^\?(.*)$/.exec(typeStr)) {
    types = exports.parseTagTypes('{' + RegExp.$1 +'}');
    types.nullable = true;
  // non-nullable type
  } else if (/^!(.*)$/.exec(typeStr)) {
    types = exports.parseTagTypes('{' + RegExp.$1 + '}');
    types.nullable = false;
  // optional type
  } else if (/^(.*)=$/.exec(typeStr)) {
    types = exports.parseTagTypes('{' + RegExp.$1 + '}');
    types.optional = true;
  // variable type
  } else if (/^\.\.\.(.*)$/.exec(typeStr)) {
    types.matcher = 'variable';
    types.types = exports.parseTagTypes('{' + RegExp.$1 + '}');
  // record type
  } else if (/^\{(.*)\}$/.exec(typeStr)) {
    types.matcher = 'record';
    types.properties = [];
    var props = RegExp.$1.split(',');
    for (i in props) {
        types.properties[i] = { name: props[i].split(':')[0].trim() };
        if (props[i].split(':').length > 1) {
            types.properties[i].types = 
                exports.parseTagTypes('{' + props[i].split(':')[1].trim() + '}');
        }
    }
  // array type
  } else if (/^Array((\.\<)(.*)(\>))?$/.exec(typeStr)) {
    types.matcher = "array";
    if (RegExp.$3) {
        types.elementType = exports.parseTagTypes('{' + RegExp.$3 + '}');
    }
  // map type
  } else if (/^Object\.\<(.*), *(.*)\>$/.exec(typeStr)) {
    types.matcher = "map";
    types.keyType = exports.parseTagTypes('{' + RegExp.$1 + '}');
    types.valueType = exports.parseTagTypes('{' + RegExp.$2 + '}');
  // function
  } else if (/^function *\((.*)\) *(: *(.*))?$/.exec(typeStr)) {
    types.matcher = 'function';
    var args = RegExp.$1.split(",");
    var returnType = RegExp.$3; 
    for (i in args) {
      types.args = types.args || [];
      types.args.push(exports.parseTagTypes('{' + args[i].trim() + '}'));
    }
    if (returnType) {
      types.returnType = exports.parseTagTypes('{' + returnType.trim() + '}');
    }
  // union
  } else if (typeStr.indexOf("|") >= 0) {
    types.matcher = "union";
    if (typeStr.charAt(0) == "(" && typeStr.charAt(typeStr.length - 1) == ")") {
        typeStr = typeStr.substr(1, typeStr.length - 2);
    }
    var parts = typeStr.split("|");
    for (var i in parts) {
        types.subtypes = types.subtypes || [];
        types.subtypes.push(exports.parseTagTypes('{' + parts[i] + '}'));
    }
  } else {
    types.matcher = "name";
    types.name = typeStr;
  }
  return types;
};

/**
 * Parse the context from the given `str` of js.
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

exports.parseCodeContext = function(str){
  var str = str.split('\n')[0];

  // function statement
  if (/^function ([\w$]+) *\(/.exec(str)) {
    return {
        type: 'function'
      , name: RegExp.$1
      , string: RegExp.$1 + '()'
    };
  // function expression
  } else if (/^var *([\w$]+)[ \t]*=[ \t]*function/.exec(str)) {
    return {
        type: 'function'
      , name: RegExp.$1
      , string: RegExp.$1 + '()'
    };
  // prototype method
  } else if (/^([\w$]+)\.prototype\.([\w$]+)[ \t]*=[ \t]*function/.exec(str)) {
    return {
        type: 'method'
      , constructor: RegExp.$1
      , cons: RegExp.$1
      , name: RegExp.$2
      , string: RegExp.$1 + '.prototype.' + RegExp.$2 + '()'
    };
  // prototype property
  } else if (/^([\w$]+)\.prototype\.([\w$]+)[ \t]*=[ \t]*([^\n;]+)/.exec(str)) {
    return {
        type: 'property'
      , constructor: RegExp.$1
      , cons: RegExp.$1
      , name: RegExp.$2
      , value: RegExp.$3
      , string: RegExp.$1 + '.prototype.' + RegExp.$2
    };
  // method
  } else if (/^([\w$.]+)\.([\w$]+)[ \t]*=[ \t]*function/.exec(str)) {
    return {
        type: 'method'
      , receiver: RegExp.$1
      , name: RegExp.$2
      , string: RegExp.$1 + '.' + RegExp.$2 + '()'
    };
  // property
  } else if (/^([\w$]+)\.([\w$]+)[ \t]*=[ \t]*([^\n;]+)/.exec(str)) {
    return {
        type: 'property'
      , receiver: RegExp.$1
      , name: RegExp.$2
      , value: RegExp.$3
      , string: RegExp.$1 + '.' + RegExp.$2
    };
  // declaration
  } else if (/^var +([\w$]+)[ \t]*=[ \t]*([^\n;]+)/.exec(str)) {
    return {
        type: 'declaration'
      , name: RegExp.$1
      , value: RegExp.$2
      , string: RegExp.$1
    };
  }
};
