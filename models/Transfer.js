
const mongoose = require('mongoose');

const TransferSchema= mongoose.Schema({
  From_Employee_id:String,
  To_Employee_id:String,
  Manager_id:String,
  Assest_id:String,
  Asset_name:String,
  Transfer_date:String,
  Transfer_Status:String,
  //1. for  approved  2. for pending 3.Rejected by manager
  Comment:String,

})
module.exports=mongoose.model('Transfer',TransferSchema)
