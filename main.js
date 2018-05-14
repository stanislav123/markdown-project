const FS = require('fs');
const READLINE = require('readline');
const PR_INPUT = require('./prinput.js');


if((filePath=process.argv[2])!==undefined) {

  const rl = READLINE.createInterface({
    input: FS.createReadStream(filePath)
  });

  PR_INPUT.processInputLines(rl);
}

