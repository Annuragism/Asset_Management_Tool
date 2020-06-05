
 const mongoose = require('mongoose');

 const ManagerSchema= mongoose.Schema({
   First_name:String,
   Last_name:String,
   Email_id:String,
   Password:String,
   Manager_id:String,
   Mobile:String,
   DateOfJoining:{type:Date,default:Date.now},
   Designation:String,
   Status:String,
 })
 module.exports=mongoose.model('Manager',ManagerSchema)
