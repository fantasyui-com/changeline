#!/usr/bin/env node

process.stdin.setEncoding('utf8');
const fs = require('fs');
const os = require('os');
const path = require('path');
const mkdirp = require('mkdirp');
const setup = require('commander');
const program = require('./program.js');
const readline = require('readline');
const casHome = path.join( os.homedir(), '.changeline', 'cas-backup' );

setup
  .version('1.0.0')
  .option('-v, --verbose', 'Make changeline verbose')
  .option('-c, --cas', 'Make cas backup before replacement.', true)
  .option('--cas-home [path]', 'Path of cas backups', casHome )
  .option('-b, --backup', 'Make backup before replacement.', false)
  .option('--backup-extension [ext]', 'Extension to use for backup files', '.bak')
  .option('-r, --replace', 'Perform replacement.', false)
  .option('-t, --transformers [path]', 'Transformer module.')
  .parse(process.argv);

  if(setup.verbose){
    console.log('Changeline is verbose!')
  }

  if (!fs.existsSync( setup.casHome )) {
    mkdirp(setup.casHome);
    console.error('Created casHome');
  }else{
    if(setup.verbose) console.log('casHome exists at: %s', setup.casHome);
  }

  if (!fs.existsSync(path.resolve(setup.transformers))) {
      console.error('Transformers not found.')
      console.error('See %s for example, then use -t/--transformers [path] to specify location of your own transformers file.', path.join(__dirname,'transformers.js') )
      process.exit(1)
  }else{
    if(setup.verbose) console.log('Transformers file exists.')
  }

const transformers = require(path.resolve(setup.transformers));

const stdin = readline.createInterface({ input: process.stdin });
// The program function is called each time a filepath arives on the STDIN.
// NOTE: the 'line' here represents a filepath from STDIN,
//       not a line in some file where replacements are happening,
//       no files are opened yet. These here are the instructions to open files.
stdin.on('line',(filepath)=>{program({setup, transformers, filepath})});
