const router = require('express').Router();
const jwt = require('jsonwebtoken');
var nodemailer = require("nodemailer");
const Passenger = require('../model/passengers/schema').Passenger;
const Driver = require('../model/drivers/schema').Driver;
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
//var mailer = require('node-mailer');
var resetCode;
router.get('/', function(req, res, next) {
    res.json("forget Password");
});
router.post('/',function(req, res){
    console.log("forget Password");
    console.log(req.body);
    var checkType = req.body.type;
    
    // request : type email resetCode newPassword
    if(req.body.resetCode && req.body.newPassword){
        console.log("check resetcode");
        
        if(checkType === 'p'){
            Passenger.findOne({'email':req.body.email},'_id password resetCode password email temporaryDate',function(err,passenger){
                
                if(err){
                    res.status(409).json({token:"",message:'Wrong Passenger'});
                    console.log("Wrong Passenger");
                    console.log(err.message);
                }
                else{
                    if(req.body.resetCode == passenger.resetCode)
                    {
                        if(((new Date(Date.now()) - passenger.temporaryDate)/(1000*60))>3)
                        {
                            console.log("Code is expired");
                            var x = (new Date(Date.now()) - passenger.temporaryDate)/(1000*60);
                            console.log("Last code time: " + passenger.temporaryDate);
                            console.log("Time now: " + new Date(Date.now()));
                            console.log("the difference time is: " + x + " Min");
                            res.status(409).json({token:"",message:'Code is expired'});                           
                        }
                        else
                        {
                            console.log(passenger.resetCode);
                                console.log('Correct Code');
                                var salt = bcrypt.genSaltSync(10);
                                var hash = bcrypt.hashSync(req.body.newPassword,salt);
                                Passenger.findByIdAndUpdate({'_id':passenger._id},{password:hash},{new:true},function(err,passenger){
                                    if(err){
                                        console.log("Error updating Passenger Password");
                                        console.log(err.message);
                                    }
                                    res.status(201).json({token:"",message:'Password updated successfully'});
                                    console.log("Passenger new Password Updated Successfully");
                                }); 
                    }
                } else{
                    res.status(409).json({token:"",message:'Wrong Code'});
                    console.log('Wrong Code');
                }
            }
            });
         }
        else if(checkType === 'd'){

            Driver.findOne({'email':req.body.email},'_id password resetCode password email temporaryDate',function(err,driver){
                
                if(err){
                    res.status(409).json({token:"",message:'Wrong Driver'});
                    console.log("Wrong Driver");
                    console.log(err.message);
                }
                else{
                    if(req.body.resetCode == driver.resetCode){
                        if(((new Date(Date.now()) - driver.temporaryDate)/(1000*60))>3)
                        {
                            console.log("Code is expired");
                            var x = (new Date(Date.now()) - driver.temporaryDate)/(1000*60);
                            console.log("Last code time: " + driver.temporaryDate);
                            console.log("Time now: " + new Date(Date.now()));
                            console.log("the difference time is: " + x + " Min");
                            res.status(409).json({token:"",message:'Code is expired'});
                        }
                        else
                        {
                            console.log(driver.resetCode);       
                                console.log('Correct Code');
                                var salt = bcrypt.genSaltSync(10);
                                var hash = bcrypt.hashSync(req.body.newPassword,salt);
                                Driver.findByIdAndUpdate({'_id':driver._id},{password:hash},{new:true},function(err,driver){
                                    if(err){
                                        console.log("Error updating Driver Password");
                                        console.log(err.message);
                                    }
                                    res.status(201).json({token:"",message:'Password updated successfully'});
                                    console.log("Driver new Password Updated Successfully");
                                });
                    }
                 }else{
                    res.status(409).json({token:"",message:'Wrong Code'});
                    console.log('Wrong Code');
            }
                }
            });
            
        }
    }

    //request hyb2a feeh el type wl email
else if(req.body.status){
    if(checkType === 'p'){     
        console.log('Passenger Forget Password');
       
        Passenger.findOne({'email':req.body.email},'_id password email',function(err,passenger){
          if(err){
                res.status(409).json({token:"",message:'Wrong Email'});
                console.log('Wrong Email valid Passenger');
                console.log(err.message);
            } 
          else{
              console.log('Passenger Found Successfully');
              console.log(passenger);
            //////////n3ml fl schema 7aga esmha el last password zy el face kda a2olo en da nta kont 3amlo  w 8yrto
               

                var resetCode = Math.floor(Math.random()*1000000);
// create reusable transport method (opens pool of SMTP connections)
                var transporter = nodemailer.createTransport({
                    service: "Gmail",
                    secure: false,
                    port: 25,
                    auth: {      
                        user: "twsela2018@gmail.com",
                        pass: "0126517426"
                    },
                });
              var mailOptions = {
                from: '"Twsela" <twsela2018@gmail.com>', // sender address
                to: String(passenger.email), // list of receivers
                subject: "Reset Password", // Subject line
                text: "Your Reset Code is : " + String(resetCode)
                }
                
              transporter.sendMail(mailOptions, function(error, response){
                if(error){
                    console.log(error);
                }else{
                    console.log("Message sent: " + JSON.stringify(response));
                }
                }); 
                
                Passenger.findByIdAndUpdate({'_id':passenger._id},{resetCode:resetCode,temporaryDate:new Date()},{new:true},function(err,updated){
                    if(err){
                          res.status(409).json({token:"",message:'Error Updating resetCode'});
                          console.log('DataBase Error)');
                          console.log(err.message);
                      }else{
                        if(req.body.status == "false"){
                        res.status(201).json({token:"",message:'Code Sent Successfully , Go and Check Your Inbox'});
                        console.log("Code Sent Successfully");
                        console.log("The Code is : " + updated.resetCode);
                      }
                      else if(req.body.status == "true"){
                        res.status(201).json({token:"",message:'Another Code Sent Successfully , Go and Check Your Inbox'});
                        console.log("Another Code Sent Successfully");
                        console.log("The Code is : " + updated.resetCode);
                        }
                    }
                    }
                )};
                         
        });
       
    }else if(checkType === 'd'){
        
        
        console.log('Driver Forget Password');
       
        Driver.findOne({'email':req.body.email},'_id password email',function(err,driver){
          if(err){
                res.status(409).json({token:"",message:'Wrong Email'});
                console.log('Wrong Email valid Driver');
                console.log(err.message);
            } 
          else{     
              console.log('Driver Found Successfully');
              console.log(driver);
            //////////n3ml fl schema 7aga esmha el last password zy el face kda a2olo en da nta kont 3amlo  w 8yrto
               

                //var resetCode = Math.floor(process.hrtime()[1]/1000);
                var resetCode = Math.floor(Math.random()*1000000); 
                console.log(resetCode);
// create reusable transport method (opens pool of SMTP connections)
                var transporter = nodemailer.createTransport({
                    service: "Gmail",
                    secure: false,
                    port: 25,
                    auth: {      
                        user: "twsela2018@gmail.com",
                        pass: "0126517426"
                    },
                });
              var mailOptions = {
                from: '"Twsela" <twsela2018@gmail.com>', // sender address
                to: String(driver.email), // list of receivers
                subject: "Reset Password", // Subject line
                text: "Your Reset Code is : " + String(resetCode)
                }
              transporter.sendMail(mailOptions, function(error, response){
                if(error){
                    console.log("Error Here");
                    console.log(error.message);
                }else{
                    console.log("Message sent: " + JSON.stringify(response));
                }
                }); 
                
                Driver.findByIdAndUpdate({'_id':driver._id},{resetCode:resetCode,temporaryDate:new Date()},{new:true},function(err,updated){
                    if(err){
                          res.status(409).json({token:"",message:'Error Updating resetCode'});
                          console.log('DataBase Error)');
                          console.log(err.message);
                      }else{
                        if(req.body.status == "false"){
                            res.status(201).json({token:"",message:'Code Sent Successfully , Go and Check Your Inbox'});
                            console.log("Code Sent Successfully");
                            console.log("The Code is : " + updated.resetCode);
                            }
                        else if(req.body.status == "true"){
                            res.status(201).json({token:"",message:'Another Code Sent Successfully , Go and Check Your Inbox'});
                            console.log("Another Code Sent Successfully");
                            console.log("The Code is : " + updated.resetCode);
                            }
                      
                    }
                    }
                )};
                         
    });
}
}
});
module.exports = router; 