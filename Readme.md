# Dox

 Dox is a JavaScript documentation generator written for [node](http://nodejs.org).

 Dox is a 2 hour product of my frustration with documentation generators. I wanted
 something that could parse my JavaScript using markdown and JSdoc tags, an easy
 to use CLI, as well as a single deployment file, no external css or js, one file!

## Features

  * Supports JSdoc
  * Markdown bodies
  * Custom title / description
  * Simple CLI `dox`
  * Single file generated
  * Generated navigation menu
  * Linked function definitions with references
  * Syntax highlighting

## Usage Examples

Simple example:

    $ dox --title Connect lib/connect/index.js

Lots of files:

    $ dox --title Connect --desc "markdown _here_" $(file lib/* -type f) > docs.html

## Usage

Output from `--help`:

    Usage: dox [options] <file ...>

	Options:
	  -t, --title      Project title
	  -d, --desc       Project description (markdown)
	  -s, --style      Document style, available: ["default"]
	  -J, --no-jsdoc   Disable jsdoc parsing (coverts to markdown)
	  -p, --private    Output private code in documentation
	  -h, --help       Display help information

