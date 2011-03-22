
/*!
 * Dox
 * Copyright (c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

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
        comment.method = parseMethod(code = buf.trim());
        code = koala.render('.js', code);
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
      var comment = parseComment(buf);
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