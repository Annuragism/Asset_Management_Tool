const mongoose = require('mongoose');

const RequestSchema= mongoose.Schema({
   Asset_name:String,
   Asset_id:String,
   Request_date:{type:Date,default:Date.now},
   Manager_id:String,
   Emp_id:String,
   Status:String,
// Status:-
// 1=Pending with Manager
// 2=reject with support
// 3=Pending with Support
// 4=Rejected by Manager
// 5=Approved

   Remarks:String,

})
module.exports=mongoose.model('Request',RequestSchema)
