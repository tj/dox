
/**
 * Module dependencies.
 */

var jade = require('jade')
  , fs = require('fs');

module.exports = function(env){
  renderPages(env, function(err){
    if (err) throw err;
    outputPages(env, function(err){
      if (err) throw err;
      env.log('compile', 'complete');
    });
  });
};

function outputPages(env, fn) {
  var pending = env.paths.length
    , dir = env.dest + '/pages';

  fs.mkdir(dir, 0755, done);

  function done(){
    env.paths.forEach(function(path){
      var comments = env.files[path]
        , html = comments.html
        , dest = dir + '/' + path.replace(/\//g, '-') + '.html';
      comments.dest = dest;
      fs.writeFile(dest, html, function(err){
        if (err) return fn(err);
        env.log('compile', path + ' -> ' + dest);
        --pending || fn();
      });
    });
  }
}

function renderPages(env, fn) {
  var pending = env.paths.length;
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