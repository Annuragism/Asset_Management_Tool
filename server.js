const express = require('express');
const path = require('path');
//const fs=require('fs')
//const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session=require('express-session');

const app=express()

//----------------------------------------------------------------
//server configuration
//server creation and start server  ---listen(port no,function)------
app.listen(5000,()=>{
  console.log(" AMS Server started on port :5000");
})
//configure body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}))
//----------------------------------------------------------------

//configure view engine as hbs
app.set('views',path.join(__dirname,'views'))            //location
app.set('view engine','hbs')      // set path (view engine,'ext-name')


//configure layouts in mainlayout as it imports in all of the pages
// for mainlayout
// app.engine('hbs',hbs({
//
// extname: 'hbs',
// defaultLayout:'mainlayout',
// layoutDir:__dirname+'/views/layouts/'
//
// }))
//----------------------------------------------------------------
//---------------------------------------------------------------
//start session----------
app.use(session({secret:'asdfdfss'}))
//---------------------------------------------------------------
//---------------------------------------------------------------
const AMScontroller=require('./controller/AMSController')
app.use("",AMScontroller)
//-----------------------------------------------------------------
