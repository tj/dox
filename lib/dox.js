
/*!
 * Dox
 * Copyright (c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var markdown = require('markdown').parse;

/**
 * Library version.
 */

exports.version = '0.0.5';

exports.parseComments = function(js){
  var comments = []
    , comment
    , buf = ''
    , ignore
    , within
    , code;

  for (var i = 0, len = js.length; i < len; ++i) {
    // start comment
    if ('/' == js[i] && '*' == js[i+1]) {
      // code following previous comment
      if (buf.trim().length) {
        comment = comments[comments.length - 1];
        code = buf.trim();
        //comment.method = parseMethod(code = buf.trim());
        comment.code = code;
        buf = '';
      }
      i += 2;
      within = true;
      ignore = '!' == js[i];
    // end comment
    } else if ('*' == js[i] && '/' == js[i+1]) {
      i += 2;
      buf = buf.replace(/^ *\* ?/gm, '');
      var comment = exports.parseComment(buf);
      comment.ignore = ignore;
      comments.push(comment);
      within = ignore = false;
      buf = '';
    // buffer comment or code
    } else {
      buf += js[i];
    }
  }

  return comments;
};

exports.parseComment = function(str) {
  str = str.trim();
  var comment = { tags: [], string: str };

  // parse comment body
  comment.content = str.split('@')[0].replace(/^([\w ]+):/gm, '## $1');
  comment.description = comment.content.split('\n\n')[0];
  comment.body = comment.content.split('\n\n').slice(1).join('\n\n');

  // parse tags
  if (~str.indexOf('@')) {
    var tags = '@' + str.split('@').slice(1).join('@');
    comment.tags = tags.split('\n').map(exports.parseTag);
    comment.isPrivate = comment.tags.some(function(tag){
      return 'api' == tag.type && 'private' == tag.visibility;
    })
  }

  // markdown
  comment.content = markdown(comment.originalContent = comment.content);
  comment.description = markdown(comment.originalDescription = comment.description);
  comment.body = markdown(comment.originalBody = comment.body);

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
    , type = tag.type = parts.shift().replace('@', '');

  switch (type) {
    case 'param':
      tag.types = exports.parseTagTypes(parts.shift());
      tag.name = parts.shift() || '';
      tag.description = parts.join(' ');
      break;
    case 'return':
      tag.types = exports.parseTagTypes(parts.shift());
      tag.description = parts.join(' ');
      break;
    case 'api':
      tag.visibility = parts.shift();
      break;
    case 'type':
      tag.types = exports.parseTagTypes(parts.shift());
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
  return str
    .replace(/[{}]/g, '')
    .split(/ *[|,\/] */);
};