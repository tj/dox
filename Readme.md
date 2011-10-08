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

This output can then be passed to a template for rendering.

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

