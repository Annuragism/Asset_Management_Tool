
 const mongoose = require('mongoose');

 const TaskSchema= mongoose.Schema({
   Task_name:String,
   Task_description:String,
   Assign_date:{type:Date,default:Date.now},
   Deadline_date:String,
   Emp_id:String,
   From_manager:String,
   Status:String, //(0-pending,1-unable to do,2-in progress,3-completed)
   Final_competion_status:String,//(open or close),
   Final_rating:String,
   Feedback:String,
   Rating:String,
   Total_task:String,
   Completed:String,
   Not_Completed:String
 })
 module.exports=mongoose.model('Task',TaskSchema)
