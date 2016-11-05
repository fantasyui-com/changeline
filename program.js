const path = require('path');
const shortid = require('shortid');
const crypto = require('crypto');
const fs = require('fs');
const readline = require('readline');
const chash = crypto.createHash('sha1');
module.exports = function({setup, transformers, filepath}){
  const inputFilePath = path.resolve(filepath);
  if(setup.verbose) console.log('inputFilePath: %s',inputFilePath);
  const outputFilePath = path.resolve(filepath + '.changeline-'+shortid()+'-tmp');
  const backupFilePath = path.resolve(filepath + setup.backupExtension);
  const currentFileReadStream = readline.createInterface({ input: fs.createReadStream(inputFilePath), });
  let currentFileWriteStream;
  if((setup.verbose) && (!setup.replace)){
    console.log('No replacement will be made.')
  }
  if(setup.replace === true){
    currentFileWriteStream = fs.createWriteStream(outputFilePath, { flags: 'w', defaultEncoding: 'utf8', mode: 0o666, });
  }
  currentFileReadStream.on('line', (line) => {
    transformers.forEach(item => {
      if(item.search.bind(item)(line)){
        if(setup.replace === true){
          line = item.replace.bind(item)(line);
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
      if(setup.verbose) console.log('closed: %s', outputFilePath);
      if(setup.backup) {
        fs.renameSync(inputFilePath, backupFilePath);
        if(setup.verbose) console.log('saved a backup to: %s', backupFilePath);
      }
      if(setup.cas){
        if(setup.verbose) console.log('cas backup enabled');
        const input = fs.createReadStream(inputFilePath);
        input.on('readable', () => {
          var data = input.read();
          if (data)
            chash.update(data);
          else {
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
      }else{
        if(setup.verbose) console.log('no cas backup');
        fs.renameSync(outputFilePath, inputFilePath)
        if(setup.verbose) console.log('file updated, renamed %s to %s', outputFilePath, inputFilePath);
      }
    }
  });
}
