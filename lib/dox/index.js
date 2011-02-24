
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
    utils = require('./utils'),
    markdown = require('./markdown/lib/markdown');

/**
 * Library version.
 */

var version = '0.0.4';

/**
 * Style name.
 *
 * @type String
 */

var style = 'default';

/**
 * Project title.
 *
 * @type String
 */

var title = 'Dont forget to use --title to specify me!';

/**
 * Parse JSDoc.
 *
 * @type Boolean
 */

var jsdoc = true;

/**
 * Project description.
 *
 * @type String
 */

var desc = '';

/**
 * Intro text file name.
 *
 * @type String
 */

var intro = '';

/**
 * Show private code.
 *
 * @type Boolean
 */

var showPrivate = false;

/**
 * Github url for the ribbon.
 *
 * @type String
 */

var ribbon = '';

/**
 * Usage documentation.
 */

var usage = ''
    + 'Usage: dox [options] <file ...>\n'
    + '\n'
    + 'Options:\n'
    + '  -t, --title STR   Project title\n'
    + '  -d, --desc STR    Project description (markdown)\n'
    + '  -i, --intro FILE  Intro file (markdown)\n'
    + '  -r, --ribbon URL  Github ribbon url\n'
    + '  -s, --style NAME  Document style, available: ["default"]\n'
    + '  -J, --no-jsdoc    Disable jsdoc parsing (coverts to markdown)\n'
    + '  -p, --private     Output private code in documentation\n'
    + '  -v, --version     Output dox library version\n'
    + '  -h, --help        Display help information'
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
            case '-v':
            case '--version':
                sys.puts(version);
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
            case '-i':
            case '--intro':
                intro = requireArg();
                break;
            case '-s':
            case '--style':
                style = requireArg();
                break;
            case '-J':
            case '--no-jsdoc':
                jsdoc = false;
                break;
            case '-p':
            case '--private':
                showPrivate = true;
                break;
            case '-r':
            case '--ribbon':
                ribbon = requireArg();
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

        if (intro)
          desc = (desc || '') + fs.readFileSync(intro, 'utf8');

        // Substitutions
        head = head.replace(/\{\{title\}\}/g, title).replace(/\{\{style\}\}/, css);

        // Ribbon
        if (ribbon) {
            log('generating ribbon');
            sys.print('<a href="' + ribbon + '">'
                  + '<img alt="Fork me on GitHub" id="ribbon"'
                  + ' src="http://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png">'
                  + '</a>');
        }

        sys.print(head);
        sys.print('<table id="source"><tbody>');

        // Render files
        var first = true;
        files.forEach(function(file){
            log('parsing ' + file);
            fs.readFile(file, 'utf8', function(err, str){
                if (err) throw err;
                if (first) {
                    if (desc) desc = markdown.toHTML(desc);
                    sys.print('<tr><td><h1>' + title + '</h1>' + desc + '</td><td></td></tr>');
                    first = false;
                }
                sys.print('<tr class="filename"><td><h2 id="' + file + '"><a href="#">'
                    + path.basename(file, '.js') + '</a></h2></td><td>'
                    + file + '</td></tr>');
                sys.print(render(str, file));
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
 *  - foo
 *    - bar
 *  - baz
 *
 * @param {String} str
 * @param {String} file
 * @return {String}
 * @api public
 */

var render = exports.render = function(str, file){
    var parts = str.split(/\s*\/\*([^]+?)\*\/\s*/g),
        blocks = [];

    // Populate blocks, when there is only one part then no docstrings were
    // found and a single 'code' block should be shown to the right
    if (parts.length == 1) {
        blocks.push({
           comment: markdown.toHTML("Undocumented"),
           code: koala.render(".js", utils.escape(parts[0]))
        });
    } else {
        for (var i = 0, len = parts.length; i < len; ++i) {
            var part = parts[i];

            // Empty
            if (/^\s*$/.test(part)) {
                continue;
            // Ignored comment
            } else if (/^!\s*\*/.test(part)) {
                continue;
            } else {

                // Support @ignore and --private
                if (utils.ignore(part) || (utils.isPrivate(part) && !showPrivate)) {
                    ++i;
                    continue;

                // String looks like a comment. In this case next should be a
                // code block
                } else if (/^ *\* ?/gm.test(part)) {
                    ++i;
                    var part = part.replace(/^ *\* ?/gm, '');
                    comment = markdown.toHTML(utils.toMarkdown(part));
                    next = parts[i] || '';

                // String is a code block. In this case there is no comment for
                // it and it should go to the right. This is the case for files
                // do not necessarily begin with comments or files that begin
                // with a shebang
                } else {
                    comment = "";
                    next = part;
                }

                blocks.push({
                   comment: comment,
                   code: koala.render(".js", utils.escape(next))
                });
            }
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
