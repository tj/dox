
/**
 * Module dependencies.
 */

var jade = require('jade')
  , fs = require('fs');

module.exports = function(env){
  var pending = env.paths.length;

  // render pages
  env.paths.forEach(function(path){
    var comments = env.files[path];
    page({ comments: comments, filename: path }, function(err, html){
      if (err) throw err;
      comments.html = html;
      layout({ body: html }, function(err, html){
        if (err) throw err;
        env.log('render', path);
        --pending || done();
      });
    });
  });
};

function page(locals, fn) {
  var options = { cache: true, locals: locals };
  jade.renderFile(__dirname + '/page.jade', options, fn);
}

function layout(locals, fn) {
  var options = { cache: true, locals: locals };
  jade.renderFile(__dirname + '/layout.jade', options, fn);
}