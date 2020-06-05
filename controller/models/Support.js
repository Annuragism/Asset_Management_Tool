
 const mongoose = require('mongoose');

 const SupportSchema= mongoose.Schema({
   First_name:String,
   Last_name:String,
   Email_id:String,
   Password:String,
   Support_id:String,
   Mobile:String,
   DateOfJoining:{type:Date,default:Date.now},
   Designation:String,
   Status:String,
 })
 module.exports=mongoose.model('Support',SupportSchema)
