# changeline
Search and replace in lines of files across directories.

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
      -c, --cas                  Make cas backup before replacement.
      --cas-home [path]          Path of cas backups
      -b, --backup               Make backup before replacement.
      --backup-extension [ext]   Extension to use for backup files
      -r, --replace              Perform replacement.
      -t, --transformers [path]  Transformer module.


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

Copyright (c) 2016 Captain Fantasy
