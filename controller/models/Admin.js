const mongoose = require('mongoose');

const AdminloginSchema= mongoose.Schema({
  name:String,
  emailid:String,
  password:String,

})
module.exports=mongoose.model('Admin',AdminloginSchema)
