# Dox

 Dox is a JavaScript documentation generator written with [node](http://nodejs.org). Dox no longer generates an opinionated structure or style for your docs, it simply gives you a JSON representation, allowing you to use _markdown_ and _JSDoc_-style tags.

## Installation

Install from npm:

    $ npm install -g dox

## Usage Examples

`dox(1)` operates over stdio:

    $ dox < utils.js

utils.js:

```js
/**
 * Escape the given `html`.
 *
 * @param {String} html string to be escaped
 * @return {String} escaped html
 * @api public
 */

exports.escape = function(html){
  return String(html)
    .replace(/&(?!\w+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};
```

output JSON:

```json
[
  {
    "tags": [
      {
        "type": "param",
        "types": ["String"],
        "name": "html",
        "description": "string to be escaped"
      },
      {
        "type": "return",
        "types": ["String"],
        "description": "escaped html"
      },
      {
        "type": "api",
        "visibility": "public"
      }
    ],
    "description": {
      "full": "<p>Escape the given <code>html</code>.</p>",
      "summary": "<p>Escape the given <code>html</code>.</p>",
      "body": ""
    },
    "isPrivate": false,
    "ignore": false,
    "code": "exports.escape = function(html){\n  return String(html)\n    .replace(/&(?!\\w+;)/g, '&amp;')\n    .replace(/</g, '&lt;')\n    .replace(/>/g, '&gt;');\n};",
    "ctx": {
      "type": "method",
      "receiver": "exports",
      "name": "escape",
      "string": "exports.escape()"
    }
  }
]
```

This output can then be passed to a template for rendering. Look below at the "Properties" section for details.

## Usage

```

Usage: dox [options]

Options:

  -h, --help     output usage information
  -v, --version  output the version number
  -D, --debug    output parsed comments for debugging

Examples:

  # stdin
  $ dox > myfile.json

  # operates over stdio
  $ dox < myfile.js > myfile.json

```

## Properties

  A "comment" is comprised of the following detailed properties:
  
    - tags
    - description
    - isPrivate
    - ignore
    - code
    - ctx

### Description

  A dox description is comprised of three parts, the "full" description,
  the "summary", and the "body". The following example has only a "summary",
  as it consists of a single paragraph only, therefore the "full" property has
  only this value as well.

```js
/**
 * Output the given `str` to _stdout_.
 */

exports.write = function(str) {
  console.log(str);
};
````
yields:

```js
description: 
     { full: '<p>Output the given <code>str</code> to <em>stdout</em>.</p>',
       summary: '<p>Output the given <code>str</code> to <em>stdout</em>.</p>',
       body: '' },
```
