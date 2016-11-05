# changeline
Search and replace in lines of files across directories.

## Features and Concepts

Changeline accepts a list of files from the command line via STDIN.
This means you can use operating system utilities for file search.
example: find . -name test.html -print | changeline -t transformers.js -r -c;

Changeline uses es6 functions for searching an replacing, see transformers.js

Changeline makes backups see --help
