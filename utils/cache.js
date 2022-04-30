
const NodeCache = require( "node-cache" );
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 300 } );
var cacheManager = require('cache-manager');


const clearCache=(name)=>myCache.del(name);

const loadCache=(prefix,req,res,next)=>{
    var fullUrl = req.originalUrl;
    const userId = req.decodedAccessToken.id;
  
  const keyOfCache=prefix+userId+fullUrl;
    console.log(keyOfCache)
    if(myCache.get(keyOfCache)== undefined){

        return -1;
    }else{
    return  res.json(myCache.get(keyOfCache))
    }
}

const setCache=async(prefix,req,value)=>{
  const keys=myCache.keys();

    var fullUrl = req.originalUrl;
    const userId = req.decodedAccessToken.id;

  const keyOfCache=prefix+userId+fullUrl;
  myCache.set(keyOfCache,value);
}


module.exports={myCache,clearCache,loadCache,setCache};