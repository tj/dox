
/**
 * Module dependencies.
 */

var markdown = require('github-flavored-markdown')
  , jade = require('jade')
  , stylus = require('stylus')
  , nib = require('nib')
  , fs = require('fs');

module.exports = function(env){
  // index
  if (env.options.index) {
    fs.readFile(env.options.index, 'utf8', function(err, str){
      if (err) throw err;
      env.options.description = str;
    });
  }

  // assets
  fs.mkdir(env.dest + '/public', 0755, function(err){
    if (err && 'EEXIST' != err.code) throw err;

    // style
    style(__dirname + '/public/main.styl'
      , env.dest + '/public/main.css'
      , function(err){
        if (err) throw err;
        env.log('compile', env.dest + '/main.css');
      });

    // javascript
    copy(__dirname + '/public/main.js'
      , env.dest + '/public/main.js'
      , function(err){
        if (err) throw err;
        env.log('copy', env.dest + '/public/main.js')
      });
  });

  // pages
  renderPages(env, function(err){
    if (err) throw err;
    outputPages(env, function(err){
      if (err) throw err;
      outputIndex(env, function(err){
        if (err) throw err;
      });
    });
  });

  process.on('exit', function(){
    env.log('compile', 'complete');
  });
};

function copy(from, to, fn) {
  fs.readFile(from, function(err, buf){
    if (err) return fn(err);
    fs.writeFile(to, buf, fn);
  });
}

function outputIndex(env, fn) {
  var locals = {
      files: env.files
    , options: env.options
    , markdown: markdown.parse
  };

  index(locals, function(err, html){
    if (err) return fn(err);
    var dest = env.dest + '/index.html';
    fs.writeFile(dest, html, function(err){
      if (err) return fn(err);
      env.log('compile', dest);
      fn();
    });
  });
}

function outputPages(env, fn) {
  var pending = env.paths.length;

  fs.mkdir(env.dest + '/pages', 0755, done);

  function done(){
    env.paths.forEach(function(path){
      var comments = env.files[path]
        , html = comments.html
        , href = 'pages/' + path.replace(/\//g, '-') + '.html'
        , dest = env.dest + '/' + href;
      comments.dest = href;
      fs.writeFile(dest, html, function(err){
        if (err) return fn(err);
        env.log('compile', dest);
        --pending || fn();
      });
    });
  }
}

function renderPages(env, fn) {
  var pending = env.paths.length;
  env.paths.forEach(function(path){
    var comments = env.files[path];
    page({ comments: comments, filename: path, options: env.options }, function(err, html){
      if (err) return fn(err);
      comments.html = html;
      env.log('render', path);
      --pending || fn();
    });
  });
}

function style(from, to, fn) {
  fs.readFile(from, 'utf8', function(err, str){
    if (err) return fn(err);
    stylus(str)
      .set('filename', from)
      .use(nib())
      .render(function(err, css){
        if (err) return fn(err);
        fs.writeFile(to, css, fn);  
      });
  });
}

function page(locals, fn) {
  var options = { cache: true, locals: locals };
  jade.renderFile(__dirname + '/page.jade', options, fn);
}

function index(locals, fn) {
  var options = { cache: true, locals: locals };
  jade.renderFile(__dirname + '/index.jade', options, fn);
}

