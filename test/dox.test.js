
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
  'test .version': function(){
    dox.version.should.match(/^\d+\.\d+\.\d+$/);
  },
  
  'test .parseComments() blocks': function(){
    fixture('a.js', function(err, str){
      var comments = dox.parseComments(str)
        , file = comments.shift()
        , version = comments.shift();

        file.should.have.property('ignore', true);
        file.content.should.equal('<p>A\nCopyright (c) 2010 Author Name &lt;Author Email&gt;\nMIT Licensed</p>');
        file.description.should.equal('<p>A\nCopyright (c) 2010 Author Name &lt;Author Email&gt;\nMIT Licensed</p>');
        file.body.should.equal('');
        file.tags.should.be.empty;

        version.should.have.property('ignore', false);
        version.content.should.equal('<p>Library version.</p>');
        version.description.should.equal('<p>Library version.</p>');
        version.body.should.equal('');
        version.tags.should.be.empty;
    });
  },
  
  'test .parseComments() tags': function(){
    fixture('b.js', function(err, str){
      var comments = dox.parseComments(str);

      var version = comments.shift();
      version.content.should.equal('<p>Library version.</p>');
      version.description.should.equal('<p>Library version.</p>');
      version.tags.should.have.length(2);
      version.tags[0].type.should.equal('type');
      version.tags[0].types.should.eql(['String']);
      version.tags[1].type.should.equal('api');
      version.tags[1].visibility.should.equal('public');
      version.ctx.type.should.equal('property');
      version.ctx.receiver.should.equal('exports');
      version.ctx.name.should.equal('version');
      version.ctx.value.should.equal("'0.0.1'");

      var parse = comments.shift();
      parse.description.should.equal('<p>Parse the given <code>str</code>.</p>');
      parse.body.should.equal('<h2>Examples</h2>\n\n<p>   parse(str)\n   // =&gt; "wahoo"</p>');
      parse.content.should.equal('<p>Parse the given <code>str</code>.</p>\n\n<h2>Examples</h2>\n\n<p>   parse(str)\n   // =&gt; "wahoo"</p>');
      parse.tags[0].type.should.equal('param');
      parse.tags[0].name.should.equal('str');
      parse.tags[0].description.should.equal('to parse');
      parse.tags[0].types.should.eql(['String', 'Buffer']);
      parse.tags[1].type.should.equal('return');
      parse.tags[1].types.should.eql(['String']);
      parse.tags[2].visibility.should.equal('public');
    });
  },
  
  'test .parseComments() code': function(){
    fixture('b.js', function(err, str){
      var comments = dox.parseComments(str)
        , version = comments.shift()
        , parse = comments.shift();

      version.code.should.equal("exports.version = '0.0.1';");
      parse.code.should.equal('exports.parse = function(str) {\n  return "wahoo";\n}');
    });
  },

  'test .parseCodeContext() function statement': function(){
    var ctx = dox.parseCodeContext('function foo(){\n\n}');
    ctx.type.should.equal('function');
    ctx.name.should.equal('foo');
  },
  
  'test .parseCodeContext() function expression': function(){
    var ctx = dox.parseCodeContext('var foo = function(){\n\n}');
    ctx.type.should.equal('function');
    ctx.name.should.equal('foo');
  },
  
  'test .parseCodeContext() prototype method': function(){
    var ctx = dox.parseCodeContext('User.prototype.save = function(){}');
    ctx.type.should.equal('method');
    ctx.constructor.should.equal('User');
    ctx.name.should.equal('save');
  },
  
  'test .parseCodeContext() prototype property': function(){
    var ctx = dox.parseCodeContext('Database.prototype.enabled = true;\nasdf');
    ctx.type.should.equal('property');
    ctx.constructor.should.equal('Database');
    ctx.name.should.equal('enabled');
    ctx.value.should.equal('true');
  },
  
  'test .parseCodeContext() method': function(){
    var ctx = dox.parseCodeContext('user.save = function(){}');
    ctx.type.should.equal('method');
    ctx.receiver.should.equal('user');
    ctx.name.should.equal('save');
  },
  
  'test .parseCodeContext() property': function(){
    var ctx = dox.parseCodeContext('user.name = "tj";\nasdf');
    ctx.type.should.equal('property');
    ctx.receiver.should.equal('user');
    ctx.name.should.equal('name');
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
  },
  
  'test .parseTag() @return': function(){
    var tag = dox.parseTag('@return {String} a normal string');
    tag.type.should.equal('return');
    tag.types.should.eql(['String']);
    tag.description.should.equal('a normal string');
  }
};