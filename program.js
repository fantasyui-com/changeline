const path = require('path');
const shortid = require('shortid');
const crypto = require('crypto');
const fs = require('fs');
const readline = require('readline');
const chash = crypto.createHash('sha1');

module.exports = function( { setup, transformers, filepath } ){

  const inputFilePath = path.resolve(filepath);
  if(setup.verbose) console.log('inputFilePath: %s',inputFilePath);
  const outputFilePath = path.resolve(filepath + '.changeline-'+shortid()+'-tmp');
  const backupFilePath = path.resolve(filepath + setup.backupExtension);
  const currentFileReadStream = readline.createInterface({ input: fs.createReadStream(inputFilePath), });
  let currentFileWriteStream;
  let lineNumber = 0;

  if( (setup.verbose) && (setup.casHome) ){
    console.log('INFO: cas backup home is at %s', setup.casHome)
  }

  if( (setup.verbose) && (!setup.replace) ){
    console.log('WARN: No file/line replacements will be performed; because "-r" argument is not present on command line.')
  }

  if(setup.replace === true) {
    currentFileWriteStream = fs.createWriteStream(outputFilePath, { flags: 'w', defaultEncoding: 'utf8', mode: 0o666, });
  }

  currentFileReadStream.on('line', (line) => {
    lineNumber++;

    transformers.forEach(item => {
      if(item.search.bind(item)(line)){

        if(setup.replace === true){
          if(setup.verbose) console.log('INFO: line match was found on line %d for "%s" and replacement was made.', lineNumber, item.description);
          line = item.replace.bind(item)(line);
        }else{
          if(setup.verbose) console.log('WARN: line match was found on line %d for "%s" but no replacement will be made; because "-r" argument is not present on command line.', lineNumber, item.description);
        }

      }
    });

    if(setup.replace === true){
      currentFileWriteStream.write(line+"\n");
    }

  });

  currentFileReadStream.on('close', () => {

    if(setup.replace === true){

      currentFileWriteStream.end();
      if(setup.verbose) console.log('DEBUG: Closed temporary file "%s" with changes.', outputFilePath);

      // Standard Backup Strategy, where by default a .bak file is saved
      if(setup.backup) {
        fs.renameSync(inputFilePath, backupFilePath);
        if(setup.verbose) console.log('saved a backup to: %s', backupFilePath);
      }

      // CAS Backup Strategy
      if(setup.cas){
        if(setup.verbose) console.log('cas backup enabled');
        const input = fs.createReadStream(inputFilePath);

        input.on('readable', () => {
          var data = input.read();

          if (data) {
            chash.update(data);
          } else {
            let hash = chash.digest('hex').toString();
            let indexFilePath = path.join( setup.casHome,  'index');
            let logData = hash + ' ' + (new Date()).toString().replace(/ /g,'_') + ' ' + inputFilePath + '\n';

            fs.appendFile(indexFilePath, logData , function (err) {
              if(setup.verbose) console.log('cas index (%s) logData written: %s',indexFilePath, logData.trim());
              let casFilePath = path.join( setup.casHome,  hash);
              fs.renameSync(inputFilePath, casFilePath)
              // by copy version fs.createReadStream(inputFilePath).pipe(fs.createWriteStream(casFilePath));
              if(setup.verbose) console.log('cas backup made, renamed %s to %s',inputFilePath, casFilePath);
              fs.renameSync(outputFilePath, inputFilePath)
              if(setup.verbose) console.log('file updated, renamed %s to %s', outputFilePath, inputFilePath);
            });

          }
        });

      } else { // cas not enabled

        if(setup.verbose) console.log('WARN: no cas backup was performed, file was altered withut backup.');
        fs.renameSync(outputFilePath, inputFilePath);
        if(setup.verbose) console.log('file updated, renamed %s to %s', outputFilePath, inputFilePath);

      }

    } else { // replace not enabled
      if(setup.verbose) console.log('WARN: No change to file %s; because "-r" is not present', inputFilePath);
    }

  }); // end of currentFileReadStream.on('close'...
}
