
/**
 * Module dependencies.
 */

var jade = require('jade')
  , fs = require('fs');

module.exports = function(env){
  renderPages(env, function(err){
    if (err) throw err;
  });
};

function renderPages(env, fn) {
  var pending = env.paths.length;

  // render pages
  env.paths.forEach(function(path){
    var comments = env.files[path];
    page({ comments: comments, filename: path }, function(err, html){
      if (err) return fn(err);
      comments.html = html;
      layout({ body: html }, function(err, html){
        if (err) return fn(err);
        env.log('render', path);
        --pending || fn();
      });
    });
  });
}

function page(locals, fn) {
  var options = { cache: true, locals: locals };
  jade.renderFile(__dirname + '/page.jade', options, fn);
}

function layout(locals, fn) {
  var options = { cache: true, locals: locals };
  jade.renderFile(__dirname + '/layout.jade', options, fn);
}