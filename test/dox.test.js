
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
      file.description.full.should.equal('<p>A<br />Copyright (c) 2010 Author Name <Author Email><br />MIT Licensed</p>');
      file.description.summary.should.equal('<p>A<br />Copyright (c) 2010 Author Name <Author Email><br />MIT Licensed</p>');
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
      version.tags[1].type.should.equal('api');
      version.tags[1].visibility.should.equal('public');
      version.ctx.type.should.equal('property');
      version.ctx.receiver.should.equal('exports');
      version.ctx.name.should.equal('version');
      version.ctx.value.should.equal("'0.0.1'");
      version.line.should.equal(2);
      version.codeStart.should.equal(8);

      var parse = comments.shift();
      parse.description.summary.should.equal('<p>Parse the given <code>str</code>.</p>');
      parse.description.body.should.equal('<h2>Examples</h2>\n\n<pre><code>parse(str)\n// =&amp;gt; "wahoo"\n</code></pre>');
      parse.description.full.should.equal('<p>Parse the given <code>str</code>.</p>\n\n<h2>Examples</h2>\n\n<pre><code>parse(str)\n// =&amp;gt; "wahoo"\n</code></pre>');
      parse.tags[0].type.should.equal('param');
      parse.tags[0].name.should.equal('str');
      parse.tags[0].description.should.equal('to parse');
      parse.tags[0].types.should.eql(['String', 'Buffer']);
      parse.tags[1].type.should.equal('return');
      parse.tags[1].types.should.eql(['String']);
      parse.tags[2].visibility.should.equal('public');
      parse.line.should.equal(11);
      parse.codeStart.should.equal(23);
      done();
    });
  },

  'test .parseComments() complex': function(done){
    fixture('c.js', function(err, str){
      var comments = dox.parseComments(str);

      var file = comments.shift();

      file.tags.should.be.empty;
      // the following doesn't work as gh-md now obfuscates emails different on every pass
      //file.description.full.should.equal('<p>Dox<br />Copyright (c) 2010 TJ Holowaychuk <a href=\'mailto:tj@vision-media.ca\'>tj@vision-media.ca</a><br />MIT Licensed</p>');
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
      parseComment.description.full.should.equal('<p>Parse the given comment <code>str</code>.</p><h2>The comment object returned contains the following</h2>\n<ul>\n<li><code>tags</code>  array of tag objects</li>\n<li><code>description</code> the first line of the comment</li>\n<li><code>body</code> lines following the description</li>\n<li><code>content</code> both the description and the body</li>\n<li><code>isPrivate</code> true when &quot;@api private&quot; is used</li>\n</ul>\n');
      parseComment.description.body.should.equal('<h2>The comment object returned contains the following</h2>\n<ul>\n<li><code>tags</code>  array of tag objects</li>\n<li><code>description</code> the first line of the comment</li>\n<li><code>body</code> lines following the description</li>\n<li><code>content</code> both the description and the body</li>\n<li><code>isPrivate</code> true when &quot;@api private&quot; is used</li>\n</ul>\n');
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
      escape.tags.should.have.length(3);
      escape.description.full.should.equal('<p>Escape the given <code>html</code>.</p>');
      escape.ctx.type.should.equal('function');
      escape.ctx.name.should.equal('escape');
      escape.line.should.equal(253);
      escape.codeStart.should.equal(261);
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

      // prototoype object
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
      comments[3].description.full.should.equal('<p>Returns the first item.<br />Acts as an ES5 alias of <code>Foo.prototype.getFirst</code> for feature sake.</p>');
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
      comments[7].description.full.should.equal('<p>Returns the last item.</p><pre><code class="lang-javascript">var f = new Foo([1, 5, 10]);\n\nf.getLast() === 10;\n</code></pre>\n');
      comments[7].ctx.type.should.be.equal('method');
      comments[7].ctx.name.should.be.equal('getLast');
      comments[7].ctx.string.should.be.equal('Foo.prototype.getLast()');

      done();
    });
  },

  'test .parseComments() tags': function (done){
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
    tag.optional.should.be.false;
  },

  'test .parseTag() @param optional': function(){
    var tag = dox.parseTag('@param {string} [foo]')
    tag.type.should.equal('param');
    tag.types.should.eql(['string']);
    tag.name.should.equal('[foo]');
    tag.description.should.equal('');
    tag.optional.should.be.true;

    var tag = dox.parseTag('@param {string=} foo')
    tag.type.should.equal('param');
    tag.types.should.eql(['string=']);
    tag.name.should.equal('foo');
    tag.description.should.equal('');
    tag.optional.should.be.true;

    var tag = dox.parseTag('@param {string?} foo')
    tag.type.should.equal('param');
    tag.types.should.eql(['string?']);
    tag.name.should.equal('foo');
    tag.description.should.equal('');
    tag.optional.should.be.true;

    var tag = dox.parseTag('@param {string|Buffer=} foo')
    tag.type.should.equal('param');
    tag.types.should.eql(['string', 'Buffer=']);
    tag.name.should.equal('foo');
    tag.description.should.equal('');
    tag.optional.should.be.true;
  },

  'test .parseTag() @return': function(){
    var tag = dox.parseTag('@return {String} a normal string');
    tag.type.should.equal('return');
    tag.types.should.eql(['String']);
    tag.description.should.equal('a normal string');
  },

  'test .parseTag() @augments': function(){
    var tag = dox.parseTag('@augments otherClass');
    tag.type.should.equal('augments');
    tag.otherClass.should.equal('otherClass')
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
  },

  'test .parseTag() @memberOf': function(){
    var tag = dox.parseTag('@memberOf Foo.bar')
    tag.type.should.equal('memberOf')
    tag.parent.should.equal('Foo.bar')
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
      all.tags[0].description.should.equal('Digit');
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
  }
};
