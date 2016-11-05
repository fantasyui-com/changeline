module.exports = [
  {
    description: "Update padding and margins.",
    search: function(line){
      if(line.match(/[pm]-[a-z]-[0-9]/)) return true;
    },
    replace: function(line){
     return line.replace(/([pm])-([a-z])-([0-9])/g, this.replacer);
    },
    // -- user functions
    replacer: function(match, spaceType, spaceDirection, spaceSize, offset, string) {
      return spaceType + spaceDirection +'-'+ spaceSize;
    }
  }
]
