exports.Space = {

  extend : function(child, base){
    for (prop in child){
      base[prop] = child[prop]
    }
    return base;
  }

}