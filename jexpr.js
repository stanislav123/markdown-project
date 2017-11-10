/* 
  # DATA DESCRIPTION

  JExpr is one of:
  - String
  - [String, JExpr1,..., JExprN]
  - [String, Attributes, JExpr1,..., JExprN]

  Attributes is an object where values are
  reduced to strings: {(string:string),*}

  Examples:
  1)
  ["UL",
    ["LI", "One"],
    ["LI", "Two"],
    ["LI", "Three"],
  ]

  2)
  ["SECTION",
    {"class":"main"},
    ["ARTICLE",["H1"]],
    ["ARTICLE"],
  ]

   
 Non-String-JExpr is a subset of
 JExpr: JExpr excluding a String clause

*/

const assert = require('assert');
const runTests = true;

/* Array<MDSection> -> JExpr
    turn docArr into JExpr
*/
if (runTests) {
  assert.deepEqual(
    composeDocument(
      [[1,"My Report"],[2,"Header 1","test"]]),
      ["MAIN",
        ["HEADER",["H1","My Report"]],
        ["SECTION",["HEADER",["H1","Header 1"]],["P","test"]]]);
}
function composeDocument(mdsecArr) {
  return mdsecArr.slice(1).reduce((result,elem,index)=>{
    return insertIntoJExpr(
      result,tagWithPs(elem.slice(1),"SECTION"),elem[0]-1);
  },tagWithPs(mdsecArr[0].slice(1),"MAIN"));
}

/* Array<String> String -> JExpr
   produce jexpr from aros;
   the first element is HEADING and
   the rest are P, all wrapped in tagName
   ASSUME: aros is not empty 
*/
if (runTests) {
  assert.deepEqual(
    tagWithPs(["One"],"SECTION"),["SECTION",["HEADER",["H1","One"]]]);
  assert.deepEqual(
    tagWithPs(["One","Two"],"SECTION"),["SECTION",["HEADER",["H1","One"]],["P","Two"]]);
  assert.deepEqual(
    tagWithPs(["One","Two","Three"],"SECTION"),["SECTION",["HEADER",["H1","One"]],["P","Two"],["P","Three"]]);
}
function tagWithPs(aros,tagName) {
  return [tagName,["HEADER",["H1",aros[0]]]].concat(
    aros.slice(1).reduce((parr,str)=>{
      parr.push(["P",str]);
      return parr;
    },[]));
}

/*
   Non-String-JExpr Jepxr [1..Natural] -> JExpr
   insert subJexpr as a last child of jexpr
   at nesting level indicated by level
   
*/
if (runTests) {
  assert.deepEqual(insertIntoJExpr(["SECTION"],["ARTICLE"],1),["SECTION",["ARTICLE"]]);
  assert.deepEqual(insertIntoJExpr(["SECTION",["ARTICLE"]],["ARTICLE"],1),["SECTION",["ARTICLE"],["ARTICLE"]]);
  assert.deepEqual(insertIntoJExpr(["SECTION",["ARTICLE"]],["ARTICLE"],2),["SECTION",["ARTICLE",["ARTICLE"]]]);
  try {
    insertIntoJExpr(["SECTION",["ARTICLE"]],["ARTICLE"],3);
  } catch (e) {
    assert.equal(e.message,"nesting level doesn't exist");
  }
  try {
    insertIntoJExpr("SECTION",["ARTICLE"],2);
  } catch (e) {
    assert.equal(e.message,"first argument must be an array");
  }
  assert.deepEqual(
    insertIntoJExpr(
      ["SECTION",["ARTICLE"],["ARTICLE"]],["DIV"],2),["SECTION",["ARTICLE"],["ARTICLE",["DIV"]]]);
  assert.deepEqual(
    insertIntoJExpr(["MAIN"],"Hello!",1),["MAIN","Hello!"]);
  assert.deepEqual(
    insertIntoJExpr(["MAIN","Hello!"],"Hello! 2",1),["MAIN","Hello!","Hello! 2"]);
  assert.deepEqual(
    insertIntoJExpr(["MAIN","Hello!",["DIV"]],"Hello! 2",2),["MAIN","Hello!",["DIV","Hello! 2"]]);
}

function insertIntoJExpr(jexpr,subJexpr,level) {
  function findLevel(currentJexpr,numLevel) {
    if(numLevel==1) {
      currentJexpr[currentJexpr.length] = subJexpr;
      return jexpr;
    } else {
      let lastElem = currentJexpr[currentJexpr.length-1];
      if(lastElem instanceof Array) {
        return findLevel(lastElem,numLevel-1);
      } else if(typeof(lastElem)=='string') {
        throw new Error("nesting level doesn't exist");
      }
    }
  }
  if(typeof(jexpr)=="string") {
    throw new Error("first argument must be an array");
  } else {
    return findLevel(jexpr,level);
  }
}

/* JExpr -> String
   convert jexpr into html
   notes: 
    - the result is html-formatted string
    - !!! ignore attributes, for now
*/

if (runTests) {
  assert.equal(jexprToHTML(["SECTION"]),"<SECTION></SECTION>");
  assert.equal(jexprToHTML(["SECTION","Hello"]),"<SECTION>Hello</SECTION>");
  assert.equal(jexprToHTML(
    ["SECTION","Hello",["ARTICLE","Content","Content"]]),"<SECTION>Hello<ARTICLE>ContentContent</ARTICLE></SECTION>");
}

function jexprToHTML(jexpr) {
  if(jexpr instanceof Array) {
    let content = jexpr.slice(1);
    return `<${jexpr[0]}>${processJExprContent(content)}</${jexpr[0]}>`;
  } else { // expecting a string according to definition of JExpr
    return jexpr;
  }
}

/* Array|undefined -> String
*/
function processJExprContent(content) {
  if(content===undefined) {
    return "";
  } else {
    return content.reduce((base,jexpr)=>{
      return base+jexprToHTML(jexpr);
    },"");
  }
}

/* Attributes -> String */
function processAttributes(attr) { }

/* String -> String
   wrap html formatted string into html
   document declaration
*/
function genHTMLPage(astr) {
  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
 p {
   white-space:pre-line;
 }
</style>
</head>
<!-- the body -->
${astr}
</html>`;
}

exports.arrayToHTML = (docArr) => {
  return genHTMLPage(jexprToHTML(composeDocument(docArr)));
};


