
 const mongoose = require('mongoose');

 const MessageSchema= mongoose.Schema({
   Message:String,
   Subject:String,
   send_date:{type:Date,default:Date.now},
   To:String,
   From:String

 })
 module.exports=mongoose.model('Message',MessageSchema)
