
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
  
  'test .parseComments()': function(){
    fixture('a.js', function(err, str){
      var comments = dox.parseComments(str);
      comments.should.have.length(2);

      var file = comments.shift()
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
  }
};