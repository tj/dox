"use strict";

/**
 * Luke, I am your constructor.
 *
 * @param {Array} bar
 * @constructor
 */
function Foo(bar){
  this.bar = bar;
  this._seed = Math.random();
}

/**
 * To be relevant or not to be. This is the question.
 *
 * @namespace Foo
 */
Foo.prototype = {
  /**
   * Returns the first item.
   *
   * @returns {Number}
   */
  getFirst: function getFirstBarItem(){
    return this.bar[0];
  },
  /**
   * Returns the first item.
   * Acts as an ES5 alias of `Foo.prototype.getFirst` for feature sake.
   *
   * @see Foo.prototype.getFirst
   * @returns {Number}
   */
  get first(){
    return this.bar[0];
  },
  /**
   * Sets an internal property.
   *
   * @param {Number} s
   */
  set seed(s){
    this._seed = s;
  },
  /**
   * Anonymous function on property.
   *
   * @returns {number}
   */
  random: function(){
    return this._seed * 1337;
  }
};

/**
 * My only purpose is to check we do not inherit from any parent context.
 *
 * @returns {string}
 */
function breakingBad() {
  return "Meth";
}

/**
 * Returns the last item.
 *
 * ```javascript
 * var f = new Foo([1, 5, 10]);
 *
 * f.getLast() === 10;
 * ```
 *
 * @returns {Number}
 */
Foo.prototype.getLast = function getLast(){
  return this.bar[this.bar.length];
};