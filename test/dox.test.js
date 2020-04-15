
/**
 * Module dependencies.
 */

var dox = require('../')
  , should = require('should')
  , fs = require('fs');

function fixture(name, fn) {
  fs.readFile(__dirname + '/fixtures/' + name, 'utf8', fn);
}

module.exports = {
  'test .parseComments() blocks': function(done){
    fixture('a.js', function(err, str){
      var comments = dox.parseComments(str)
        , file = comments.shift()
        , version = comments.shift();
      file.should.have.property('ignore', true);
      file.description.full.should.equal('<p>A<br />\nCopyright (c) 2010 Author Name <Author Email><br />\nMIT Licensed</p>');
      file.description.summary.should.equal('<p>A<br />\nCopyright (c) 2010 Author Name <Author Email><br />\nMIT Licensed</p>');
      file.description.body.should.equal('');
      file.tags.should.be.empty;
      file.line.should.equal(2);
      file.codeStart.should.equal(7);

      version.should.have.property('ignore', false);
      version.description.full.should.equal('<p>Library version.</p>');
      version.description.summary.should.equal('<p>Library version.</p>');
      version.description.body.should.equal('');
      version.tags.should.be.empty;
      version.line.should.equal(8);
      version.codeStart.should.equal(12);
      done();
    });
  },

  'test .parseComments() tags': function(done){
    fixture('b.js', function(err, str){
      var comments = dox.parseComments(str);

      var version = comments.shift();
      version.description.summary.should.equal('<p>Library version.</p>');
      version.description.full.should.equal('<p>Library version.</p>');
      version.tags.should.have.length(2);
      version.tags[0].type.should.equal('type');
      version.tags[0].types.should.eql(['String']);
      version.tags[0].string.should.equal('{String}');
      version.tags[1].type.should.equal('api');
      version.tags[1].visibility.should.equal('public');
      version.tags[1].string.should.equal('public');
      version.ctx.type.should.equal('property');
      version.ctx.receiver.should.equal('exports');
      version.ctx.name.should.equal('version');
      version.ctx.value.should.equal("'0.0.1'");
      version.line.should.equal(2);
      version.codeStart.should.equal(9);

      var parse = comments.shift();
      parse.description.summary.should.equal('');
      parse.tags[0].type.should.equal('param');
      parse.tags[0].name.should.equal('config');
      parse.tags[0].description.should.equal('<p>An object that must provide a <code>requestExecutor</code> field.</p>');
      parse.tags[0].types.should.eql(['Object']);
      parse.line.should.equal(12);
      parse.codeStart.should.equal(15);
      done();
    });
  },

  'test .parseComments() complex': function(done){
    fixture('c.js', function(err, str){
      var comments = dox.parseComments(str);

      var file = comments.shift();

      file.tags.should.be.empty;
      // the following doesn't work as gh-md now obfuscates emails different on every pass
      //file.description.full.should.equal('<p>Dox<br />\nCopyright (c) 2010 TJ Holowaychuk <a href=\'mailto:tj@vision-media.ca\'>tj@vision-media.ca</a><br />\nMIT Licensed</p>');
      file.description.full.should.be.type('string');
      file.ignore.should.be.true;
      file.line.should.equal(2);
      file.codeStart.should.equal(7);

      var mods = comments.shift();
      mods.tags.should.be.empty;
      mods.description.full.should.equal('<p>Module dependencies.</p>');
      mods.description.summary.should.equal('<p>Module dependencies.</p>');
      mods.description.body.should.equal('');
      mods.ignore.should.be.false;
      mods.code.should.equal('var markdown = require(\'github-flavored-markdown\').parse;');
      mods.ctx.type.should.equal('declaration');
      mods.ctx.name.should.equal('markdown');
      mods.ctx.value.should.equal('require(\'github-flavored-markdown\').parse');
      mods.line.should.equal(8);
      mods.codeStart.should.equal(12);

      var version = comments.shift();
      version.tags.should.be.empty;
      version.description.full.should.equal('<p>Library version.</p>');
      version.line.should.equal(14);
      version.codeStart.should.equal(18);

      var parseComments = comments.shift();
      parseComments.tags.should.have.length(4);
      parseComments.ctx.type.should.equal('method');
      parseComments.ctx.receiver.should.equal('exports');
      parseComments.ctx.name.should.equal('parseComments');
      parseComments.description.full.should.equal('<p>Parse comments in the given string of <code>js</code>.</p>');
      parseComments.description.summary.should.equal('<p>Parse comments in the given string of <code>js</code>.</p>');
      parseComments.description.body.should.equal('');
      parseComments.line.should.equal(20);
      parseComments.codeStart.should.equal(29);

      var parseComment = comments.shift();
      parseComment.tags.should.have.length(4);
      parseComment.description.summary.should.equal('<p>Parse the given comment <code>str</code>.</p>');
      parseComment.description.full.should.equal('<p>Parse the given comment <code>str</code>.</p>\n<h2>The comment object returned contains the following</h2>\n<ul>\n<li><code>tags</code>  array of tag objects</li>\n<li><code>description</code> the first line of the comment</li>\n<li><code>body</code> lines following the description</li>\n<li><code>content</code> both the description and the body</li>\n<li><code>isPrivate</code> true when &quot;@api private&quot; is used</li>\n</ul>');
      parseComment.description.body.should.equal('<h2>The comment object returned contains the following</h2>\n<ul>\n<li><code>tags</code>  array of tag objects</li>\n<li><code>description</code> the first line of the comment</li>\n<li><code>body</code> lines following the description</li>\n<li><code>content</code> both the description and the body</li>\n<li><code>isPrivate</code> true when &quot;@api private&quot; is used</li>\n</ul>');
      parseComment.line.should.equal(75);
      parseComment.codeStart.should.equal(92);

      var parseTag = comments.shift();
      parseTag.line.should.equal(120);
      parseTag.codeStart.should.equal(128);

      // Should be the comment be parsed ?
      var shouldNotFail = comments.shift();
      shouldNotFail.line.should.equal(133);
      shouldNotFail.codeStart.should.equal(134);

      var parseTagTypes = comments.shift();
      parseTagTypes.tags.should.have.length(3);
      parseTagTypes.description.full.should.equal('<p>Parse tag type string &quot;{Array|Object}&quot; etc.</p>');
      parseTagTypes.line.should.equal(164);
      parseTagTypes.codeStart.should.equal(172);

      var escape = comments.pop();
      escape.tags.should.have.length(4);
      escape.tags[3].string.should.equal('With `Markdown` syntax');
      escape.tags[3].html.should.equal('<p>With <code>Markdown</code> syntax</p>');
      escape.description.full.should.equal('<p>Escape the given <code>html</code>.</p>');
      escape.ctx.type.should.equal('function');
      escape.ctx.name.should.equal('escape');
      escape.line.should.equal(253);
      escape.codeStart.should.equal(262);
      done();
    });
  },

  'test .parseComments() tags with tabs': function (done) {
    fixture('d-tabs.js', function (err, str) {
      var comments = dox.parseComments(str)
         , first = comments.shift();

      first.tags.should.have.length(4);
      first.description.full.should.equal('<p>Parse tag type string &quot;{Array|Object}&quot; etc.</p>');
      first.description.summary.should.equal('<p>Parse tag type string &quot;{Array|Object}&quot; etc.</p>');
      first.description.body.should.equal('');
      first.ctx.type.should.equal('method');
      first.ctx.receiver.should.equal('exports');
      first.ctx.name.should.equal('parseTagTypes');
      first.code.should.equal('exports.parseTagTypes = function(str) {\n\treturn str\n\t\t.replace(/[{}]/g, \'\')\n\t\t.split(/ *[|,\\/] */);\n};');
      first.line.should.equal(2);
      first.codeStart.should.equal(11);
      done();
    });
  },

  'test .parseComments() tags with spaces': function (done) {
    fixture('d-spaces.js', function (err, str) {
      var comments = dox.parseComments(str)
         , first = comments.shift();

      first.tags.should.have.length(4);
      first.description.full.should.equal('<p>Parse tag type string &quot;{Array|Object}&quot; etc.</p>');
      first.description.summary.should.equal('<p>Parse tag type string &quot;{Array|Object}&quot; etc.</p>');
      first.description.body.should.equal('');
      first.ctx.type.should.equal('method');
      first.ctx.receiver.should.equal('exports');
      first.ctx.name.should.equal('parseTagTypes');
      first.code.should.equal('exports.parseTagTypes = function(str) {\n  return str\n    .replace(/[{}]/g, \'\')\n    .split(/ *[|,\\/] */);\n};');
      first.line.should.equal(2);
      first.codeStart.should.equal(11);
      done();
    });
  },

  'test .parseComments() tags with mixed whitespace': function (done) {
    fixture('d-mixed.js', function (err, str) {
      var comments = dox.parseComments(str)
         , first = comments.shift();

      first.tags.should.have.length(4);
      first.description.full.should.equal('<p>Parse tag type string &quot;{Array|Object}&quot; etc.</p>');
      first.description.summary.should.equal('<p>Parse tag type string &quot;{Array|Object}&quot; etc.</p>');
      first.description.body.should.equal('');
      first.ctx.type.should.equal('method');
      first.ctx.receiver.should.equal('exports');
      first.ctx.name.should.equal('parseTagTypes');
      first.code.should.equal('exports.parseTagTypes = function(str) {\n\treturn str\n\t\t.replace(/[{}]/g, \'\')\n\t\t.split(/ *[|,\\/] */);\n};');
      first.line.should.equal(2);
      first.codeStart.should.equal(11);
      done();
    });
  },

  'test .parseComments() prototypes': function (done){
    fixture('prototypes.js', function(err, str){
      var comments = dox.parseComments(str)

      comments.should.be.an.instanceOf(Array);
      comments.should.have.lengthOf(3);

      // constructor
      comments[0].description.full.should.equal('<p>Does a lot of foo</p>');
      comments[0].ctx.type.should.be.equal('constructor');
      comments[0].ctx.name.should.be.equal('Foo');
      comments[0].ctx.string.should.be.equal('Foo()');
      comments[0].line.should.equal(2);
      comments[0].codeStart.should.equal(8);

      comments[1].description.full.should.equal('<p>A property of an instance of Foo</p>');
      comments[1].ctx.type.should.be.equal('property');
      comments[1].ctx.name.should.be.equal('property');
      comments[1].ctx.string.should.be.equal('Foo.prototype.property');
      comments[1].line.should.equal(12);
      comments[1].codeStart.should.equal(16);

      comments[2].description.full.should.equal('<p>A method of an instance of Foo</p>');
      comments[2].ctx.type.should.be.equal('method');
      comments[2].ctx.name.should.be.equal('method');
      comments[2].ctx.string.should.be.equal('Foo.prototype.method()');
      comments[2].line.should.equal(18);
      comments[2].codeStart.should.equal(22);

      done();
    });
  },

  'test .parseComments() classes': function (done){
    fixture('classes.js', function(err, str){
      var comments = dox.parseComments(str)

      comments.should.be.an.instanceOf(Array);
      comments.should.have.lengthOf(12);

      // class, extends and is exported as default
      comments[0].description.full.should.equal('<p>A Foo.</p>');
      comments[0].ctx.type.should.be.equal('class');
      comments[0].ctx.name.should.be.equal('FooBar');
      comments[0].ctx.constructor.should.be.equal('FooBar');
      comments[0].ctx.extends.should.be.equal('Foo.Baz');
      comments[0].ctx.string.should.be.equal('new FooBar()');
      comments[0].line.should.equal(2);
      comments[0].codeStart.should.equal(7);

      // class constructor
      comments[1].description.full.should.equal('<p>construct a Foo</p>');
      comments[1].ctx.type.should.be.equal('constructor');
      comments[1].ctx.name.should.be.equal('constructor');
      comments[1].ctx.constructor.should.be.equal('FooBar');
      comments[1].ctx.string.should.be.equal('FooBar.prototype.constructor()');
      comments[1].line.should.equal(9);
      comments[1].codeStart.should.equal(14);

      // class method
      comments[2].description.full.should.equal('<p>Method of the Foo class.</p>');
      comments[2].ctx.type.should.be.equal('method');
      comments[2].ctx.name.should.be.equal('bar');
      comments[2].ctx.constructor.should.be.equal('FooBar');
      comments[2].ctx.string.should.be.equal('FooBar.prototype.bar()');
      comments[2].line.should.equal(18);
      comments[2].codeStart.should.equal(22);

      // class static method
      comments[3].description.full.should.equal('<p>Static method of the Foo class.</p>');
      comments[3].ctx.type.should.be.equal('method');
      comments[3].ctx.name.should.be.equal('staticMethod');
      comments[3].ctx.constructor.should.be.equal('FooBar');
      comments[3].ctx.string.should.be.equal('FooBar.staticMethod()');
      comments[3].line.should.equal(26);
      comments[3].codeStart.should.equal(30);

      // class static generator method
      comments[4].description.full.should.equal('<p>Static generator method of the Foo class.</p>');
      comments[4].ctx.type.should.be.equal('method');
      comments[4].ctx.name.should.be.equal('*staticGeneratorMethod');
      comments[4].ctx.constructor.should.be.equal('FooBar');
      comments[4].ctx.string.should.be.equal('FooBar.*staticGeneratorMethod()');
      comments[4].line.should.equal(34);
      comments[4].codeStart.should.equal(38);

      // class generator method with computed name
      comments[5].description.full.should.equal('<p>Generator method with computed name.</p>');
      comments[5].ctx.type.should.be.equal('method');
      comments[5].ctx.name.should.be.equal('*[Symbol.iterator]');
      comments[5].ctx.constructor.should.be.equal('FooBar');
      comments[5].ctx.string.should.be.equal('FooBar.prototype.*[Symbol.iterator]()');
      comments[5].line.should.equal(42);
      comments[5].codeStart.should.equal(46);

      // class setter
      comments[6].description.full.should.equal('<p>Setter for the blah property.</p>');
      comments[6].ctx.type.should.be.equal('property');
      comments[6].ctx.name.should.be.equal('blah');
      comments[6].ctx.constructor.should.be.equal('FooBar');
      comments[6].ctx.string.should.be.equal('FooBar.prototype.blah');
      comments[6].line.should.equal(50);
      comments[6].codeStart.should.equal(53);

      // class getter
      comments[7].description.full.should.equal('<p>Getter for the blah property.</p>');
      comments[7].ctx.type.should.be.equal('property');
      comments[7].ctx.name.should.be.equal('blah');
      comments[7].ctx.constructor.should.be.equal('FooBar');
      comments[7].ctx.string.should.be.equal('FooBar.prototype.blah');
      comments[7].line.should.equal(57);
      comments[7].codeStart.should.equal(61);

      // class, extends and is exported by name
      comments[8].description.full.should.equal('');
      comments[8].ctx.type.should.be.equal('class');
      comments[8].ctx.name.should.be.equal('Baz');
      comments[8].ctx.constructor.should.be.equal('Baz');
      comments[8].ctx.extends.should.be.equal('FooBar');
      comments[8].ctx.string.should.be.equal('new Baz()');
      comments[8].line.should.equal(67);
      comments[8].codeStart.should.equal(70);

      // class constructor
      comments[9].description.full.should.equal('');
      comments[9].ctx.type.should.be.equal('constructor');
      comments[9].ctx.name.should.be.equal('constructor');
      comments[9].ctx.constructor.should.be.equal('Baz');
      comments[9].ctx.string.should.be.equal('Baz.prototype.constructor()');
      comments[9].line.should.equal(72);
      comments[9].codeStart.should.equal(75);

      // class
      comments[10].description.full.should.equal('');
      comments[10].ctx.type.should.be.equal('class');
      comments[10].ctx.name.should.be.equal('Lorem');
      comments[10].ctx.constructor.should.be.equal('Lorem');
      comments[10].ctx.extends.should.be.equal('');
      comments[10].ctx.string.should.be.equal('new Lorem()');
      comments[10].line.should.equal(80);
      comments[10].codeStart.should.equal(83);

      // class extended by assigment expression
      comments[11].description.full.should.equal('');
      comments[11].ctx.type.should.be.equal('class');
      comments[11].ctx.name.should.be.equal('Ipsum');
      comments[11].ctx.constructor.should.be.equal('Ipsum');
      comments[11].ctx.extends.should.be.equal('mixin(Foo.Bar, Baz)');
      comments[11].ctx.string.should.be.equal('new Ipsum()');
      comments[11].line.should.equal(89);
      comments[11].codeStart.should.equal(92);

      done();
    });
  },

  'test .parseComments() inline prototypes': function (done){
    fixture('prototypes-inline.js', function(err, str){
      var comments = dox.parseComments(str)

      comments.should.be.an.instanceOf(Array);
      comments.should.have.lengthOf(8);

      // constructor
      comments[0].description.full.should.equal('<p>Luke, I am your constructor.</p>');
      comments[0].ctx.type.should.be.equal('constructor');
      comments[0].ctx.name.should.be.equal('Foo');
      comments[0].ctx.string.should.be.equal('Foo()');

      // prototype object
      comments[1].description.full.should.equal('<p>To be relevant or not to be. This is the question.</p>');
      comments[1].ctx.type.should.be.equal('prototype');
      comments[1].ctx.name.should.be.equal('Foo');
      comments[1].ctx.string.should.be.equal('Foo.prototype');

      // property as a named method function
      comments[2].description.full.should.equal('<p>Returns the first item.</p>');
      comments[2].ctx.type.should.be.equal('method');
      comments[2].ctx.name.should.be.equal('getFirst');
      comments[2].ctx.string.should.be.equal('Foo.prototype.getFirst()');

      // getter function
      comments[3].description.full.should.equal('<p>Returns the first item.<br />\nActs as an ES5 alias of <code>Foo.prototype.getFirst</code> for feature sake.</p>');
      comments[3].ctx.type.should.be.equal('property');
      comments[3].ctx.name.should.be.equal('first');
      comments[3].ctx.string.should.be.equal('Foo.prototype.first');

      // setter function
      comments[4].description.full.should.equal('<p>Sets an internal property.</p>');
      comments[4].ctx.type.should.be.equal('property');
      comments[4].ctx.name.should.be.equal('seed');
      comments[4].ctx.string.should.be.equal('Foo.prototype.seed');

      // property as an anonymous method function
      comments[5].description.full.should.equal('<p>Anonymous function on property.</p>');
      comments[5].ctx.type.should.be.equal('method');
      comments[5].ctx.name.should.be.equal('random');
      comments[5].ctx.string.should.be.equal('Foo.prototype.random()');

      // this should be a separated function
      comments[6].description.full.should.equal('<p>My only purpose is to check we do not inherit from any parent context.</p>');
      comments[6].ctx.type.should.be.equal('function');
      comments[6].ctx.name.should.be.equal('breakingBad');

      // classical prototype function property
      comments[7].description.full.should.equal('<p>Returns the last item.</p>\n<pre><code class="lang-javascript">var f = new Foo([1, 5, 10]);\n\nf.getLast() === 10;\n</code></pre>');
      comments[7].ctx.type.should.be.equal('method');
      comments[7].ctx.name.should.be.equal('getLast');
      comments[7].ctx.string.should.be.equal('Foo.prototype.getLast()');

      done();
    });
  },

  'test .parseComments() literal inline': function (done){
    fixture('literal-inline.js', function(err, str){
      var comments = dox.parseComments(str)

      comments.should.be.an.instanceOf(Array);
      comments.should.have.lengthOf(5);

      // parent target
      comments[0].description.full.should.equal('<p>Targeted literal</p>');
      comments[0].ctx.type.should.be.equal('declaration');
      comments[0].ctx.name.should.be.equal('Target');
      comments[0].ctx.string.should.be.equal('Target');

      // literal property
      comments[1].description.full.should.equal('<p>Sub object</p>');
      comments[1].ctx.type.should.be.equal('property');
      comments[1].ctx.name.should.be.equal('options');
      comments[1].ctx.string.should.be.equal('options');

      // property as an anonymous method function
      comments[2].description.full.should.equal('<p>This function surely does something</p>');
      comments[2].ctx.type.should.be.equal('method');
      comments[2].ctx.name.should.be.equal('doSomething');
      comments[2].ctx.string.should.be.equal('doSomething()');

      // property as a named method function
      comments[3].description.full.should.equal('<p>And them something else</p>');
      comments[3].ctx.type.should.be.equal('method');
      comments[3].ctx.name.should.be.equal('doSomethingElse');
      comments[3].ctx.string.should.be.equal('doSomethingElse()');

     // getter function
      comments[4].description.full.should.equal('<p>This is the result of doing anything</p>');
      comments[4].ctx.type.should.be.equal('property');
      comments[4].ctx.name.should.be.equal('result');
      comments[4].ctx.string.should.be.equal('result');
      comments[4].ctx.value.should.be.equal('doAnything()');

      done();
    });
  },

  'test .parseComments() tag types': function (done){
    fixture('d.js', function(err, str){
      var comments = dox.parseComments(str);
      var first = comments.shift();
      first.tags.should.have.length(4);
      first.description.full.should.equal('<p>Parse tag type string &quot;{Array|Object}&quot; etc.</p>');
      first.description.summary.should.equal('<p>Parse tag type string &quot;{Array|Object}&quot; etc.</p>');
      first.description.body.should.equal('');
      first.ctx.type.should.equal('method');
      first.ctx.receiver.should.equal('exports');
      first.ctx.name.should.equal('parseTagTypes');
      first.code.should.equal('exports.parseTagTypes = function(str) {\n  return str\n    .replace(/[{}]/g, \'\')\n    .split(/ *[|,\\/] */);\n};');
      first.line.should.equal(2);
      first.codeStart.should.equal(11);
      done();
    });
  },

  'test .parseComments() code': function(done){
    fixture('b.js', function(err, str){
      var comments = dox.parseComments(str)
        , version = comments.shift()
        , parse = comments.shift();

      version.code.should.equal("exports.version = '0.0.1';");
      parse.code.should.equal('exports.parse = function(str) {\n  return "wahoo";\n}');
      done();
    });
  },

  'test .parseComments() titles': function(done){
    fixture('titles.js', function(err, str){
      var comments = dox.parseComments(str);
      comments[0].description.body.should.containEql('<h2>Some examples</h2>');
      comments[0].description.body.should.not.containEql('<h2>for example</h2>');
      comments[0].description.body.should.containEql('<h2>Some longer thing for example</h2>');
      comments[0].line.should.equal(2);
      comments[0].codeStart.should.equal(14);

      comments[1].description.full.should.equal('<p>Description 1</p>');
      comments[1].tags.should.have.length(2);
      comments[1].tags[0].type.should.equal('description');
      comments[1].tags[0].full.should.equal('Description 2');
      comments[1].tags[1].type.should.equal('description');
      comments[1].tags[1].full.should.equal('Description 3');

      comments[2].description.full.should.equal('<p>Something Else</p>');
      done();
    });
  },

  'test .parseComments() code with a multi-line comment on a single line': function(done){
    fixture('single-multiline.js', function(err, str){
      var comments = dox.parseComments(str);

      comments[0].description.full.should.equal('<p>Normal multiline doc block</p>');
      comments[1].description.full.should.equal('<p>Single-line multiline block</p>');
      comments[2].description.full.should.equal('<p>Unspaced-line multiline block</p>');
      comments[3].description.full.should.equal('<p>argument A</p>');
      comments[4].description.full.should.equal('<p>argument B</p>');

      done();
    });
  },

  'test .parseCodeContext() function statement': function(){
    var ctx = dox.parseCodeContext('function $foo(){\n\n}');
    ctx.type.should.equal('function');
    ctx.name.should.equal('$foo');
  },

  'test .parseCodeContext() returned unnamed function statement': function(){
    var ctx = dox.parseCodeContext('return function (){\n\n}');
    ctx.type.should.equal('function');
    ctx.name.should.equal('');
  },

  'test .parseCodeContext() returned named function statement': function(){
    var ctx = dox.parseCodeContext('return function $foo (){\n\n}');
    ctx.type.should.equal('function');
    ctx.name.should.equal('$foo');
  },

  'test .parseCodeContext() function expression': function(){
    var ctx = dox.parseCodeContext('var $foo = function(){\n\n}');
    ctx.type.should.equal('function');
    ctx.name.should.equal('$foo');
  },

  'test .parseCodeContext() prototype method': function(){
    var ctx = dox.parseCodeContext('$User.prototype.$save = function(){}');
    ctx.type.should.equal('method');
    ctx.constructor.should.equal('$User');
    ctx.name.should.equal('$save');
  },

  'test .parseCodeContext() prototype property': function(){
    var ctx = dox.parseCodeContext('$Database.prototype.$enabled = true;\nasdf');
    ctx.type.should.equal('property');
    ctx.constructor.should.equal('$Database');
    ctx.name.should.equal('$enabled');
    ctx.value.should.equal('true');
  },

  'test .parseCodeContext() prototype property with value==null': function(){
    var ctx = dox.parseCodeContext('Database.prototype.$enabled = null;\nasdf');
    ctx.type.should.equal('property');
    ctx.constructor.should.equal('Database');
    ctx.name.should.equal('$enabled');
    ctx.string.should.equal('Database.prototype.$enabled');
    ctx.value.should.equal('null');
  },

  'test .parseCodeContext() prototype property without value': function(){
    var ctx = dox.parseCodeContext('Database.prototype.$enabled;\nasdf');
    ctx.type.should.equal('property');
    ctx.constructor.should.equal('Database');
    ctx.name.should.equal('$enabled');
    ctx.string.should.equal('Database.prototype.$enabled');
    ctx.should.not.have.property('value');
  },

  'test .parseCodeContext() method': function(){
    var ctx = dox.parseCodeContext('$user.$save = function(){}');
    ctx.type.should.equal('method');
    ctx.receiver.should.equal('$user');
    ctx.name.should.equal('$save');
  },

  'test .parseCodeContext() property': function(){
    var ctx = dox.parseCodeContext('$user.$name = "tj";\nasdf');
    ctx.type.should.equal('property');
    ctx.receiver.should.equal('$user');
    ctx.name.should.equal('$name');
    ctx.value.should.equal('"tj"');
  },

  'test .parseCodeContext() declaration': function(){
    var ctx = dox.parseCodeContext('var $name = "tj";\nasdf');
    ctx.type.should.equal('declaration');
    ctx.name.should.equal('$name');
    ctx.value.should.equal('"tj"');
  },

  'test .parseTag() @constructor': function(){
    var tag = dox.parseTag('@constructor');
    tag.type.should.equal('constructor');
  },

  'test .parseTag() @see': function(){
    var tag = dox.parseTag('@see http://google.com');
    tag.type.should.equal('see');
    tag.title.should.equal('');
    tag.url.should.equal('http://google.com');

    var tag = dox.parseTag('@see Google http://google.com');
    tag.type.should.equal('see');
    tag.title.should.equal('Google');
    tag.url.should.equal('http://google.com');

    var tag = dox.parseTag('@see exports.parseComment');
    tag.type.should.equal('see');
    tag.local.should.equal('exports.parseComment');
   },

  'test .parseTag() @api': function(){
    var tag = dox.parseTag('@api private');
    tag.type.should.equal('api');
    tag.visibility.should.equal('private');
  },

  'test .parseTag() @type': function(){
    var tag = dox.parseTag('@type {String}');
    tag.type.should.equal('type');
    tag.types.should.eql(['String']);
  },

  'test .parseTag() @param': function(){
    var tag = dox.parseTag('@param {String|Buffer}');
    tag.type.should.equal('param');
    tag.types.should.eql(['String', 'Buffer']);
    tag.name.should.equal('');
    tag.description.should.equal('');
    tag.string.should.equal('{String|Buffer}');
    tag.optional.should.be.false;
  },

  'test .parseTag() @param optional': function(){
    var tag = dox.parseTag('@param {string} [foo]')
    tag.type.should.equal('param');
    tag.types.should.eql(['string']);
    tag.name.should.equal('[foo]');
    tag.description.should.equal('');
    tag.string.should.equal('{string} [foo]');
    tag.optional.should.be.true;

    var tag = dox.parseTag('@param {string=} foo')
    tag.type.should.equal('param');
    tag.types.should.eql(['string']);
    tag.name.should.equal('foo');
    tag.description.should.equal('');
    tag.string.should.equal('{string=} foo');
    tag.optional.should.be.true;

    var tag = dox.parseTag('@param {string?} foo')
    tag.type.should.equal('param');
    tag.types.should.eql(['string']);
    tag.name.should.equal('foo');
    tag.description.should.equal('');
    tag.string.should.equal('{string?} foo');
    tag.nullable.should.be.true;

    var tag = dox.parseTag('@param {string|Buffer=} foo')
    tag.type.should.equal('param');
    tag.types.should.eql(['string', 'Buffer']);
    tag.name.should.equal('foo');
    tag.description.should.equal('');
    tag.string.should.equal('{string|Buffer=} foo');
    tag.optional.should.be.true;
  },

  'test .parseTag() @return': function(){
    var tag = dox.parseTag('@return {String} a normal string');
    tag.type.should.equal('return');
    tag.types.should.eql(['String']);
    tag.description.should.equal('a normal string');
    tag.string.should.equal('{String} a normal string');
  },

  'test .parseTag() @augments': function(){
    var tag = dox.parseTag('@augments otherClass');
    tag.type.should.equal('augments');
    tag.otherClass.should.equal('otherClass')
    tag.string.should.equal('otherClass');
  },

  'test .parseTag() @author': function(){
    var tag = dox.parseTag('@author Bob Bobson');
    tag.type.should.equal('author');
    tag.string.should.equal('Bob Bobson');
  },

  'test .parseTag() @borrows': function(){
    var tag = dox.parseTag('@borrows foo as bar');
    tag.type.should.equal('borrows');
    tag.otherMemberName.should.equal('foo');
    tag.thisMemberName.should.equal('bar');
    tag.string.should.equal('foo as bar');
  },

  'test .parseTag() @memberOf': function(){
    var tag = dox.parseTag('@memberOf Foo.bar')
    tag.type.should.equal('memberOf')
    tag.parent.should.equal('Foo.bar')
    tag.string.should.equal('Foo.bar')
  },

  'test .parseTag() @example': function(){
    tag = dox.parseTag('@example\n    Foo.bar();', true);
    tag.type.should.equal('example')
    tag.string.should.equal('    Foo.bar();');
  },

  'test .parseTag() default': function(){
    var tag = dox.parseTag('@hello universe is better than world');
    tag.type.should.equal('hello');
    tag.string.should.equal('universe is better than world');
  },

  'test .parseComments() code with no comments': function(done){
    fixture('uncommented.js', function(err, str){
      var comments = dox.parseComments(str)
        , all = comments.shift();
      all.code.should.equal("function foo() {\n  doSomething();\n}");
      done();
    });
  },

  'test .parseComments() with a simple single line comment in code': function(done){
    fixture('singleline.js', function(err, str){
      var comments = dox.parseComments(str)
        , all = comments.shift();
      all.code.should.equal("function foo() {\n  // Maybe useful\n  doSomething();\n}");
      done();
    });
  },

  'test .parseComments() code with a comment without description': function(done){
    fixture('nodescription.js', function(err, str){
      var comments = dox.parseComments(str)
        , all = comments.shift();
      all.tags.should.have.length(1);
      all.tags[0].type.should.equal('return');
      all.tags[0].description.should.equal('<p>Digit</p>');
      all.tags[0].string.should.equal('{number} Digit');
      all.description.full.should.equal('');
      all.description.summary.should.equal('');
      all.description.summary.should.equal('');
      all.code.should.equal("function foo() {\n  return 1;\n}");
      all.line.should.equal(1);
      all.codeStart.should.equal(4);
      done();
    });
  },

  'test .api() without inline code in comments': function(done) {
    fixture('a.js', function(err, str){
      var comments = dox.parseComments(str);
      var apiDocs = dox.api(comments);
      apiDocs.should.equal("  - [exports.version](#exportsversion)\n\n## exports.version\n\n  <p>Library version.</p>\n");
      done();
    });
  },

  'test .parseComments() on single star comments with skipSingleStar=true': function (done) {
    fixture('single.js', function(err, str){
      var comments = dox.parseComments(str, { skipSingleStar: true });

      comments.should.have.lengthOf(1);
      comments[0].tags.should.be.empty;
      comments[0].code.should.be.equal(str.trim());
      comments[0].description.full.should.be.empty;
      done();
    });
  },

  'test .parseComments() on single star comments no options': function (done) {
    fixture('single.js', function(err, str){
      var comments = dox.parseComments(str);

      comments.should.have.lengthOf(1);
      comments[0].tags[0].should.be.eql({
          type: 'return'
        , types: [ 'Object' ]
        , typesDescription: '<code>Object</code>'
        , description: '<p>description</p>'
        , string: '{Object} description'
        , nullable: false
        , nonNullable: false
        , variable: false
        , optional: false
      });
      comments[0].description.full.should.be.equal('<p>foo description</p>');
      done();
    });
  },

  'test .api() with @alias flag': function(done){
    fixture('alias.js', function(err, str){
      var comments = dox.parseComments(str);
      var apiDocs = dox.api(comments);
      apiDocs.should.startWith("  - [hello()](#hello)\n  - [window.hello()](#windowhello)\n\n");
      done();
    });
  },

  'test .api() still includes parameters using functions': function(done){
    fixture('functions.js', function(err, str){
      var comments = dox.parseComments(str);
      var apiDocs = dox.api(comments);

      apiDocs.should.containEql("## fnName(a:String, b:Number)");
      done();
    });
  },

  'test .parseComments() does not interpret jshint directives as jsdoc': function (done) {
    fixture('jshint.js', function (err, str){
      var comments = dox.parseComments(str);
      comments.length.should.equal(1);
      comments[0].description.full.should.equal("<p>something else</p>");
      done();
    });
  },

  'test skipPrefix': function (done) {
    fixture('skip_prefix.js', function (err, str){
      var comments = dox.parseComments(str, {skipPrefixes: ["myspecialawesomelinter"]});
      comments.length.should.equal(1);
      comments[0].description.full.should.equal("<p>something else</p>");
      done();
    });
  },

  'test that */* combinations in code do not cause failures': function (done) {
    fixture('asterik.js', function (err, str){
      var comments = dox.parseComments(str);
      comments.length.should.equal(4);
      comments[0].description.full.should.equal("<p>One</p>");
      comments[0].ctx.type.should.equal('function');
      comments[0].ctx.name.should.equal('one');
      comments[1].description.full.should.equal("<p>Two</p>");
      comments[1].ctx.type.should.equal('function');
      comments[1].ctx.name.should.equal('two');

      comments[2].description.full.should.equal("<p>Three</p>");
      comments[2].ctx.type.should.equal('function');
      comments[2].ctx.name.should.equal('three');
      comments[3].description.full.should.equal("<p>Four</p>");
      comments[3].ctx.type.should.equal('function');
      comments[3].ctx.name.should.equal('four');
      done();
    });
  },

  'test that // in string literals does not cause failures': function (done) {
    fixture('slash.js', function (err, str){
      var comments = dox.parseComments(str);
      comments.length.should.equal(2);
      comments[0].description.full.should.equal("<p>One</p>");
      comments[1].description.full.should.equal("<p>Two</p>");
      done();
    });
  },

  'test event tags': function (done) {
    fixture('event.js', function (err, str){
      var comments = dox.parseComments(str);
      //console.log(comments);
      comments.length.should.equal(2);
      comments[0].description.full.should.equal("<p>Throw a snowball.</p>");
      comments[1].description.full.should.equal("<p>Snowball event.</p>");
      comments[0].isEvent.should.be.false;
      comments[1].isEvent.should.be.true;
      done();
    });
  },

  'test optional types for @enum': function (done) {
    fixture('enums.js', function (err, str){
      var comments = dox.parseComments(str);
      comments.length.should.equal(2);
      comments[0].description.full.should.equal("<p>FSM states.</p>");
      comments[0].tags[0].type.should.equal("enum");
      comments[0].tags[0].types.length.should.equal(0);
      comments[0].tags[0].string.should.equal("");

      comments[1].description.full.should.equal("<p>Colors.</p>");
      comments[1].tags[0].type.should.equal("enum");
      comments[0].tags[0].types.length.should.equal(0);
      comments[1].tags[0].string.should.equal("");
      done();
    });
  },

  'test optional types for @throws': function (done) {
    fixture('throws.js', function (err, str){
      var comments = dox.parseComments(str);
      comments.length.should.equal(2);
      comments[0].description.full.should.equal("<p>Raise an exception for fun.</p>");
      comments[0].tags[0].type.should.equal("throws");
      comments[0].tags[0].types.length.should.equal(0);
      comments[0].tags[0].string.should.equal("An error message.");
      comments[0].tags[0].description.should.equal("<p>An error message.</p>");

      comments[1].description.full.should.equal("<p>Validate user input.</p>");
      comments[1].tags[0].type.should.equal("throws");
      comments[1].tags[0].types[0].should.equal("TypeError");
      comments[1].tags[0].string.should.equal("{TypeError} Invalid argument.");
      comments[1].tags[0].description.should.equal("<p>Invalid argument.</p>");
      done();
    });
  },

  'Issue 169': function (done) {
    fixture('issue169.js', function (err, str){
      var comments = dox.parseComments(str);

      comments.length.should.equal(1);
      comments[0].description.full.should.equal("");
      comments[0].tags.length.should.equal(3);

      comments[0].tags[0].type.should.equal("fileoverview");
      comments[0].tags[0].string.should.equal("Takes two options objects and merges them");
      comments[0].tags[0].html.should.equal("<p>Takes two options objects and merges them</p>");

      comments[0].tags[1].type.should.equal("author");
      comments[0].tags[1].string.should.equal("Scott Nath");
      comments[0].tags[1].html.should.equal("<p>Scott Nath</p>");

      comments[0].tags[2].type.should.equal("requires");
      comments[0].tags[2].string.should.equal("NPM:lodash.merge");
      comments[0].tags[2].html.should.equal("<p>NPM:lodash.merge</p>");
      done();
    });
  },

  'test that quotes within strings are correctly handled': function (done) {
    fixture('string-quotes.js', function (err, str){
      var comments = dox.parseComments(str);
      comments.length.should.equal(8);
      comments[0].description.full.should.equal("<p>One</p>");
      comments[1].description.full.should.equal("<p>Two</p>");
      comments[2].description.full.should.equal("<p>Three</p>");
      comments[3].description.full.should.equal("<p>Four</p>");
      comments[4].description.full.should.equal("<p>Five</p>");
      comments[5].description.full.should.equal("<p>Six</p>");
      comments[6].description.full.should.equal("<p>Seven</p>");
      comments[7].description.full.should.equal("<p>Eight</p>");
      done();
    });
  },
};
