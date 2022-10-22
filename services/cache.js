const mongoose = require('mongoose');
const { client } = require("../redis/client");

//reference to the original exec function
const exec = mongoose.Query.prototype.exec;

//mongoose.Query.prototype.exec2 = exec;
mongoose.Query.prototype.cache = function(options = {}) {
  this.useCache = true;
  //make sure the key is a string (or number) & default to "" (to avoid undefined)
  this.hashKey = JSON.stringify(options.key || ""); 
  return this;
}  

mongoose.Query.prototype.exec = async function() {
  //console.log("I am about to run a query");

  if(!this.useCache) {
    return await exec.apply(this, arguments); 
  }

  const keyObj = Object.assign({}, this.getQuery(), { __collection: this.mongooseCollection.name });
  const key = JSON.stringify(keyObj);

  const cacheValue = await client.hGet(this.hashKey, key);
  if(cacheValue) {
    //deserialize cached value into JS object
    const valueObj = JSON.parse(cacheValue);

    //this.model - base class of the document object returned by the query 
    //convert into mongoose document object
    const valueDoc = Array.isArray(valueObj) 
      ? valueObj.map( obj => new this.model(obj))
      : new this.model(valueObj);
        
    console.log("From Cache",this.hashKey,key);   
    return Promise.resolve(valueDoc);
  }

  //return this.exec2(arguments);
  const value = await exec.apply(this, arguments); //bind to query object & pass all arguments
  // console.log("DBKEY",key);
  // console.log("DBVAL",JSON.stringify(value));
  await client.hSet(this.hashKey, key, JSON.stringify(value), {EX: 60});

  return value;
};

async function clearHash(hashKey) {
  await client.del(JSON.stringify(hashKey));
}

module.exports = {
  clearHash
}