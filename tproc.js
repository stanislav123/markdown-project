/*
  # DATA DESCRIPTION

  Line is a string, it doesn't include "\n".

  TextBlock is a string that can be split by a "\n" into 
  a sequence of non-empty Lines (i.e. Lines that doesn't consist only of whitespace).

  Title is a one-line TextBlock that matches the regex: ^\s*#.*$ 

  MDSection is an Array of type:
  - [Natural,Title,TextBlock,TextBlock,...],
  represents a section of a markdown document,
  with a nesting level as first element, 
  title as a second element followed by an arbitrary 
  number of paragraphs.

*/
const assert = require('assert');

let reTitle = /^\s*(#+)(.*)$/;
let reEmpty = /^[\s]*$/;
let reTextBlock = /(?:(.+)(\n|$))+/g; // greedy, match TextBlock


/* Line Array<Line> -> Void
    populate accArr with Lines leaving only
    non-empty Lines and null between TextBlocks; 
    start recording after the first non-empty line 

   ASSUME:
   - data conforms to rules, i.e. the first non-empty 
     Line is a Title, etc.
*/
function prepareTextBlocks(line,accArr) {
  if((match=line.match(reEmpty))!==null) {
    if(accArr.length!==0
      &&accArr[accArr.length-1]!==null) {
      accArr.push(null);
    }
  } else {
    accArr.push(line);
  }
}

/* Array<null|String> -> Array<MDSection> 
   construct array of MDSections
*/
function consMDSections(lineArr) {
  let accArr = [];
  let astr = lineArr.join('\n');
  while ((match = reTextBlock.exec(astr))!==null) {
    if((title=match[0].slice(0,-1).match(reTitle))!==null) {
      accArr.push([title[1].length,title[2].trim()]);
    } else {
      // assuming the first element already exists
      // due to the previous assumption that input conforms to rules
      if(match[2]=='\n') {
        accArr[accArr.length-1].push(match[0].slice(0,-1));
      } else {
        accArr[accArr.length-1].push(match[0]);
      }
    }
  }
  return accArr;
}

/* Array<String|null> -> Array<MDSection> 
   ...
function consMDSections2(lineArr) {
  let accArr = [];
  let astr = lineArr.join('\n');
  while ((match = reTextBlock.exec(astr))!==null) {
    if((title=match[0].slice(0,-1).match(reTitle))!==null) {
      accArr.push(title[1].length);
      accArr.push(title[2].trim());
    } else {
      if(match[2]=='\n') {
        accArr.push(match[0].slice(0,-1));
      } else {
        accArr.push(match[0]);
      }
    }
  }
  return accArr;
}
assert.deepEqual(
  consMDSections2(textArr),
  [1,"Hello","This is a test\nand some line",2,"Chapter 1"]);
*/

// TESTS
if(true) {

  let text1 = `
# Hello


This is a test
and some line

## Chapter 1

  `;

  let textArr = [];
  text1.split('\n').forEach((line)=>{
    prepareTextBlocks(line,textArr);
  });
  assert.deepEqual(
    textArr,
    ["# Hello",null,"This is a test",
     "and some line",null,"## Chapter 1",null]);

 assert.deepEqual(
  consMDSections(textArr),
  [
    [1,"Hello","This is a test\nand some line"],
    [2,"Chapter 1"],
  ]);

}

exports.prepareTextBlocks = prepareTextBlocks;
exports.consMDSections = consMDSections;
