
/**
 * Does a lot of foo
 *
 * @constructor
 * @param {String} bar
 */
function Foo(bar) {
  this.bar = bar
}

/**
 * A property of an instance of Foo
 * @type {String}
 */
Foo.prototype.property = 'this is a property'

/**
 * A method of an instance of Foo
 * @return {Boolean}
 */
Foo.prototype.method = function () {
  return false
}
