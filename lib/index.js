
/*!
 * Dox
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

require.paths.unshift(__dirname + '/koala/lib');
var sys = require('sys'),
    fs = require('fs'),
    path = require('path'),
    koala = require('koala'),
    markdown = require('markdown');

/**
 * Style name.
 */

var style = 'default';

/**
 * Project title.
 */

var title = 'Dont forget to use --title to specify me!';

/**
 * Parse JSDoc.
 */

var jsdoc = true;

/**
 * Project description.
 */

var desc = '';

/**
 * Usage.
 */

var usage = ''
    + 'Usage: dox [options] <file ...>\n'
    + '\n'
    + 'Options:\n'
    + '  -t, --title      Project title\n'
    + '  -d, --desc       Project description (markdown)\n'
    + '  -s, --style      Document style, available: ["default"]\n'
    + '  -J, --no-jsdoc   Disable jsdoc parsing (coverts to markdown)\n'
    + '  -h, --help       Display help information'
    + '\n';

/**
 * Log the given message.
 *
 * @param {String} msg
 * @api private
 */

function log(msg){
    sys.error('... ' + msg);
}

/**
 * Parse the given arguments.
 *
 * @param {Array} args
 * @api public
 */

exports.parse = function(args){
    var files = [];
    
    // Require an argument
    function requireArg(){
        if (args.length) {
            return args.shift();
        } else {
            throw new Error(arg + ' requires an argument.');
        }
    }

    // Parse arguments
    while (args.length) {
        var arg = args.shift();
        switch (arg) {
            case '-h':
            case '--help':
                sys.puts(usage);
                process.exit(1);
                break;
            case '-t':
            case '--title':
                title = requireArg();
                break;
            case '-d':
            case '--desc':
                desc = requireArg();
                break;
            case '-s':
            case '--style':
                style = requireArg();
                break;
            case '-J':
            case '--no-jsdoc':
                jsdoc = false;
                break;
            default:
                files.push(arg);
        }
    }
    
    if (files.length) {
        log('parsing ' + files.length + ' file(s)');
        var pending = files.length;
        
        // Style
        log('loading ' + style + ' style');
        var head = fs.readFileSync(__dirname + '/styles/' + style + '/head.html', 'utf8');
        var foot = fs.readFileSync(__dirname + '/styles/' + style + '/foot.html', 'utf8');
        var css = fs.readFileSync(__dirname + '/styles/' + style + '/style.css', 'utf8');
    
        // Substitutions
        head = head.replace(/\{\{title\}\}/g, title).replace(/\{\{style\}\}/, css);
        
        // Navigation
        log('generating navigation');
        var menu = '<ul id="menu">' + files.map(function(file){
            var basename = path.basename(file, '.js'),
                title = file.replace(basename, '<strong>' + basename + '</strong>').replace('.js', '');
            return '<li><a href="#' + file + '">' + title + '</a></li>'
        }).join('\n') + '</ul>';
        
        sys.print(head, menu);
        sys.print('<table id="source"><tbody>');
        
        // Render files
        var first = true;
        files.forEach(function(file){
            log('parsing ' + file);
            fs.readFile(file, 'utf8', function(err, str){
                if (err) throw err;
                if (first) {
                    if (desc) desc = markdown.parse(desc);
                    sys.print('<tr><td><h1>' + title + '</h1>' + desc + '</td><td></td></tr>');
                    first = false;
                }
                sys.print('<tr class="filename"><td><h2 id="' + file + '">' 
                    + path.basename(file, '.js') + '</h2></td><td>' 
                    + file + '</td></tr>');
                sys.print(render(str));
                --pending || sys.print(foot, '</tbody></table>');
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
            var part = part.replace(/^ *\* ?/gm, '');
            blocks.push({
               comment: markdown.parse(jsdocToMarkdown(escape(part))),
               code: koala.render('.js', escape(next)) 
            });
        }
    }

    // Generate html
    var html = [];
    for (var i = 0, len = blocks.length; i < len; ++i) {
        var block = blocks[i];
        html.push('<tr class="code">');
        html.push('<td class="docs">', block.comment || '', '</td>');
        html.push('<td class="code">', block.code
            ? '<pre><code>' + block.code + '</code></pre>'
            : '', '</td>');
        html.push('</tr>');
    }

    return html.join('\n');
};

/**
 * Convert the given string of jsdoc to markdown.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function jsdocToMarkdown(str) {
    return str
        .replace(/^((?:[A-Z]\w* ?)+):/gm, '## $1')
        .replace(/^ *@(\w+) *\{([^}]+)\}( *[^\n]+)?/gm, function(_, key, type, desc){
            return '- **' + key + '**: _' + type.split(/ *[|\/] */).join(' | ') + '_ ' + desc;
        })
        .replace(/^ *@(\w+) *(\w+)/gm, '- **$1**: _$2_');
}

/**
 * Escape the given string of html.
 *
 * Example:
 *
 *     escape('<foo>');
 *     // => "&lt;foo&gt;"
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

function escape(html){
    return String(html)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}