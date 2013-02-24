var obj1 = {

  /**
   * Literal function "add"
   * @param {number} a first number
   * @param {number} b second number
   * @return {number} the sum of a and b
   */
  add: function(a, b) {
    return a + b;
  },

  /**
   * Literal function "subtract" with space
   * @param {number} a first number
   * @param {number} b second number
   * @return {number} a less b
   */
  subtract: function (a, b) {
    return a - b;
  },
  
  /**
   * Literal property
   * @type {number}
   */
  count: 42
};

var obj2 = createClass( 
  /** @lends User.prototype */
  {

    /**
     * Lended Literal function "add"
     * @param {number} a first number
     * @param {number} b second number
     * @return {number} the sum of a and b
     */
    add: function(a, b) {
      return a + b;
    },
  
    /**
     * Lended Literal property
     * @type {number}
     */
    count: 42
  }
);
