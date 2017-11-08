/* 

  # (NOT YET) A MARKDOWN PROCESSOR 

  ## TEXT FILE FORMATTING RULES

  Titles and paragraphs must be delimited by \n.

  The first TextBlock must be a Title.
  The first title must necessarily start with just one hash char.
  It is the only title with one hash in the document.

  All following titles must start with >1 #.
  If the following title contains more than the previous,
  the difference should not exceed 1.

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
  Given the path, open a text file
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

