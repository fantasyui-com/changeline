# changeline
Search and replace in lines of files across directories.

Changeline is your basic file search and replace. But it goes beyond regular
expressions and paths. You must submit a list of files via STDIN, so it is up to you
to select a directory scan program. You can use UNIX find with a *.html wildcard for example.

Furthermore, there is no question about matches spanning lines. Changeline simply sees one line at a time. It uses node readline under the hood.

Finally, changeline is a precision device aimed at altering lines of code without
the need for AST processing. You can for example target CSS Class Names in .css/.html
and .js/es6 files, and it will plow through ES7 and CSS4 and whatever else comes its way.

## Installation
[changeline](https://www.npmjs.com/package/changeline) is a command line program, and it is installed via [npm](https://www.npmjs.com) which comes along with [node](https://nodejs.org).
Please install [node](https://nodejs.org) first, and then run ```npm install -g changeline``` to get changeline onto your system.

## Usage

After installation via ```npm install -g changeline``` you should begin by
piping in a list of files separated by a new line.
Example of making a dynamic list ```find . -name example.html -print```
or ```cat my-files-to-change.txt```
where my-files-to-change.txt contains a list of full paths to files needing changes.

Upon a list of paths arriving via STDIN changeline will apply functions to test,
and replace data. See test-transformers.js for a more serious example.

    module.exports = [
      // JS
      {
        description: "Update bark to meow.",
        search: function(line){ if(line === 'bark') return true; },
        replace: function(line){ return 'meow' },
      },
      // ES6
      {
        description: "Update Bort to Bart.",
        search: line => line === 'Bort',
        replace: line => 'Bart',
      },
    ]



Usage: changeline [options]

    Options:

      -h, --help                 output usage information
      -V, --version              output the version number

      -v, --verbose              Make changeline verbose

The CAS backup concept is similar to [Content Addressable Storage](https://en.wikipedia.org/wiki/Content-addressable_storage) prior to
altering a file a copy is saved in ~/.changeline a simple index keeps track of
hashes, timestamps and original file locations.

      -c, --cas                  Make cas backup before replacement. (recommended)
      --cas-home [path]          Path of cas backups (optional)

A plain old filename.ext.bak is available as well.
      -b, --backup               Make backup before replacement. (optional)
      --backup-extension [ext]   Extension to use for backup files (optional)

You must use the -r/-t flags to do useful things:

      -r, --replace              Perform replacement (required for actual replacement)
      -t, --transformers [path]  Transformer module. (required for specifying what to replace)

The transformer format is ES6 by default and very easy to manage:

    module.exports = [
      {
        description: "Update Bort to Bart.",
        search: line => line === 'Bort', // return truthy value to trigger replace
        replace: line => 'Bart', // return updated line content
      },
    ]


## Features and Concepts

Changeline accepts a list of files from the command line via STDIN.
This means you can use operating system utilities for file search.
example: find . -name test.html -print | changeline -t transformers.js -r -c;

Changeline uses es6 functions for searching an replacing, see transformers.js

Changeline makes backups see --help

## Snippets

A quick non-destructive one-liner, run it in changeline's directory:

```cp test.html test-tmp.html; echo -e "\nBEFORE"; cat test-tmp.html; echo; find . -name test-tmp.html -print | ./index.js -v -r -c -t ./test-transformers.js; echo -e "\nAFTER"; cat test-tmp.html; echo; rm test-tmp.html;```

## Links

npm: https://www.npmjs.com/package/changeline  
github: https://github.com/fantasyui-com/changeline

## MIT License

Written by Captain Fantasy, Copyright (c) 2016 FantasyUI
