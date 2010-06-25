
/*!
 * Dox
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Check if the given string of docs contains @ignore.
 *
 * @param {String} str
 * @return {Boolean}
 * @api public
 */

exports.ignore = function(str) {
    return str.indexOf('@ignore') >= 0;
}

/**
 * Check if the given string of docs appears to be private.
 *
 * @param {String} str
 * @return {Boolean}
 * @api public
 */

exports.isPrivate = function(str) {
    return str.indexOf('@private') >= 0
        || str.indexOf('@api private') >= 0;
}

/**
 * Convert the given string of jsdoc to markdown.
 *
 * @param {String} str
 * @return {String}
 * @api public
 */

exports.toMarkdown = function(str) {
    var first = true;
    return str
        .replace(/^((?:[A-Z]\w* ?)+):/gm, '## $1')
        .replace(/^ *@(\w+) *\{([^}]+)\}( *[^\n]+)?/gm, function(_, key, type, desc){
            var prefix = '';
            if (first) {
                first = false;
                prefix = '## \n';
            }
            return prefix + ' - **' + key + '**: _' + type.split(/ *[|\/] */).join(' | ') + '_ ' + (desc || '') + '\n';
        })
        .replace(/^ *@(\w+) *(\w+)/gm, ' - **$1**: _$2_\n');
}

/**
 * Escape the given string of html.
 *
 * Examples:
 *
 *     escape('<foo>');
 *     // => "&lt;foo&gt;"
 *
 * @param {String} html
 * @return {String}
 * @api public
 */

exports.escape = function(html){
    return String(html)
        .replace(/&(?!\w+;)/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}