const mongoose = require('mongoose');

const FileSchema= mongoose.Schema({
  doc:String,
  to:String,
  comment:String,
  file_name:String,
  description:String,
  status:String,
  category:String,
  uploaded_by:String,
  uploaded_date:{type:Date,default:Date.now},

})
module.exports=mongoose.model('File',FileSchema)
