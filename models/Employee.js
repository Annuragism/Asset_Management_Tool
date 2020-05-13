
 const mongoose = require('mongoose');

 const EmployeeSchema= mongoose.Schema({
   First_name:String,
   Emp_id:String,
   Last_name:String,
   Email_id:String,
   Password:String,
   Mobile:String,
   DateOfJoining:{type:Date,default:Date.now},
   Designation:String,
   Manager_id:String,
   Status:String
 })
 module.exports=mongoose.model('Employee',EmployeeSchema)
