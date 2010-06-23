
/*!
 * Dox
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var sys = require('sys'),
    fs = require('fs');

/**
 * Style name.
 */

var style = 'default';

/**
 * Document title.
 */

var title = 'Dont forget to use --title to specify me!';

/**
 * Parse JSDoc.
 */

var jsdoc = true;

/**
 * Parse the given arguments.
 *
 * @param {Array} args
 * @api public
 */

exports.parse = function(args){
    var files = [];
    
    // Parse arguments
    while (args.length) {
        var arg = args.shift();
        switch (arg) {
            default:
                files.push(arg);
        }
    }
    
    if (files.length) {
        var pending = files.length;
        
        // Style
        var head = fs.readFileSync(__dirname + '/styles/' + style + '/head.html', 'utf8');
        var foot = fs.readFileSync(__dirname + '/styles/' + style + '/foot.html', 'utf8');
        var css = fs.readFileSync(__dirname + '/styles/' + style + '/style.css', 'utf8');
    
        // Substitutions
        head = head.replace(/\{\{title\}\}/g, title).replace(/\{\{style\}\}/, css);
        
        sys.print(head);
        
        files.forEach(function(file){
            fs.readFile(file, 'utf8', function(err, str){
                if (err) throw err;
                sys.print(render(str));
                --pending || sys.print(foot);
            });
        });
        
    } else {
        throw new Error('files required.');
    }
};

/**
 * Generate html for the given string of code.
 *
 * @param {String} str
 * @return {String}
 * @api public
 */

var render = exports.render = function(str){
    var parts = str.split(/\s*\/\*([^]+?)\*\/\s*/g),
        blocks = [];

    // Populate blocks
    for (var i = 0, len = parts.length; i < len; ++i) {
        var part = parts[i],
            next = parts[i + 1] || '';
        // Empty
        if (/^\s*$/.test(part)) {
            continue;
        // Ignored comment
        } else if (/^!\s*\*/.test(part)) {
            continue;
        } else {
            ++i;
            var part = part
                .replace(/^ *\*/gm, '');
            blocks.push({
               comment: part,
               code: next 
            });
        }
    }

    // Generate html
    var html = ['<table>'];
    for (var i = 0, len = blocks.length; i < len; ++i) {
        var block = blocks[i];
        html.push('<tr>');
        html.push('<td class="comment">', block.comment
            ? '<pre>' + block.comment + '</pre>'
            : '', '</td>');
        html.push('<td class="code">', block.code
            ? '<pre class="code">' + block.code + '</pre>'
            : '', '</td>');
        html.push('</tr>');
    }

    return html.concat('</table>').join('\n');
}