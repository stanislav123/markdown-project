/*
  # DATA DESCRIPTION

  Line is a string that ends with \n

  TextBlock is a sequence of non-empty lines 

  Title is a line that starts with a sequence of # characters

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
    populate accArr with lines leaving only
    non-empty lines and null between sequences
    of non-empty lines; start recording after
    the first non-empty line 

   ASSUME:
   - data conforms to rules, i.e. the first non-empty 
     line is a title, etc.
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
   match TextBlocks and differentiate
   between titles and paragraphs, record result
   to accArr
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
   match TextBlocks and differentiate
   between titles and paragraphs, record result
   to accArr
*/
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

 assert.deepEqual(
  consMDSections2(textArr),
  [1,"Hello","This is a test\nand some line",2,"Chapter 1"]);

}

exports.prepareTextBlocks = prepareTextBlocks;
exports.consMDSections = consMDSections;
