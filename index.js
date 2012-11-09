
module.exports = require('./lib/dox');

var dox_coffee = require('./lib/dox_coffee');
module.exports.parseCommentsCoffee = dox_coffee.parseCommentsCoffee
module.exports.parseCodeContextCoffee = dox_coffee.parseCodeContextCoffee
