const express = require('express');
const path = require('path');
const fs=require('fs')
//const hbs = require('express-handlebars');
// const bodyparser = require('body-parser');
// const session=require('express-session');
// var ip=require("ip")
//------------------------------------------------------------------------
const router=express.Router();

//-----------------------------------------------------
//create mongoose connection
const mongoose=require('mongoose')
const URL="mongodb://localhost:27017/AMS";
mongoose.connect(URL)
//----------------------------------------------------------------------
const Admin=require('../models/Admin')
const Employee=require('../models/Employee')
const Manager=require('../models/Manager')
const Support=require('../models/Support')
const Asset=require('../models/Asset')
const Request=require('../models/Request')
const ManagerRequest=require('../models/ManagerRequest')
const Transfer=require('../models/Transfer')
const Task=require('../models/Task')
const Message=require('../models/Message')

//----------------------------------------------------------------------

//-------------------------------------------------------------------------
router.get("/",(req,res)=>{
  res.render('login')
})
router.get("/adminhome",(req,res)=>{if(req.session.admin==null){res.render('login')}else res.render('adminhome',{admin:req.session.admin})})
router.get("/ehome",(req,res)=>{if(req.session.employee==null){res.render('login')}else res.render('Employeehome',{employee:req.session.employee})})
router.get("/mhome",(req,res)=>{if(req.session.manager==null){res.render('login')}else res.render('managerhome',{manager:req.session.manager})})
router.get("/shome",(req,res)=>{if(req.session.support==null){res.render('login')}else res.render('Supporthome',{support:req.session.support})})
//--------------------------------------------------------------------------
//login check of admin , Support and Employee and Manager From   one  log in page
router.post('/logincheck',(req,res)=>{
 var email=req.body.email;
 //console.log(email);
 var password=req.body.pwd;
 //console.log(password);
 var select=req.body.select;
 //console.log(select);


switch (select) {
  case 'Admin':
  {
     console.log("Hello Admin");

    Admin.find({Emailid:email,Password:password},(err,result)=>{
      //console.log(result);
      if(err) throw err;
      else if(result.length!=0)
      {
        req.session.admin=email;

        res.render('adminhome',{admin:req.session.admin})
      }
      else
      res.render('login',{msg:'Admin login Fail, Please Try again',})
      })

  }
    break;
    case 'Support':
    {
      // console.log("Hello Support");console.log(email);console.log(password);
      Support.find({Email_id:email ,Password:password},(err,result)=>{
        //console.log(result);
        if(err) throw err;
        else if(result.length!=0)
        {
          var status=result[0].Status;
          if(status=='1')
           {
           res.render('login',{msg:'Support Account De-Activated, Please Try again',})
           }
           else
           {
           support:req.session.support=email;
           res.render('supporthome',{support:req.session.support})
          }
        }
        else
        res.render('login',{msg:'Support login Fail, Please Try again',})
        })

    }
      break;
      case 'Manager':
        {
          // console.log("Hello Manager");
          Manager.find({Email_id:email,Password:password},(err,result)=>{
            //console.log(result);
            if(err) throw err;
            else if(result.length!=0)
            {
              var status=result[0].Status;
              if(status=='1')
               {
               res.render('login',{msg:'Manager De-Activated, Please Try again',})
               }
               else
               {
               req.session.manager=email;
               res.render('managerhome',{manager:req.session.manager})
               }

            }
            else
            res.render('login',{msg:'Manager login Fail, Please Try again',})
            })

        }
        break;

        case 'Employee':
      {
         //console.log("Hello Employee");
         //console.log(email);
         //console.log(password);
         Employee.find({Email_id:email,Password:password},(err,result)=>{
           console.log(result);

          if(err) throw err;
           else if(result.length!=0)
          {
                var status=result[0].Status;
                if(status=='1')
                 {
                 res.render('login',{msg:'Employee De-Activated, Please Try again',})
                 }
                 else{
                 req.session.employee=email;
                 var eid=result[0].Emp_id;
                 req.session.eid=eid;
                 res.render('employeehome',{employee:req.session.employee})
                }
           }
          else
          res.render('login',{msg:'Employee login failed, Please Try again',})

          })

      }
      break;
  default:
  {
    //console.log("Nothing selected");
    res.render('login',{msg:'something went wrong, Please Try again',})


  }
}

})
//------------------------------------------------------------------------
//deactivate_employee_from admin
router.get('/deactivate',(req,res)=>{
  var id=req.query.id;
  var designation=req.query.designation;
switch (designation) {
  case 'Employee':
         {
Employee.update({Designation:designation,Emp_id:id},{Status:'1'},(err,result)=>{
   if (err) throw err;
  else if(result.nModified>0)
  {
    Employee.find({Status:'0'},(err,employee)=>{
    //console.log(result);
    if (err) res.render("error");
    else
    {
      Manager.find({Status:'0'},(err,manager)=>{
      //console.log(result);
      if (err) res.render("error");
      else
      {
        Support.find({Status:'0'},(err,support)=>{
        //console.log(result);
        if (err) res.render("error");
        else
        {
          res.render('view_user',{success_msg:"User deactivated",employee1:employee,support:support,manager:manager,admin:req.session.admin})

        }
      })//support find end here
      }
    })//manager find end here
    }

  })//employee find end here
  }
  else
  res.render('adminhome',{msg:"Process failed,Try again..!!!",admin:req.session.admin})


})
         }
    break;
    case 'Manager':
           {
             Manager.update({Designation:designation,Manager_id:id},{Status:'1'},(err,result)=>{
                if (err) throw err;
               else if(result.nModified>0)
               {
                 Employee.find({Status:'0'},(err,employee)=>{
                 //console.log(result);
                 if (err) res.render("error");
                 else
                 {
                   Manager.find({Status:'0'},(err,manager)=>{
                   //console.log(result);
                   if (err) res.render("error");
                   else
                   {
                     Support.find({Status:'0'},(err,support)=>{
                     //console.log(result);
                     if (err) res.render("error");
                     else
                     {
                       res.render('view_user',{success_msg:"User deactivated",employee1:employee,support:support,manager:manager,admin:req.session.admin})

                     }
                   })//support find end here
                   }
                 })//manager find end here
                 }

               })//employee find end here
               }
               else
               res.render('adminhome',{msg:"Process failed,Try again..!!!",admin:req.session.admin})


             })
           }
      break;
      case 'Support':
             {
               Support.update({Designation:designation,Support_id:id},{Status:'1'},(err,result)=>{
                  if (err) throw err;
                 else if(result.nModified>0)

                 {

                   Employee.find({Status:'0'},(err,employee)=>{
                   //console.log(result);
                   if (err) res.render("error");
                   else
                   {
                     Manager.find({Status:'0'},(err,manager)=>{
                     //console.log(result);
                     if (err) res.render("error");
                     else
                     {
                       Support.find({Status:'0'},(err,support)=>{
                       //console.log(result);
                       if (err) res.render("error");
                       else
                       {
                         res.render('view_user',{success_msg:"User deactivated",employee1:employee,support:support,manager:manager,admin:req.session.admin})

                       }
                     })//support find end here
                     }
                   })//manager find end here
                   }

                 })//employee find end here

                 }
                   else
                   res.render('adminhome',{msg:"Process failed,Try again..!!!",admin:req.session.admin})

               })
             }
        break;
  default:
  {
    res.render('adminhome',{msg:"Process failed,Try again..!!!",admin:req.session.admin})
}

}

//res.render('Employeehome',{success_msg:"User deactivated"})
})
//-------------------------------------------------------------------------
//------------------------------------------------------------------------
//reactivate_employee_from admin
router.get('/reactivate',(req,res)=>{
  var id=req.query.id;
  var designation=req.query.designation;
switch (designation) {
  case 'Employee':
         {
Employee.update({Designation:designation,Emp_id:id},{Status:'0'},(err,result)=>{
   if (err) throw err;
  else if(result.nModified>0)
  res.render('adminhome',{success_msg:"User reactivated",admin:req.session.admin})
  else
  res.render('adminhome',{msg:"Process failed,Try again..!!!",admin:req.session.admin})


})
         }
    break;
    case 'Manager':
           {
             Manager.update({Designation:designation,Manager_id:id},{Status:'0'},(err,result)=>{
                if (err) throw err;
               else if(result.nModified>0)
               res.render('adminhome',{success_msg:"User reactivated",admin:req.session.admin})
               else
               res.render('adminhome',{msg:"Process failed,Try again..!!!",admin:req.session.admin})


             })
           }
      break;
      case 'Support':
             {
               Support.update({Designation:designation,Support_id:id},{Status:'0'},(err,result)=>{
                  if (err) throw err;
                 else if(result.nModified>0)
                 res.render('adminhome',{success_msg:"User reactivated",admin:req.session.admin})
                   else
                   res.render('adminhome',{msg:"Process failed,Try again..!!!",admin:req.session.admin})

               })
             }
        break;
  default:
  {
    res.render('adminhome',{msg:"Process failed,Try again..!!!",admin:req.session.admin})
}

}

//res.render('Employeehome',{success_msg:"User deactivated"})
})
//---------------------------------------------------------------------------
//reactivate user
router.get("/reactivate-user",(req,res)=>{
    Employee.find({Status:'1'},(err,employee)=>{
    //console.log(result);
    if (err) res("error");
    else
    {
      Manager.find({Status:'1'},(err,manager)=>{
      //console.log(result);
      if (err) res("error");
      else
      {
        Support.find({Status:'1'},(err,support)=>{
        //console.log(result);
        if (err) res("error");
        else
        {
          res.render('reactivate',{employee1:employee,support:support,manager:manager,admin:req.session.admin})

        }
      })
      }
    })
    }

  })
})
//---------------------------------------------------------------------------
//admin login ends here
  router.get('/admin-logout',(req,res)=>{
  req.session.destroy();
  res.render('login',{success_msg:'Admin Logout successfully'})
})
//Support login ends here
router.get('/support-logout',(req,res)=>{
req.session.destroy();
res.render('login',{success_msg:'Support Logout successfully'})
})
//Manager login ends here
router.get('/manager-logout',(req,res)=>{
req.session.destroy();
res.render('login',{success_msg:'Manager Logout successfully'})
})
//Employee login ends here
router.get('/employee-logout',(req,res)=>{
req.session.destroy();
res.render('login',{success_msg:'Logout successfully'})
})
//-------------------------------------------------------------------------
//Admin Change Password
router.get('/change_password',(req,res)=>{
res.render('change_password',{admin:req.session.admin})
})
//manager Change Password
router.get('/change_manager_password',(req,res)=>{
res.render('change_manager_password',{manager:req.session.manager})
})
//Support Change Password
router.get('/change_support_password',(req,res)=>{
res.render('change_support_password',{support:req.session.support})
})
//Employee Change Password
router.get('/change_employee_password',(req,res)=>{
res.render('change_employee_password',{employee:req.session.employee})
})
//--------------------------------------------------------------------------
//password change for admin
router.post('/change-admin-password',(req,res)=>{
  var cpwd=req.body.cpwd;
  console.log(cpwd);
  var npwd=req.body.npwd;
  console.log(npwd);
  Admin.update({emailid:req.session.admin},{password:npwd},(err,result)=>{
    console.log(result);
    if (err) throw err;
    else if(result.nModified>0)
    {
      res.render('adminhome',{admin:req.session.admin,success_msg:"Password Changed Successfully"})
    }
    else {
      res.render('error',{msg:"something went wrong"})
    }
  })
})
//------------------------------------------------------------------------
//password change for Employee
router.post('/change-employee-password',(req,res)=>{
  var cpwd=req.body.cpwd;
  console.log(cpwd);
  var npwd=req.body.npwd;
  console.log(npwd);
  Employee.update({Email_id:req.session.employee},{Password:npwd},(err,result)=>{
    console.log(result);
    if (err) throw err;
    else if(result.nModified>0)
    {
      res.render('employeehome',{employee:req.session.employee,success_msg:"Password Changed Successfully"})
    }
    else {
      res.render('error',{msg:"something went wrong"})
    }
  })
})
//--------------------------------------------------------------------------
//password change for Manager
router.post('/change-manager-password',(req,res)=>{
  var cpwd=req.body.cpwd;
  console.log(cpwd);
  var npwd=req.body.npwd;
  console.log(npwd);
  Manager.update({Email_id:req.session.manager},{Password:npwd},(err,result)=>{
    console.log(result);
    if (err) throw err;
    else if(result.nModified>0)
    {
      res.render('managerhome',{manager:req.session.manager,success_msg:"Password Changed Successfully"})
    }
    else {
      res.render('error',{msg:"something went wrong"})
    }
  })
})
//--------------------------------------------------------------------------
//password change for support
router.post('/change-support-password',(req,res)=>{
  var cpwd=req.body.cpwd;
  console.log(cpwd);
  var npwd=req.body.npwd;
  console.log(npwd);
  Support.update({Email_id:req.session.support},{Password:npwd},(err,result)=>{
    console.log(result);
    if (err) throw err;
    else if(result.nModified>0)
    {
      res.render('supporthome',{support:req.session.support,success_msg:"Password Changed Successfully"})
    }
    else {
      res.render('error',{msg:"something went wrong"})
    }
  })
})
//------------------------------------------------------------------------
router.get('/create_employee',(req,res)=>{
  Manager.find({},(err,managerResult)=>{
  if (err) throw err;
  else
  res.render('create_employee',{admin:req.session.admin,ManagerResult:managerResult})
});
})
//--------------------------------------------------------------------------------------
//create employee post methood
router.post('/create_employee',(req,res)=>{
  var fname=req.body.fname;
  var lname=req.body.lname;
  var pwd=req.body.pwd;
  var eid=req.body.Employee;
  var mid=req.body.Manager;
  var sid=req.body.Support;
  var email=req.body.email;
  var mobile=req.body.mobile;
  var designation=req.body.designation;
  var managerid=req.body.mid;
  var status='0';
  console.log(eid);
  console.log(mid);
  console.log(sid);

switch (designation) {
  case 'Support':
    {
      var newsupport=Support({
        First_name:fname,
        Last_name:lname,
        Email_id:email,
        Support_id:sid,
        Password:pwd,
        Mobile:mobile,
        Designation:designation,
        Status:status,


        //Manager_id:mid,
      })
      newsupport.save().then((data)=>console.log("new support created by admin"));
      res.render('adminhome',{success_msg:"New Support User Successfully Created..!!!"})
    }
    break;
    case 'Manager':
      {

        var newmanager=Manager({
          First_name:fname,
          Last_name:lname,
          Email_id:email,
          Password:pwd,
          Manager_id:mid,
          Mobile:mobile,
          Designation:designation,
          Status:status,
        //  Manager_id:mid,
        })
        newmanager.save().then((data)=>console.log("new manager created by admin"));
        res.render('adminhome',{success_msg:"New Manager Successfully Created..!!!"})

      }
      break;
      case 'Employee':
        {

          var newemployee=Employee({
            First_name:fname,
            Last_name:lname,
            Email_id:email,
            Password:pwd,
            Mobile:mobile,
            Emp_id:eid,
            Designation:designation,
            Status:status,
            Manager_id:managerid,
          })
          newemployee.save().then((data)=>console.log("New Employee created by admin"));
          res.render('adminhome',{success_msg:"New Employee Successfully Created..!!!"})
        }
        break;
  default:
  {
    res.render('adminhome',{msg:"Something went wrong..!!!"})

  }

}

  })
//------------------------------------------------------------------------
//view all User
router.get("/view_user",(req,res)=>{
    Employee.find({Status:'0'},(err,employee)=>{
    //console.log(result);
    if (err) console.log("error");
    else
    {
      Manager.find({Status:'0'},(err,manager)=>{
      //console.log(result);
      if (err) console.log("error");
      else
      {
        Support.find({Status:'0'},(err,support)=>{
        //console.log(result);
        if (err) console.log("error");
        else
        {
          res.render('view_user',{employee1:employee,support:support,manager:manager,admin:req.session.admin})

        }
      })//support find end here
      }
    })//manager find end here
    }

  })//employee find end here
})
//------------------------------------------------------------------------
//create assests page on admin
router.get('/create_asset',(req,res)=>{
  res.render('create_asset',{admin:req.session.admin})})
  //---------------------------------------------------------------------------
router.post('/create_asset',(req,res)=>{
  var name=req.body.name;
  var quantity=req.body.Quantity;
  var aid=req.body.aid;
  var type=req.body.type;
  var aStatus='Available'
  for(var i=1;i<=quantity;i++)
  {
      var id=aid+i;
      var newasset=Asset({
        name:name,
        id:id,
        aid:aid,
        type:type,
        aStatus:aStatus,


      })
      newasset.save().then((data)=>console.log(i+"new Asset created by admin"));
}
      res.render('create_asset',{success_msg:"New Asset Successfully Created..!!!"})


  })
//-------------------------------------------------------------------------
//---------------------------------------------------------------------------
//view asset from admin
router.get('/view_asset',(req,res)=>{
  Asset.find({},(err,result)=>{
    if (err) console.log('error');
    else
  res.render('view_asset',{admin:req.session.admin,Asset:result})
})
});
//----------------------------------------------------------------------------
router.get('/delete_asset',(req,res)=>{
  var assetid=req.query.assetid;
  // console.log(assetid);
  var assetname=req.query.assetname;
  // console.log(assetname);

  Asset.deleteOne({id:assetid,name:assetname},(err,result)=>{
    console.log(result);
  if (err) throw err;
  else if(result.deletedCount>0)
  {
    Asset.find({},(err,result)=>{
      if (err) console.log('error');
      else
    res.render('view_asset',{admin:req.session.admin,Asset:result})
  })
  }
  else
  {
    Asset.find({},(err,result)=>{
      if (err) console.log('error');
      else
    res.render('view_asset',{admin:req.session.admin,Asset:result,msg:"Asset not deleted"})
  })

 }
  })//asset find end here

})//delete_asset end
//---------------------------------------------------------------------------
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//-------------------- Jquery function- to check asset id--------------------------------------------
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

router.get('/check-assetid',(req,res)=>{
    var aid=req.query.aid;
    console.log(aid);
    Asset.find({aid:aid},(err,result)=>{
      if(err) throw err;
      else if(result.length!=0)
      {
        console.log(result+"assetid="+aid+" exist");
      res.json({'MSG':'Asset id:'+aid+" "+'Already Exist'})
      }
      else
        {
          console.log("assetid="+aid+" not exist");

          res.json({'MSG':'Available'})
        }

  })
  })

//-----------------------------------------------------------------------
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@2
                            // EMPLOYEE MODULE
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//employee raising a request
router.get('/raise_a_request',(req,res)=>{
  Asset.find({},(err,result)=>{
  res.render('raise_a_request',{data:result,employee:req.session.employee,manager:req.session.manager})
})
})
//---------------------------------------------------------------------------
router.get('/employee_profile',(req,res)=>{
  Employee.find({Email_id:req.session.employee},(err,result)=>{
    res.render('employee_profile',{data:result,employee:req.session.employee})

  })
})
//----------------------------------------------------------------------------
//form action of update employee
router.post('/update_employee',(req,res)=>{
     Employee.update({Emp_id:req.body.Emp_id},{First_name:req.body.fname,Last_name:req.body.lname,Password:req.body.pwd,Mobile:req.body.mno,Emaild:req.body.email},(err,result)=>{
     res.render('Employeehome',{employee:req.session.employee,success_msg:"Profile Successfully Updated ..!!!"})
   })//Employee updation end

})//req,res end
//-----------------------------------------------------------------------------------------------------------
//form action of raising a Request
router.post('/raise_a_request_formaction',(req,res)=>{
  var assetname=req.body.select;
  var remark=req.body.remark;
  Asset.find({name:assetname},(err,result)=>{
    var id=result[0].id;
    var type=result[0].type;
Employee.find({Email_id:req.session.employee},(err,result)=>{
  var emp_id=result[0].Emp_id;
  var manager_id=result[0].Manager_id;

  var newrequest=Request({
   Asset_name:assetname,
   Asset_id:id,
   Manager_id:manager_id,
   Emp_id:emp_id,
   Status:'1',
   Remarks:remark,
     })
     newrequest.save().then((data)=>console.log("new Asset request created by employee"));
     Asset.find({},(err,result)=>{
     res.render('raise_a_request',{employee:req.session.employee,success_msg:"New Asset request Raised Successfully..!!!"})
   })//asset find end

})//Employee find end
  })//asset find end
})//req,res end
//-------------------------------------------------------------------------
//view asset_request from employee
router.get('/view_my_request',(req,res)=>{
  Employee.find({Email_id:req.session.employee},(err,result)=>{
  var eid=result[0].Emp_id;
    Request.find({Emp_id:eid},(err,result)=>{
      console.log("view my request from employee:"+result);
      if (err) res.render('error');
      else if (result.length!=0)
      {
          var requestStatus=result.map((rec)=>{
             if(rec.Status==1)
             return "Pending with Manager";
             else if(rec.Status==2)
             return "Rejected by Support";
             else if(rec.Status==3)
             return "Pending with Support";
             else if(rec.Status==4)
             return "Rejected by Manager";
             else if(rec.Status==5)
             return "Approved";
          })//map end
          var finaldata=result.map((rec,index)=>{
           var pair={requestStatus:requestStatus[index]};
           var objs={...rec,...pair}
           return objs;
          })//finaldata end here
          console.log("view my request from employee:"+finaldata);
          res.render('view_request',{employee:req.session.employee,request:finaldata})

      }
      else
    res.render('view_request',{employee:req.session.employee,msg:"No Request Found"})
  })//request find

  })//employee find end
});
//-------------------------------------------------------------------------
//employee_asset as My Asset in employee
router.get('/employee_assets',(req,res)=>{
  Employee.find({Email_id:req.session.employee},(err,result)=>{
    if(req.session.employee==null){res.render('login')}
    else if (err) {res.render('error')}
    else{
    // console.log(result);
     var eid=result[0].Emp_id;
    Request.find({Emp_id:eid,Status:'5'},(err,result)=>{
      // console.log(result);

        if (err) res.render('error');
        else
      res.render('employee-asset',{employee:req.session.employee,asset:result})
    })//request find
  }
  })//employee find end

});
//-------------------------------------------------------------------------
//transfer_assets to other employee
router.get('/transfer_assets',(req,res)=>{
  Employee.find({Email_id:req.session.employee},(err,result)=>{
    if(req.session.employee==null){res.render('login')}
    else if (err) {res.render('error')}
    else{
    // console.log(result);
     var eid=result[0].Emp_id;
    Request.find({Emp_id:eid,Status:'5'},(err,result)=>{
       console.log(result);

        if (err) res.render('error');
        else
        res.render('transfer_assets',{data:result,employee:req.session.employee})
    })//request find
  }
  })//employee find end

});

//-------------------------------------------------------------------------
//transfer_assets_formaction
router.post('/transfer_assets_formaction',(req,res)=>{
  var assetname=req.body.assetname;
  var to=req.body.transferto;
  var to_Employee_id=req.body.id;
  var comment=req.body.comment;

 Asset.find({name:assetname},(err,result)=>{
   if (err) throw err;
   else if(req.session.employee==null){res.render('login')}
   else {
     var assetid=result[0].id;
     Employee.find({Email_id:req.session.employee},(err,result)=>{
       if (err) throw err;
       else {
             var from_Employee_id=result[0].Emp_id;
             var mid=result[0].Manager_id;
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@22
//                Creating Transfer request
           var newtransfer=Transfer({
                      From_Employee_id:from_Employee_id,
                      To_Employee_id:to_Employee_id,
                      Manager_id:mid,
                      Assest_id:assetid,
                      Asset_name:assetname,
                      Transfer_Status:'2',//1.Approved  2. Not Approved
                      Comment:comment,
                  })
                  newtransfer.save().then((data)=>console.log("new Transfer request created by employee"+data));
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  res.render('Employeehome',{employee:req.session.employee,success_msg:"Asset Transfered Request Created Successfully"})
//-------------------------------------------------------------------------------------------------------------

}
 })//employee find end here

}//else
})//asset find end here
})//req,res end
//-------------------------------------------------------------------------
//############################################     SEND MESSAGE         #####################################################################
//send_message_to_manager
router.get('/send_message_to_manager',(req,res)=>{
  Employee.find({Email_id:req.session.employee},(err,result)=>{
    if (req.session.employee==null) res.render('login',{msg:"session expired"})
    else if(err) throw err;
    else
    {
    var mid=result[0].Manager_id;
    Manager.find({Manager_id:mid},(err,manager_data)=>{
      if (err) throw err;
      else
      res.render('send_message_to_manager',{employee:req.session.employee,manager_data:manager_data})

    })//manager find end here
   }
  })//employee find end here
});
//-------------------------------------------------------------------------------------
//send_message_to_manager_from_method
router.post("/send_message_to_manager_form_method",(req,res)=>{
Employee.find({Email_id:req.session.employee},(err,result)=>{
  var from=result[0].Emp_id;
  //-----------------------------

  var to=req.body.to;
  var subject=req.body.subject;
  var message=req.body.message;

  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@22
  //                Creating message
             var newmessage=Message({
               Message:message,
               Subject:subject,
               To:to,
               From:from,
                    })
              newmessage.save().then((data)=>console.log("new Message send to  manager"+data));
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  res.render('Employeehome',{success_msg:"New Message has been sent to Manager"})

})//employee find end here

})
//----------------------------------------------------------------------------------------
//Employee Sent Box
router.get('/sentbox_of_employee',(req,res)=>{
  Employee.find({Email_id:req.session.employee},(err,result)=>{
    var eid=result[0].Emp_id;
    Message.find({From:eid},(err,msg_data)=>{
      if (err) throw err;
      else if (msg_data!=0)
       {
         res.render('employee_sentbox',{employee:req.session.employee,msg_data:msg_data})

      }
      else {
        res.render('employee_sentbox',{msg:"No data Found"})
      }
    })//Message

  })//manager

});
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
//Employee Inbox
router.get('/inbox_of_employee',(req,res)=>{
    Message.find({To:req.session.eid},(err,msg_data)=>{
      if (err) throw err;
      else if (msg_data!=0)
       {
         res.render('inbox_of_employee',{employee:req.session.employee,msg_data:msg_data})

      }
      else {
        res.render('inbox_of_employee',{msg:"No data Found"})
      }
    })//Message

});
//-----------------------------------------------------------------------------------------
//######################################### TASK ############################################################
router.get('/view_my_task',(req,res)=>{
  Employee.find({Email_id:req.session.employee},(err,result)=>{
    if (err) throw err;
    else if(req.session.employee==null){res.render('login',{msg:"Session Expired"})}
    else
    {
    var eid=result[0].Emp_id;
    Task.find({Emp_id:eid},(err,task_data)=>{
      if (err) throw err;
      else
       {
                 var requestStatus=task_data.map((rec)=>{
                   if(rec.Status==0)
                   return "Pending :not open yet";
                    if(rec.Status==1)
                    return "Unable to do";
                    else if(rec.Status==2)
                    return "In progress";
                    else if(rec.Status==3)
                    return "Completed";

                 })//map end
                 var finaldata=task_data.map((rec,index)=>{
                  var pair={requestStatus:requestStatus[index]};
                  var objs={...rec,...pair}
                  return objs;
                 })//finaldata end here

             res.render('view_employee_task',{employee:req.session.employee,task_data:task_data,finaldata:finaldata})
       }
    })//Task
  }
  })//Employee

});
//-----------------------------------------------------------------------------------------
//view_my_task_form_action
router.post("/view_my_task_form_action",(req,res)=>{
var status=req.body.status;
var eid=req.body.eid;
var id=req.body.id;
//console.log(status+"\n"+eid+"\n"+id);
Task.update({_id:id,Emp_id:eid},{Status:status},(err,result)=>{
  if (err) throw err;
  else if (result.nModified>0) {

    Task.find({Emp_id:eid},(err,task_data)=>{
      if (err) throw err;
      else
       {
                 var requestStatus=task_data.map((rec)=>{
                   if(rec.Status==0)
                   return "Pending :not open yet";
                    if(rec.Status==1)
                    return "Unable to do";
                    else if(rec.Status==2)
                    return "In progress";
                    else if(rec.Status==3)
                    return "Completed";

                 })//map end
                 var finaldata=task_data.map((rec,index)=>{
                  var pair={requestStatus:requestStatus[index]};
                  var objs={...rec,...pair}
                  return objs;
                 })//finaldata end here

             res.render('view_employee_task',{employee:req.session.employee,task_data:task_data,finaldata:finaldata})
       }
    })//Task
  }
  else {

    Employee.find({Email_id:req.session.employee},(err,result)=>{
      if (err) throw err;
      else if(req.session.employee==null){res.render('login',{msg:"Session Expired"})}
      else
      {
      var eid=result[0].Emp_id;

      Task.find({Emp_id:eid},(err,task_data)=>{
        if (err) throw err;
        else
         {
               res.render('view_employee_task',{msg:"Task Status  has not been submitted to Manager",employee:req.session.employee,task_data:task_data})
         }
      })//Task
    }
    })//Employee

  }

})//task find end here

})
//-----------------------------------------------------------------------------------------
///view_my_team_employee
router.get('/view_my_team_employee',(req,res)=>{
  Employee.find({Email_id:req.session.employee},(err,result)=>{
    if (err) throw err;
    else if (req.session.employee==null) { res.render('login',{msg:"Session Expired"})     }
    else {

          mid=result[0].Manager_id;
          Employee.find({Manager_id:mid},(err,emp_data)=>{
            if (err) throw err;
            else if (req.session.employee==null) { res.render('login',{msg:"Session Expired"})     }
            else
            {
              res.render('view_my_team_employee',{employee:req.session.employee,emp_data:emp_data,mid:mid})
            }
          })//Employee

    }
  })//Employee
});
//-----------------------------------------------------------------------------------------
router.get('/view_employee_task_statistics',(req,res)=>{
  Task.find({Emp_id:req.session.eid,Status:'3'},(err,completed_task)=>{
    if (err) throw err;
    else {
      console.log(completed_task);
      Task.find({Emp_id:req.session.eid,$or: [ {Status:'1' } ,{ Status:'2' } ] } ,(err,incompleted_task)=>{
        if (err) throw err;
        else {
          console.log(incompleted_task);
          res.render('view_employee_task_statistics',{employee:req.session.employee,eid:req.session.eid,incompleted_task:incompleted_task,completed_task:completed_task,incompleted_task_length:incompleted_task.length,completed_task_length:completed_task.length})


            }
      })//task end

    }
  })//task end
});
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------


//#############################################################################################################################
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                            // MANAGER MODULE
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//---------------------------------------------------------------------------
router.get('/manager_profile',(req,res)=>{
  Manager.find({Email_id:req.session.manager},(err,result)=>{
    res.render('manager_profile',{data:result,manager:req.session.manager})

  })
})
//----------------------------------------------------------------------------
//form action of update employee
router.post('/update_manager',(req,res)=>{
     Manager.update({Manager_id:req.body.Manager_id},{First_name:req.body.fname,Last_name:req.body.lname,Password:req.body.pwd,Mobile:req.body.mno,Emaild:req.body.email},(err,result)=>{
     res.render('managerhome',{manager:req.session.manager,success_msg:"Profile Successfully Updated ..!!!"})
   })//Employee updation end

})//req,res end
//-----------------------------------------------------------------------------------------------------------
//view asset_request from employee
router.get('/view_pending_requests',(req,res)=>{
  Manager.find({Email_id:req.session.manager},(err,result)=>{
  var mid=result[0].Manager_id;
    Request.find({Manager_id:mid,Status:'1'},(err,result)=>{
      console.log(result);
      if (err) res.render('error');
      else if (result.length!=0)
      {
          var requestStatus=result.map((rec)=>{
             if(rec.Status==1)
             return "Pending with Manager";
             else if(rec.Status==2)
             return "Rejected by Support";
             else if(rec.Status==3)
             return "Pending with Support";
             else if(rec.Status==4)
             return "Rejected by Manager";
             else if(rec.Status==5)
             return "Approved";
          })//map end
          var finaldata=result.map((rec,index)=>{
           var pair={requestStatus:requestStatus[index]};
           var objs={...rec,...pair}
           return objs;
          })//finaldata end here
          console.log("view my request from employee:"+finaldata);
          res.render('view_pending_requests',{manager:req.session.manager,request:finaldata})

      }
      else
    res.render('view_pending_requests',{manager:req.session.manager,msg:"No data Found"})
  })//request find

  })//Manager find end
});
//---------------------------------------------------------------------------------------------------------
//view_transfer_request_from_manager
router.get('/view_transfer_request_from_manager',(req,res)=>{
  Manager.find({Email_id:req.session.manager},(err,result)=>{
    if (err) throw err;
    else
    {
  var mid=result[0].Manager_id;
    Transfer.find({Manager_id:mid,Transfer_Status:'2'},(err,transferResult)=>{
      console.log(transferResult);
      if (err) res.render('error');
      else
    res.render('view_transfer_request_from_manager',{manager:req.session.manager,transferResult:transferResult})
  })//request find
}
  })//Manager find end
});
//--------------------------------------------------------------------------------------------------------
//Transfer Asset approve by manager
router.get('/transfer_approve_by_manager',(req,res)=>{
  var from=req.query.from;
  var to=req.query.to;
  var assetid=req.query.aid;
  Transfer.update({To_Employee_id:to,From_Employee_id:from,Assest_id:assetid},{Transfer_Status:'1'},(err,result)=>{
    if (err) res.render('error')
    else if (req.session.manager==null) res.render('login',{msg:"Session Expired"})
  else if (result.nModified>0)
  {
    console.log(result);
    console.log("Transfer Request Approved");
    console.log(to+from+assetid);
      console.log("_____________________");
           Manager.find({Email_id:req.session.manager},(err,result)=>{
              var mid=result[0].Manager_id;
                Transfer.find({Manager_id:mid,Transfer_Status:'2'},(err,transferResult)=>{
                  //console.log(transferResult);
                  if (err) res.render('error');
                  else
              {
                Request.update({Emp_id:from,Asset_id:assetid,Status:'5'},{Emp_id:to},(err,result)=>{
                if (err) throw err;
                else if(result.nModified>0)
              {
                res.render('view_transfer_request_from_manager',{manager:req.session.manager,transferResult:transferResult,success_msg:"Transfer Request Approved"})
              }
              else {
                res.render('view_transfer_request_from_manager',{manager:req.session.manager,transferResult:transferResult,msg:"Transfer Request Not Approved"})

              }
              })
              }//else
              })//transfer find

              })//Manager find end


  }//else if end here

  else  res.render('view_transfer_request_from_manager',{msg:"Asset Transfer Request Approval Failed..!!!! Please Try Agian..!!"})

})//Transfer find ends
  });//req,res end here
//---------------------------------------------------------------------------------------------------------
//Transfer Asset Reject by manager
router.get('/transfer_reject_by_manager',(req,res)=>{
  var from=req.query.from;
  var to=req.query.to;
  var assetid=req.query.aid;
  Transfer.update({To_Employee_id:to,From_Employee_id:from,Assest_id:assetid},{Transfer_Status:'3'},(err,result)=>{
    if (err) res.render('error')
    else if (req.session.manager==null) res.render('login',{msg:"Session Expired"})
  else if (result.nModified>0)
  {
    console.log(result);
    console.log("Transfer Request Rejected");
    // console.log(to+from+assetid);
      console.log("_____________________");
           Manager.find({Email_id:req.session.manager},(err,result)=>{
              var mid=result[0].Manager_id;
                Transfer.find({Manager_id:mid,Transfer_Status:'2'},(err,transferResult)=>{
                  //console.log(transferResult);
                  if (err) res.render('error');
                  else
              {

                res.render('view_transfer_request_from_manager',{manager:req.session.manager,transferResult:transferResult,succes_msg:"Transfer Request Rejected"})

              }//else
              })//transfer find

              })//Manager find end


  }//else if end here

  else  res.render('view_transfer_request_from_manager',{msg:"Asset Transfer Request Approval Failed..!!!! Please Try Agian..!!"})

})//Transfer find ends
  });//req,res end here

//-------------------------------------------------------------------------------------------------------
//approve_by_manager
router.get('/approve_by_manager',(req,res)=>{
  var eid=req.query.eid;
  var assetid=req.query.aid;
  Request.update({Emp_id:eid,Asset_id:assetid},{Status:'3'},(err,result)=>{
    if (err) res.render('error')
    else if (req.session.manager==null) res.render('login',{msg:"Session Expired"})
  else if (result.nModified>0)
  {
    Manager.find({Email_id:req.session.manager},(err,result)=>{
    var mid=result[0].Manager_id;
      Request.find({Manager_id:mid,Status:'1'},(err,result)=>{
        //console.log(result);
        if (err) res.render('error');
        else
      res.render('view_pending_requests',{manager:req.session.manager,request:result,success_msg:"Employee Request Approved"})
    })//request find

    })//Manager find end

  }//else if end here
  else  res.render('view_pending_requests',{msg:"Employee Request not approved Failed..!!!! Please Try Agian..!!"})

  })//Request find ends
  });//req,res end here
//---------------------------------------------------------------------------------------------------------
//reject_by_manager
router.get('/reject_by_manager',(req,res)=>{
var eid=req.query.eid;
var assetid=req.query.aid;
Request.update({Emp_id:eid,Asset_id:assetid},{Status:'4'},(err,result)=>{
  if (err) res.render('error')
  else if (req.session.manager==null) res.render('login',{msg:"Session Expired"})
else if (result.nModified>0)
{
  Manager.find({Email_id:req.session.manager},(err,result)=>{
  var mid=result[0].Manager_id;
    Request.find({Manager_id:mid,Status:'1'},(err,result)=>{
      //console.log(result);
      if (err) res.render('error');
      else
    res.render('view_pending_requests',{manager:req.session.manager,request:result,success_msg:"Employee Request Rejected"})
  })//request find

  })//Manager find end

}//else if end here
else  res.render('view_pending_requests',{msg:"Empployee Request Reject Failed..!!!! Please Try Agian..!!"})

})//Request find ends
});//req,res end here
//---------------------------------------------------------------------------------------------------------
//manager My Employee and thier Asset
router.get("/empoyee_and_asset_of_manager",(req,res)=>{
Manager.find({Email_id:req.session.manager},(err,result)=>{
    var mid=result[0].Manager_id;
    Request.find({Manager_id:mid,Status:'5'},(err,result)=>{
      if (err) res.render('error')
      else if(req.session.manager==null) res.render('login',{msg:"Somthing went wrong"})
      else
       {
          res.render('empoyee_and_asset_of_manager',{manager:req.session.manager,data:result})
       }
    })//request find end here
})//manager find end here
})//req, res end here
//----------------------------------------------------------------------------------------------------------
//manager raising a request
router.get('/raise_a_request_by_manager',(req,res)=>{
  Asset.find({},(err,result)=>{
  res.render('raise_a_request_by_manager',{data:result,manager:req.session.manager})
})
})
//---------------------------------------------------------------------------
//form action of raising a Request
router.post('/raise_a_request__by_manager_formaction',(req,res)=>{
  var assetid=req.body.select;
  var remark=req.body.remark;
  Asset.find({id:assetid},(err,result)=>{
    var assetname=result[0].name;
    var type=result[0].type;
Manager.find({Email_id:req.session.manager},(err,result)=>{
  var manager_id=result[0].Manager_id;

  var newmanagerRequest=ManagerRequest({
   Asset_name:assetname,
   Asset_id:assetid,
   Manager_id:manager_id,
   Status:'3',
   Remarks:remark,
     })
     newmanagerRequest.save().then((data)=>console.log("new Asset request created by manager"));
     Asset.find({},(err,result)=>{
     res.render('raise_a_request_by_manager',{manager:req.session.manager,success_msg:"New Asset request Raised Successfully..!!!"})
   })//asset find end

})//Employee find end
  })//asset find end
})//req,res end
//------------------------------------------------------------------------------------------------------
//view asset_request from manager
router.get('/view_manager_request',(req,res)=>{
  Manager.find({Email_id:req.session.manager},(err,result)=>{
    if (err) throw err;
    else{
  var mid=result[0].Manager_id;
    ManagerRequest.find({Manager_id:mid},(err,result)=>{
      console.log(result);
      if (err) res.render('error');
      else if (result.length!=0)
      {
          var requestStatus=result.map((rec)=>{
             if(rec.Status==1)
             return "Pending with Manager";
             else if(rec.Status==2)
             return "Rejected by Support";
             else if(rec.Status==3)
             return "Pending with Support";
             else if(rec.Status==4)
             return "Rejected by Manager";
             else if(rec.Status==5)
             return "Approved";
          })//map end
          var finaldata=result.map((rec,index)=>{
           var pair={requestStatus:requestStatus[index]};
           var objs={...rec,...pair}
           return objs;
          })//finaldata end here
          //console.log("view my request from employee:"+finaldata);
          res.render('view_manager_request',{manager:req.session.manager,request:finaldata})

      }


      else
    res.render('view_manager_request',{manager:req.session.manager,msg:"no request found"})
  })//Manager request find
}
})//manager find end
});
//--------------------------------------------------------------------------------------------------------
//Manager can view their Asset
router.get('/view_manager_asset',(req,res)=>{

Manager.find({Email_id:req.session.manager},(err,result)=>{
  if (err) res.render('error');
  else
  {
     var mid=result[0].Manager_id;
     ManagerRequest.find({Manager_id:mid,Status:'5'},(err,result)=>{
       console.log(result);
       if (err) res.render('error')
       else
       {
         res.render('view_manger_asset',{ManagerRequest:result,manager:req.session.manager})
       }
     })//manager request find end here
  }
})//manager find end here
})//res, req end here
//---------------------------------------------------------------------------------------------------------
//transfer_manager_asset to another manager:-
router.get('/transfer_manager_asset',(req,res)=>{
  Manager.find({Email_id:req.session.manager},(err,result)=>{
    if(req.session.manager==null){res.render('login')}
    else if (err) {res.render('error')}
    else{
    // console.log(result);
     var mid=result[0].Manager_id;
    ManagerRequest.find({Manager_id:mid,Status:'5'},(err,result)=>{
       console.log(result);

        if (err) res.render('error');
        else
        res.render('transfer_manager_asset',{data:result,manager:req.session.manager})
    })//request find
  }
  })//employee find end

});
//-----------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------
//transfer_manager_asset_formaction
router.post('/transfer_manager_asset_formaction',(req,res)=>{
  var assetid=req.body.assetid;
  var to=req.body.transferto;
  var to_Employee_id=req.body.id;
  var comment=req.body.comment;

 Asset.find({id:assetid},(err,result)=>{
   if (err) throw err;
   else if(req.session.manager==null){res.render('login')}
   else {
     var assetname=result[0].name;
     Manager.find({Email_id:req.session.manager},(err,result)=>{
       if (err) throw err;
       else {
             var from_Manager_id=result[0].Manager_id;
             var mid=result[0].Manager_id;
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@22
//                Creating Transfer request
           var newtransfer=Transfer({
                      From_Employee_id:from_Manager_id,
                      To_Employee_id:to_Employee_id,
                      Manager_id:mid,
                      Assest_id:assetid,
                      Asset_name:assetname,
                      Transfer_Status:'2',//1.Approved  2. Not Approved 3. Reject
                      Comment:comment,
                  })
                  newtransfer.save().then((data)=>console.log("new Transfer request created by manager"+data));
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
ManagerRequest.update({Status:'5',Asset_id:assetid,Manager_id:mid},{Manager_id:to_Employee_id},(err,result)=>{
  if (err) throw err;
  else{
    res.render('managerhome',{manager:req.session.manager,success_msg:"Asset Transfered Successfully"})

  }
})
//-------------------------------------------------------------------------------------------------------------

}
})//manager find end here

}//else
})//asset find end here
})//req,res end
//----------------------------------------------------------------------------------------------------------------
//Manager Assign task to employee under him/here
router.get('/manager_assign_task',(req,res)=>{
  var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
   today = dd + '-' + mm + '-' + yyyy;
  Manager.find({Email_id:req.session.manager},(err,result)=>{
    if(req.session.manager==null){res.render('login')}
    else if (err) {res.render('error')}
    else{
    //console.log(result);
     var mid=result[0].Manager_id;
    Employee.find({Manager_id:mid,Status:'0'},(err,employee_data)=>{
       console.log(employee_data);

        if (err) res.render('error');
        else
        res.render('manager_assign_task',{employee_data:employee_data,manager:req.session.manager,today:today})
    })//request find
  }
  })//employee find end

});
//--------------------------------------------------------------------------------------------------------------------
//assign-task-from-manager formaction
router.post("/assign-task-from-manager",(req,res)=>{
Manager.find({Email_id:req.session.manager},(err,mresult)=>{
  var mid=mresult[0].Manager_id;
  ///---------------------------------------------
  var tname=req.body.tname;
  var tdescription=req.body.tdescription;
  var eid=req.body.eid;
  var deadline=req.body.deadline;
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@22
  //                Creating Task
             var newtask=Task({
               Task_name:tname,
               Task_description:tdescription,
               Deadline_date:deadline,
               Emp_id:eid,
               From_manager:mid,
               Status:'0', //(0-pending,1-unable to do,2-in progress,3-completed)
               Final_competion_status:'close',//(open or close),
               Final_rating:'',
               Feedback:'',
               Rating:'0',
               Total_task:'1',
               Completed:'0',
               Not_Completed:'0'
                    })
              newtask.save().then((data)=>console.log("new Task assign by manager"+data));
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  res.render('managerhome',{success_msg:"Task has been Assigned to Employee"})
})//manager find end here

})
//-----------------------------------------------------------------------------------------------------------------
//view_assigned_task_from_manager
router.get('/view_assigned_task_from_manager',(req,res)=>{
  Manager.find({Email_id:req.session.manager},(err,mresult)=>{
    if (err) throw err;
    else if(req.session.manager==null){res.render('login',{msg:"session expired"})}
    else
    {
    var mid=mresult[0].Manager_id;
    ///---------------------------------------------
   Task.find({From_manager:mid},(err,task_result)=>{
     if (err) throw err;
     else if (task_result.length!=0)
     {
         var requestStatus=task_result.map((rec)=>{
            if(rec.Status==0)
            return "Pending ";
            else if(rec.Status==1)
            return "Unable to do";
            else if(rec.Status==2)
            return "In-Progress";
            else if(rec.Status==3)
            return "Completed";
         })//map end
         var finaldata=task_result.map((rec,index)=>{
          var pair={requestStatus:requestStatus[index]};
          var objs={...rec,...pair}
          return objs;
         })//finaldata end here
     //console.log(task_result);
     res.render('view_assigned_task_from_manager',{manager:req.session.manager,task_result:finaldata})
}
else {
  res.render('view_assigned_task_from_manager',{manager:req.session.manager,msg:"No Tasks Assigned Yet "})

}
   })//task find end here
    }
  })//manager find end here
        });
//-----------------------------------------------------------------------------------------------------------
//inbox_of_manager
router.get('/inbox_of_manager',(req,res)=>{
  Manager.find({Email_id:req.session.manager},(err,result)=>{
    var mid=result[0].Manager_id;
    Message.find({To:mid},(err,msg_data)=>{
      if (err) throw err;
      else if (msg_data!=0)
       {
         res.render('manager_inbox',{manager:req.session.manager,msg_data:msg_data})

      }
      else {
        res.render('manager_inbox',{msg:"No data Found"})
      }
    })//Message

  })//manager
})
//------------------------------------------------------------------------------------------------------------
//update_feedback_and_rating_from_manager (form action)
router.post('/update_feedback_and_rating_from_manager',(req,res)=>{
  var feedback=req.body.feedback;
  var rating=req.body.rating;
  var eid=req.body.heid;
  var id=req.body.id;
  console.log(feedback);
  console.log(rating);
  console.log(eid);
  console.log(id);
  Task.updateOne({_id:id,Emp_id:eid},{Feedback:feedback,Rating:rating},(err,result)=>{
    if (err) throw err;
    else if (req.session.manager==null) { res.render('login',{msg:"Session Expired"})}
    else if (result.nModified>0)
    {


      Manager.find({Email_id:req.session.manager},(err,mresult)=>{
        if (err) throw err;
        else if(req.session.manager==null){res.render('login',{msg:"session expired"})}
        else
        {
        var mid=mresult[0].Manager_id;
        ///---------------------------------------------
       Task.find({From_manager:mid},(err,task_result)=>{
         if (err) throw err;
         else if (task_result.length!=0)
         {
             var requestStatus=task_result.map((rec)=>{
                if(rec.Status==0)
                return "Pending ";
                else if(rec.Status==1)
                return "Unable to do";
                else if(rec.Status==2)
                return "In-Progress";
                else if(rec.Status==3)
                return "Completed";
             })//map end
             var finaldata=task_result.map((rec,index)=>{
              var pair={requestStatus:requestStatus[index]};
              var objs={...rec,...pair}
              return objs;
             })//finaldata end here
         //console.log(task_result);
         res.render('view_assigned_task_from_manager',{manager:req.session.manager,task_result:finaldata,success_msg:"data updated"})
    }
    else {
      res.render('view_assigned_task_from_manager',{manager:req.session.manager,msg:"No  Assignments  Yet "})

    }
       })//task find end here
        }
      })//manager find end here




    }
    else
    {
      res.render('view_assigned_task_from_manager',{manager:req.session.manager,msg:"No Data found "})

    }
  })

});
//------------------------------------------------------------------------------------------------------------
//manager_reply_form _action
router.post('/manager_reply_form_action',(req,res)=>{
  var message=req.body.message;
  var to=req.body.to;
  var from=req.body.from;
  //console.log(to+"\n"+from+"\n"+message);
  Manager.find({Email_id:req.session.manager},(err,result)=>{
    var mid=result[0].Manager_id;
    Message.find({To:mid},(err,msg_data)=>{
      if (err) throw err;
      else if (msg_data!=0)
       {
         //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@22
         //                Creating message
                    var newmessage=Message({
                      Message:message,
                      To:to,
                      From:from,
                           })
                     newmessage.save().then((data)=>{});
         //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
         res.render('manager_inbox',{manager:req.session.manager,msg_data:msg_data,success_msg:"Message sent to employee"})

      }
      else {
        res.render('manager_inbox',{msg:"No data Found"})
      }
    })//Message

  })//manager
});
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                            // Support MODULE
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//---------------------------------------------------------------------------
router.get('/support_profile',(req,res)=>{
  Support.find({Email_id:req.session.support},(err,result)=>{
    res.render('support_profile',{data:result,support:req.session.support})

  })
})
//----------------------------------------------------------------------------
//form action of update employee
router.post('/update_support',(req,res)=>{
     Support.update({Support_id:req.body.Support_id},{First_name:req.body.fname,Last_name:req.body.lname,Password:req.body.pwd,Mobile:req.body.mno,Emaild:req.body.email},(err,result)=>{
     res.render('Supporthome',{support:req.session.support,success_msg:"Profile Successfully Updated ..!!!"})})})
//-----------------------------------------------------------------------------------------------------------
//view asset_request from employee
router.get('/view_pending_requests_from_support',(req,res)=>{

    Request.find({Status:'3'},(err,result1)=>{
      console.log(result1);
      if (err) res.render('error');
      else
      {
              var requestStatus=result1.map((rec)=>{
               if(rec.Status==1)
               return "Pending with Manager";
               else if(rec.Status==2)
               return "Rejected by Support";
               else if(rec.Status==3)
               return "Pending with Support";
               else if(rec.Status==4)
               return "Rejected by Manager";
               else if(rec.Status==5)
               return "Approved";
            })//map end
            var finaldata1=result1.map((rec,index)=>{
             var pair={requestStatus:requestStatus[index]};
             var objs={...rec,...pair}
             return objs;
           })//finaldata1 end here
        ManagerRequest.find({Status:'3'},(err,result2)=>{
          console.log(result2);
            if (err) throw err;
            else
              {
                  var requestStatus=result2.map((rec)=>{
                   if(rec.Status==1)
                   return "Pending with Manager";
                   else if(rec.Status==2)
                   return "Rejected by Support";
                   else if(rec.Status==3)
                   return "Pending with Support";
                   else if(rec.Status==4)
                   return "Rejected by Manager";
                   else if(rec.Status==5)
                   return "Approved";
                })//map end
                var finaldata2=result2.map((rec,index)=>{
                 var pair={requestStatus:requestStatus[index]};
                 var objs={...rec,...pair}
                 return objs;
               })//finaldata2 end here
                //console.log("view my request from employee:"+finaldata);
                res.render('view_pending_requests_from_support',{support:req.session.support,request:finaldata1,ManagerRequest:finaldata2})

            }


        })//manager request find end here
  }//else end here
  })//request find end

});
//-----------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------
//approve_by_support
router.get('/approve_by_support',(req,res)=>{
var eid=req.query.eid;
var assetid=req.query.aid;
Request.update({Emp_id:eid,Asset_id:assetid},{Status:'5'},(err,result)=>{
  if (err) res.render('error')
else if (req.session.support==null) res.render('login',{msg:"Session Expired"})
else if (result.nModified>0)
{
    Request.find({Status:'3'},(err,result)=>{
      //console.log(result);
      if (err) res.render('error');
      else
    res.render('view_pending_requests_from_support',{support:req.session.support,request:result,success_msg:"Employee Request Approved"})
  })//request find



}//else if end
else  res.render('view_pending_requests_from_support',{msg:"Employee Request Approval Failed..!!!! Please Try Agian..!!"})

})//Request find ends
});//req,res end here
//---------------------------------------------------------------------------------------------------------
//reject_by_support
router.get('/reject_by_support',(req,res)=>{
var eid=req.query.eid;
var assetid=req.query.aid;
Request.update({Emp_id:eid,Asset_id:assetid},{Status:'2'},(err,result)=>{
  if (err) res.render('error')
  else if (req.session.support==null) res.render('login',{msg:"Session Expired"})
else if (result.nModified>0)
{
    Request.find({Status:'3'},(err,result)=>{
      //console.log(result);
      if (err) res.render('error');
      else
    res.render('view_pending_requests_from_support',{support:req.session.support,request:result,success_msg:"Employee Request Rejected"})
  })//request find



}//else if end here
else  res.render('view_pending_requests_from_support',{msg:"Employee Request Reject Failed..!!!! Please Try Agian..!!"})

})//Request find ends
});//req,res end here
//---------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------
//approve_by_support1
router.get('/approve_by_support1',(req,res)=>{
var mid=req.query.mid;
var assetid=req.query.aid;
ManagerRequest.update({Manager_id:mid,Asset_id:assetid},{Status:'5'},(err,result)=>{
  if (err) res.render('error')
else if (req.session.support==null) res.render('login',{msg:"Session Expired"})
else if (result.nModified>0)
{
    ManagerRequest.find({Status:'3'},(err,result)=>{
      //console.log(result);
      if (err) res.render('error');
      else
    res.render('view_pending_requests_from_support',{support:req.session.support,request:result,success_msg:"Manager Request Approved"})
  })//request find



}//else if end
else  res.render('view_pending_requests_from_support',{msg:"Manager Request Approval Failed..!!!! Please Try Agian..!!"})

})//Request find ends
});//req,res end here
//---------------------------------------------------------------------------------------------------------
//reject_by_support1
router.get('/reject_by_support1',(req,res)=>{
var mid=req.query.mid;
var assetid=req.query.aid;
ManagerRequest.update({Manager_idManager:mid,Asset_id:assetid},{Status:'2'},(err,result)=>{
  if (err) res.render('error')
  else if (req.session.support==null) res.render('login',{msg:"Session Expired"})
else if (result.nModified>0)
{
    ManagerRequest.find({Status:'3'},(err,result)=>{
      //console.log(result);
      if (err) res.render('error');
      else
    res.render('view_pending_requests_from_support',{support:req.session.support,request:result,success_msg:"Manager Request Rejected"})
  })//request find



}//else if end here
else  res.render('view_pending_requests_from_support',{msg:"Manager Request Reject Failed..!!!! Please Try Agian..!!"})

})//Request find ends
});//req,res end here
//-------------------------------------------------------------------------------------------------------------
//support_reports
router.get('/support_report',(req,res)=>{
  Request.find({Status:'5'},(err,request)=>{
    if (err) throw err;
    else {
      ManagerRequest.find({Status:'5'},(err,managerRequest)=>{
         if (err) throw err;
         else{
           console.log(request);
           console.log(managerRequest);
             res.render('support_report',{support:req.session.support,request:request,managerRequest:managerRequest})

         }

      })
    }
  })

})

//###########################################################################
  module.exports=router;                                                    //#
//##########################################################################
