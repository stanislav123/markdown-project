
const JEXPR_MOD = require('./jexpr.js');

/**
 * readline.Interface -> Void
 */
function processInputLines(rl) {
  
  let acc = {
    chunk:'',  
    insertChunk: function() {
      if(this.chunk.trim().length>0) {
        this.insertJexpr(this.chunk.slice(0,-1),this.currentLevel); // level!
        this.chunk='';
      }
    },
    insertJexpr: function(jexpr,level) {
      this.getPointer(level).push(jexpr);
    },
    getPointerAux: function(arr,level) {
      if(level<=0) {
        return arr;
      } else {
        return this.getPointerAux(arr[arr.length-1],level-1);
      } 
    },
    getPointer: function(level) {
      return this.getPointerAux(this.jexpr,level);
    },
    jexpr: [
      "MAIN",
      ["HEADER",["H1","Content"]], 
    ], 
    currentLevel: 0
  };
  
  rl.on('line', (line) => {
    let theMatch = line.match(/^(#+)(.*)/);
    if(theMatch) {
      acc.insertChunk();
      acc.currentLevel = theMatch[1].length;
      acc.insertJexpr(
        ["SECTION",
          ["HEADER",["H1",`${theMatch[2]}`]]],acc.currentLevel-1);
      //debugger;
    } else {
      acc.chunk+=line+"\n";
    }
  }).on('close',()=>{
    acc.insertChunk();
    console.log(JEXPR_MOD.jexprToHTML(acc.jexpr));
  });
}

exports.processInputLines = processInputLines;