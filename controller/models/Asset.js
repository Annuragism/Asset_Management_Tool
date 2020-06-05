const mongoose = require('mongoose');

const AssetSchema= mongoose.Schema({
  name:String,
  aid:String,
  id:String,
  type:String,
  aStatus:String,

})
module.exports=mongoose.model('Asset',AssetSchema)
