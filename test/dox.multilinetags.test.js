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
  'test .parseComments() multiline tags': function(done){
    fixture('multilinetags.js', function(err, str){
      var comments = dox.parseComments(str)
        , only = comments.shift()
        , first = comments.shift()
        , last = comments.shift()
        , mid = comments.shift()
        , onlyParam = comments.shift()
        , firstParam = comments.shift()
        , lastParam = comments.shift()
        , midParam = comments.shift()
        , onlyReturn = comments.shift()
        , firstReturn = comments.shift()
        , lastReturn = comments.shift()
        , midReturn = comments.shift()
        , example = comments.shift();

      only.tags.should.with.lengthOf(1);
      only.tags[0].string.should.equal('one\ntwo\nthree');
      first.tags.should.with.lengthOf(2);
      first.tags[0].string.should.equal('one\ntwo\nthree');
      first.tags[1].string.should.equal('last');
      last.tags.should.with.lengthOf(2);
      last.tags[0].string.should.equal('first');
      last.tags[1].string.should.equal('one\ntwo\nthree');
      mid.tags.should.with.lengthOf(3);
      mid.tags[0].string.should.equal('first');
      mid.tags[1].string.should.equal('one\ntwo\nthree');
      mid.tags[2].string.should.equal('last');

      onlyParam.tags.should.with.lengthOf(1);
      onlyParam.tags[0].type.should.equal('param');
      onlyParam.tags[0].name.should.equal('foo');
      onlyParam.tags[0].types.should.eql(['String']);
      onlyParam.tags[0].description.should.equal('one\ntwo\nthree');
      firstParam.tags.should.with.lengthOf(2);
      firstParam.tags[0].type.should.equal('param');
      firstParam.tags[0].name.should.equal('foo');
      firstParam.tags[0].types.should.eql(['String']);
      firstParam.tags[0].description.should.equal('one\ntwo\nthree');
      firstParam.tags[1].string.should.equal('last');
      lastParam.tags.should.with.lengthOf(2);
      lastParam.tags[0].string.should.equal('first');
      lastParam.tags[1].type.should.equal('param');
      lastParam.tags[1].name.should.equal('foo');
      lastParam.tags[1].types.should.eql(['String']);
      lastParam.tags[1].description.should.equal('one\ntwo\nthree');
      midParam.tags.should.with.lengthOf(3);
      midParam.tags[0].string.should.equal('first');
      midParam.tags[1].type.should.equal('param');
      midParam.tags[1].name.should.equal('foo');
      midParam.tags[1].types.should.eql(['String']);
      midParam.tags[1].description.should.equal('one\ntwo\nthree');
      midParam.tags[2].string.should.equal('last');

      onlyReturn.tags.should.with.lengthOf(1);
      onlyReturn.tags[0].type.should.equal('return');
      onlyReturn.tags[0].types.should.eql(['String']);
      onlyReturn.tags[0].description.should.equal('one\ntwo\nthree');
      firstReturn.tags.should.with.lengthOf(2);
      firstReturn.tags[0].type.should.equal('return');
      firstReturn.tags[0].types.should.eql(['String']);
      firstReturn.tags[0].description.should.equal('one\ntwo\nthree');
      firstReturn.tags[1].string.should.equal('last');
      lastReturn.tags.should.with.lengthOf(2);
      lastReturn.tags[0].string.should.equal('first');
      lastReturn.tags[1].type.should.equal('return');
      lastReturn.tags[1].types.should.eql(['String']);
      lastReturn.tags[1].description.should.equal('one\ntwo\nthree');
      midReturn.tags.should.with.lengthOf(3);
      midReturn.tags[0].string.should.equal('first');
      midReturn.tags[1].type.should.equal('return');
      midReturn.tags[1].types.should.eql(['String']);
      midReturn.tags[1].description.should.equal('one\ntwo\nthree');
      midReturn.tags[2].string.should.equal('last');

      example.tags.should.with.lengthOf(1);
      example.tags[0].string.should.equal('    test(one);\n    test(two);');
      done();
    });
  }
};

