/**
 * Output the given `str` to _stdout_
 * or the stream specified by `options`.
 *
 * Options:
 *
 *   - `stream` defaulting to _stdout_
 *
 * Examples:
 *
 *     mymodule.write('foo')
 *     mymodule.write('foo', { stream: process.stderr })
 *
 */

exports.write = function(str, options) {
  options = options || {};
  (options.stream || process.stdout).write(str);
};
