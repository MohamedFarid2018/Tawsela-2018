const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Passenger = require('../model/passengers/schema').Passenger;
const Driver = require('../model/drivers/schema').Driver;

const bcrypt = require('bcryptjs');

router.get('/', function(req, res, next) {
    res.send("Profile");
});




//el email wl phone a3ml search 3alehom fl driver wl passenger wna b3ml signup w wna b3ml update







router.post('/',function(req, res){
    console.log(req.body);
    console.log("Request on updateProfile");
    try{
        var token = jwt.verify(req.body.token, 'Garry Kasparov');
        //for further checking the token value if it's expired
        console.log('valid token verification');   
    }catch(err){
        console.log('Invalid Token that came from Passenger in updateProfile');
        console.log(err.message);
        res.status(201).json({token:"",message:'invalid Token'});
    }
    if(req.body.type === "p"){
        console.log('p check'); 
        Passenger.findOne({'Id':token.Id},'_id',function(err,profile){
            if(err)
            {
                res.status(201).json({token:"",message:'Passenger Not Found in Database'});
                console.log(err.message);
            }
            else{
                 if(req.body.attribute === "name"){
                    console.log("Passenger Want to Upadate Name");
                    var str = req.body.value;
                    var result = str.split(",");
                    console.log(result);
                    Passenger.findByIdAndUpdate({'_id':profile._id},{"fname":result[0],"lname":result[1]},function(err,profile){
                        if(err){
                            console.log("error updating passenger Name");
                            console.log(err.message);
                        }else{
                            res.status(201).json({token:"",message:'Passenger Name Updated Successfully'});
                        }
                    
                        })
                    }
                    else if(req.body.attribute === "email"){
                        console.log("Passenger Want to Upadate Email");
                        console.log(req.body.value);

                        Passenger.findOne({"email":req.body.value},"_id",function(err,exist){
                            if(err)
                            {
                                console.log(err.message);
                            
                            }else if(!exist){

                                Passenger.findByIdAndUpdate({'_id':profile._id},{"email":req.body.value},function(err,profile){
                                    if(err){
                                        console.log("error updating passenger Email");
                                        console.log(err.message);
                                    }else{
                                        res.status(201).json({token:"",message:'Passenger Email Updated Successfully'});
                                    }
                                
                                })

                            }else if(exist) {
                                var x = (String(exist._id) == String(profile._id));
                                console.log("X is: " + x)
                                if(x == true){
                                    console.log("profile._id: " + profile._id)
                                    Driver.findByIdAndUpdate({'_id':profile._id},{"email":req.body.value},function(err,profile){
                                        if(err){
                                            console.log("error updating Driver email");
                                            console.log(err.message);
                                        }else{
                                            res.status(201).json({token:"",message:'Passenger email Updated Successfully "old Email"'});
                                        }
                                    
                                    })  

                                }else{

                                    console.log("FALSE as: " + exist._id + "   " + profile._id)
                                    res.status(201).json({token:"",message:'This Email is exist'});

                                }
                            }    
                        })

                        }
                    else if(req.body.attribute === "phone"){
                        console.log("Passenger Want to Upadate Phone");
                        console.log(req.body.value);

                        Passenger.findOne({"phone":req.body.value},"_id",function(err,exist){
                            if(err)
                            {
                                console.log(err.message);
                            
                            }else if(!exist){

                                Passenger.findByIdAndUpdate({'_id':profile._id},{"phone":req.body.value},function(err,profile){
                                    if(err){
                                        console.log("error updating passenger Phone");
                                        console.log(err.message);
                                    }else{
                                        res.status(201).json({token:"",message:'Passenger Phone Updated Successfully "old Phone"'});
                                    }
                                
                                    })

                            }else if(exist) {
                                var x = (String(exist._id) == String(profile._id));
                                console.log("X is: " + x)
                                if(x == true){
                                    console.log("profile._id: " + profile._id)
                                    Driver.findByIdAndUpdate({'_id':profile._id},{"phone":req.body.value},function(err,profile){
                                        if(err){
                                            console.log("error updating Driver phone");
                                            console.log(err.message);
                                        }else{
                                            res.status(201).json({token:"",message:'Driver phone Updated Successfully'});
                                        }
                                    
                                    })  

                                }else{

                                    console.log("FALSE as: " + exist._id + "   " + profile._id)
                                    res.status(201).json({token:"",message:'This phone is exist'});

                                }
                            }    
                        })
                        
                        }
                    else if(req.body.attribute === "city"){
                        console.log("Passenger Want to Upadate City");
                        console.log(req.body.value);
                         Passenger.findByIdAndUpdate({'_id':profile._id},{"city":req.body.value},function(err,profile){
                            if(err){
                                console.log("error updating passenger City");
                                console.log(err.message);
                            }else{
                                res.status(201).json({token:"",message:'Passenger City Updated Successfully'});
                            }
                        
                            })
                        }
                    else if(req.body.attribute == "password"){
                        console.log("Passenger Want to Upadate Password");
                        console.log(req.body.value);
                        var str = req.body.value;
                        var result = str.split(",");
                        console.log(result);
                        Passenger.findOne({'Id':token.Id},'_id password',function(err,passenger){
                            if(err){
                                  console.log('Error Getting Passenger from DataBase (Invalid Passenger)');
                                  console.log(err.message);
                              } 
                            else{
                                console.log('Passenger Found Successfully');
                                console.log(passenger);
                                console.log(passenger.password);
                              //////////n3ml fl schema 7aga esmha el last password zy el face kda a2olo en da nta kont 3amlo  w 8yrto
                              if(bcrypt.compareSync(result[0],passenger.password)){
                                  console.log(passenger.password);
                                  console.log("Correct Password");
                                  var salt = bcrypt.genSaltSync(10);
                                  var hash = bcrypt.hashSync(result[1],salt);
                                  Passenger.findByIdAndUpdate({'_id':passenger._id},{password:hash},{new:true},function(err,updated){
                                      if(err){
                                          console.log('Error Updating Passenger Password in DataBase');
                                          console.log(err.message);
                                          }
                                      
                                      var obj = {'Id':updated.Id};
                                      var token = jwt.sign(obj,"Garry Kasparov");
                                      
                                      res.status(201).json({token:"",message:'Password Updated Successfully'});
                                      console.log("Password Updated Successfully");
                                      
                                  })
                              }
                              else{
                                  res.status(201).json({token:"false",message:'Old Password is Wrong'});
                                  console.log("Old Password is Wrong")
                              }
                            }
                                          
                          })

                        }
                }
        });
    }else if(req.body.type === "d"){
        console.log('d check'); 
        Driver.findOne({'Id':token.Id},'_id',function(err,profile){
            if(err)
            {
                res.status(201).json({token:"",message:'Driver Not Found in Database'});
                console.log(err.message);
            }
            else{
                 if(req.body.attribute === "name"){
                    console.log("Driver Want to Upadate Name"); 
                    var str = req.body.value;
                    var result = str.split(",");
                    console.log(result);
                    Driver.findByIdAndUpdate({'_id':profile._id},{"fname":result[0],"lname":result[1]},function(err,profile){
                        if(err){
                            console.log("error updating Driver Name");
                            console.log(err.message);
                        }else{
                            res.status(201).json({token:"",message:'Driver Name Updated Successfully'});
                        }
                    
                        })
                    }
                    else if(req.body.attribute === "email"){
                        console.log("Driver Want to Upadate Email");
                        console.log(req.body.value);
                        Driver.findOne({"email":req.body.value}," _id ",function(err,exist){ 
                            if(err)
                            {
                                console.log(err.message);
                            
                            }else if(!exist){
                                console.log("profile._id: " + profile._id)
                                Driver.findByIdAndUpdate({'_id':profile._id},{"email":req.body.value},function(err,profile){
                                    if(err){
                                        console.log("error updating Driver Email");
                                        console.log(err.message);
                                    }else{
                                        res.status(201).json({token:"",message:'Driver Email Updated Successfully "old Email"'});
                                    }
                                
                                })

                            }else if(exist) {
                                var x = (String(exist._id) == String(profile._id));
                                console.log("X is: " + x)
                                if(x == true){
                                    console.log("profile._id: " + profile._id)
                                    Driver.findByIdAndUpdate({'_id':profile._id},{"email":req.body.value},function(err,profile){
                                        if(err){
                                            console.log("error updating Driver Email");
                                            console.log(err.message);
                                        }else{
                                            res.status(201).json({token:"",message:'Driver Email Updated Successfully'});
                                        }
                                    
                                    })  

                                }else{

                                    console.log("FALSE as: " + exist._id + "   " + profile._id)
                                    res.status(201).json({token:"",message:'This Email is exist'});

                                }
                            }                    
                        })

                        }
                    else if(req.body.attribute === "phone"){
                        console.log("Driver Want to Upadate Phone");
                        console.log(req.body.value);

                        Driver.findOne({"phone":req.body.value},"_id",function(err,exist){
                            if(err)
                            {
                                console.log(err.message);
                            
                            }else if(!exist){

                                Driver.findByIdAndUpdate({'_id':profile._id},{"phone":req.body.value},function(err,profile){
                                    if(err){
                                        console.log("error updating Driver Phone");
                                        console.log(err.message);
                                    }else{
                                        res.status(201).json({token:"",message:'Driver Phone Updated Successfully "old Phone"'});
                                    }
                                
                                    })

                            }else if(exist) {
                                var x = (String(exist._id) == String(profile._id));
                                console.log("X is: " + x)
                                if(x == true){
                                    console.log("profile._id: " + profile._id)
                                    Driver.findByIdAndUpdate({'_id':profile._id},{"phone":req.body.value},function(err,profile){
                                        if(err){
                                            console.log("error updating Driver phone");
                                            console.log(err.message);
                                        }else{
                                            res.status(201).json({token:"",message:'Driver phone Updated Successfully'});
                                        }
                                    
                                    })  

                                }else{

                                    console.log("FALSE as: " + exist._id + "   " + profile._id)
                                    res.status(201).json({token:"",message:'This Phone is exist'});

                                }
                            }      
                        })
                        
                        }
                    else if(req.body.attribute === "city"){
                        console.log("Driver Want to Upadate City");
                        console.log(req.body.value);
                        Driver.findByIdAndUpdate({'_id':profile._id},{"city":req.body.value},function(err,profile){
                            if(err){
                                console.log("error updating Driver City");
                                console.log(err.message);
                            }else{
                                res.status(201).json({token:"",message:'Driver City Updated Successfully'});
                            }
                        
                            })
                        }
                    else if(req.body.attribute == "password"){
                        console.log("Driver Want to Upadate Password");
                        console.log(req.body.value);
                        var str = req.body.value;
                        var result = str.split(",");
                        console.log(result);
                        Driver.findOne({'Id':token.Id},'_id password',function(err,driver){
                            if(err){
                                  console.log('Error Getting Driver from DataBase (Invalid Driver)');
                                  console.log(err.message);
                              } 
                            else{
                                console.log('Driver Found Successfully');
                                console.log(driver);
                                console.log(driver.password);
                              //////////n3ml fl schema 7aga esmha el last password zy el face kda a2olo en da nta kont 3amlo  w 8yrto
                              if(bcrypt.compareSync(result[0],driver.password)){
                                  console.log(driver.password);
                                  console.log("Correct Password");
                                  var salt = bcrypt.genSaltSync(10);
                                  var hash = bcrypt.hashSync(result[1],salt);
                                  Driver.findByIdAndUpdate({'_id':driver._id},{password:hash},{new:true},function(err,updated){
                                      if(err){
                                          console.log('Error Updating Driver Password in DataBase');
                                          console.log(err.message);
                                          }
                                      
                                      var obj = {'Id':updated.Id};
                                      var token = jwt.sign(obj,"Garry Kasparov");
                                      
                                      res.status(201).json({token:"",message:'Password Updated Successfully'});
                                      console.log("Password Updated Successfully");
                                      
                                  })
                              }
                              else{
                                  res.status(201).json({token:"false",message:'Old Password is Wrong'});
                                  console.log("Old Password is Wrong")
                              }
                            }
                                          
                          })

                        }
                }
        });
    }
});

module.exports=router;