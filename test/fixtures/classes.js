
/*
 * A Foo.
 * @class FooBar
 * @extends Foo
 */
export default class FooBar extends Foo {

    /*
     * construct a Foo
     * @constructor
     * @param {Object} options constructor options
     */
    constructor(options) {
        this.options = options
    }

    /*
     * Method of the Foo class.
     * @return {Overflow}
     */
    bar() {
        return 99999999999999999999999999999999999999999999999999999999999999999
    }

    /*
     * Setter for the blah property.
     */
    set blah() {
        this.blah = "blah"
    }

    /*
     * Getter for the blah property.
     * @return {String}
     */
    get blah() {
        return this.blah
    }
}

/*
 * @class Baz
 */
export class Baz extends FooBar {

    /*
     * @param {Object} options constructor options
     */
    constructor(options) {
        this.options = options
    }
}

/*
 * @class Lorem
 */
class Lorem {
    constructor(options) {
        this.options = options
    }
}
