/* 

  # (NOT YET) A MARKDOWN PROCESSOR 

  ## TO DO
  
  - provide more test cases for prepareTextBlocks,matchTextBlocks, 
  - think about justification/solutions to leave or not empty lines

  ## BACKLOG
  - develop checks for valid input,
  - add support for other classical markdown components: 
    lists,etc...
*/

const fs = require('fs');
const readline = require('readline');
const jexpr = require('./jexpr.js');
const tproc = require('./tproc.js');

/*
  Given the path, open a text file that
  follows markdown formatting rules 
  and transform it into an html document
*/
if((filePath=process.argv[2])!==undefined) {

  const rl = readline.createInterface({
    input: fs.createReadStream(filePath)
  });

  let lineArray = [];

  rl.on('line', (line) => {
    tproc.prepareTextBlocks(line,lineArray);
  }).on('close',()=>{
    console.log(
      jexpr.arrayToHTML(
        tproc.consMDSections(lineArray)));
  });

}

