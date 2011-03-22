
/**
 * Module dependencies.
 */

var dox = require('../')
  , should = require('should');

module.exports = {
  'test .version': function(){
    dox.version.should.match(/^\d+\.\d+\.\d+$/);
  }
};