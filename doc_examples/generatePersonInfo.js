/**
 * Generates a person information string based on input.
 *
 * @param {string | {name: string, age: number | date}} name Name or person object
 * @param {{separator: string} =} options An options object
 * @return {string} The constructed information string
 */

exports.generatePersonInfo = function(name, options) {
  var str = '';
  var separator = options && options.separator ? options.separator : ' ';

  if(typeof name === 'object') {
    str = [name.name, '(', name.age, ')'].join(separator);
  } else {
    str = name;
  }
};
