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
  'test .parseComments() jsdoc complex types': function(done){
    fixture('jsdoc-complex-types.js', function(err, str){
      var comments = dox.parseComments(str)
        , complexTypeParamAndReturn = comments.shift()
        , nestedComplexTypeParam = comments.shift()
        , optionalParam = comments.shift()
        , nullableParam = comments.shift()
        , nonNullableParam = comments.shift()
        , variableParam = comments.shift()
        , optionalVariableNullableParam = comments.shift();

      /////////////////////////////////////
      // complexTypeParamAndReturn
      /////////////////////////////////////
      complexTypeParamAndReturn.tags.should.with.lengthOf(3);
      complexTypeParamAndReturn.tags[0].types.should.be.eql([
        'number',
        'string',
        {
          name: ['string'],
          age: ['number']
        }
      ]);
      complexTypeParamAndReturn.tags[0].typesDescription.should
        .equal('<code>number</code>|<code>string</code>|{ name: <code>string</code>, age: <code>number</code> }');
      complexTypeParamAndReturn.tags[0].string.should
        .equal('{number|string|{name:string,age:number}} a');

      complexTypeParamAndReturn.tags[1].types.should.be.eql([
        'number',
        {
          name: ['string'],
          age: ['number']
        },
        'Array'
      ]);
      complexTypeParamAndReturn.tags[1].typesDescription.should
        .equal('<code>number</code>|{ name: <code>string</code>, age: <code>number</code> }|<code>Array</code>');
      complexTypeParamAndReturn.tags[1].string.should
        .equal('{number|{name:string,age:number}|Array} a');

      complexTypeParamAndReturn.tags[2].types.should.be.eql([
        {
          name: ['string'],
          age: ['number']
        }
      ]);
      complexTypeParamAndReturn.tags[2].typesDescription.should
        .equal('{ name: <code>string</code>, age: <code>number</code> }');
      complexTypeParamAndReturn.tags[2].string.should
        .equal('{{name:string,age:number}}');

      /////////////////////////////////////
      // nestedComplexTypeParam
      /////////////////////////////////////
      nestedComplexTypeParam.tags.should.with.lengthOf(1);
      nestedComplexTypeParam.tags[0].types.should.be.eql([
        'number',
        'string',
        {
          length: ['number'],
          type: [{
            name: [{
              first: ['string'],
              last: ['string']
            }],
            id: ['number', 'string']
          }]
        }
      ]);
      nestedComplexTypeParam.tags[0].string.should
        .equal('{number | string | {length: number, type: {name: {first: string, last: string}, id: number | string}}} a Description of param');

      /////////////////////////////////////
      // optionalParam
      /////////////////////////////////////
      optionalParam.tags.should.with.lengthOf(1);
      optionalParam.tags[0].optional.should.be.true;
      optionalParam.tags[0].string.should.equal('{number=} a');

      /////////////////////////////////////
      // nullableParam
      /////////////////////////////////////
      nullableParam.tags.should.with.lengthOf(1);
      nullableParam.tags[0].nullable.should.be.true;
      nullableParam.tags[0].string.should.equal('{?number} a');

      /////////////////////////////////////
      // nonNullableParam
      /////////////////////////////////////
      nonNullableParam.tags.should.with.lengthOf(1);
      nonNullableParam.tags[0].nonNullable.should.be.true;
      nonNullableParam.tags[0].string.should.equal('{!number} a');

      /////////////////////////////////////
      // variableParam
      /////////////////////////////////////
      variableParam.tags.should.with.lengthOf(1);
      variableParam.tags[0].variable.should.be.true;
      variableParam.tags[0].string.should.equal('{...number} a');

      /////////////////////////////////////
      // optionalVariableNullableParam
      /////////////////////////////////////
      optionalVariableNullableParam.tags.should.with.lengthOf(1);
      optionalVariableNullableParam.tags[0].optional.should.be.true;
      optionalVariableNullableParam.tags[0].variable.should.be.true;
      optionalVariableNullableParam.tags[0].nullable.should.be.true;
      optionalVariableNullableParam.tags[0].string.should.equal('{?...number=} a');

      done();
    });
  }
};

