/**
 * Throw a snowball.
 *
 * @fires Hurl#snowball
 */
Hurl.prototype.snowball = function() {
    /**
     * Snowball event.
     *
     * @event Hurl#snowball
     * @property {boolean} isPacked - Indicates whether the snowball is tightly packed.
     * @api public
     */
    this.emit('snowball', {
        isPacked: this._snowball.isPacked
    });
};
