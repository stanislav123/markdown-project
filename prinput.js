
const JEXPR_MOD = require('./jexpr.js');

function getLevel(arr,level) {
  if(level===0) {
    return arr;
  } else {
    return getLevel(arr[arr.length-1],level-1);
  } 
}

/**
 * readline.Interface -> Void
 */
function processInputLines(rl) {
  let acc='';
  let jexpr = [
      "MAIN",
      ["HEADER",["H1","Content"]], 
    ]; 
  let currentLevel = 0;
  rl.on('line', (line) => {
    let theMatch = line.match(/^(#+)(.*)/);
    if(theMatch) {
      if(acc.trim().length>0) {
        getLevel(jexpr,currentLevel).push(acc.slice(0,-1));
        acc='';
      }
      currentLevel = theMatch[1].length;
        getLevel(jexpr,currentLevel-1)
          .push(
            ["SECTION",
              ["HEADER",["H1",`${theMatch[2]}`]]]);
    } else {
      acc+=line+"\n";
    }
  }).on('close',()=>{
    if(acc.trim().length>0) {
      getLevel(jexpr,currentLevel).push(acc.slice(0,-1));
      acc='';
    }
    console.log(JEXPR_MOD.jexprToHTML(jexpr));
  });
}

exports.processInputLines = processInputLines;