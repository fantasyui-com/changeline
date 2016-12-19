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
  },
  {
    description: "Update bark to meow.",
    search: function(line){
      if(line === 'bark') return true;
    },
    replace: function(line){
     return 'meow';
    },
  },
  {
    description: "Update Bort to Bart.",
    search: line => line === 'Bort',
    replace: line => 'Bart',
  },
]
