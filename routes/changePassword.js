const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Passenger = require('../model/passengers/schema').Passenger;
const Driver = require('../model/drivers/schema').Driver;
const bcrypt = require('bcryptjs');

router.get('/', function(req, res, next) {
    res.json("change Password");
});
// el body feeh el type token wl old w new password
router.post('/',function(req, res){
    console.log("Change Password");
    console.log(req.body);
    var checkType = req.body.type;
    
    try{
            var token = jwt.verify(req.body.token, 'Garry Kasparov');
             console.log("Valid Token")
        }catch(err){
            console.log('Invalid Token that came from Driver in change Password');
            console.log(err.message);
            return;
        }
    
    if(checkType === 'p'){     
        console.log('Passenger change Password');
       
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
            if(bcrypt.compareSync(req.body.oldPassword,passenger.password)){
                console.log(passenger.password);
                console.log("Correct Password");
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(req.body.newPassword,salt);
                Passenger.findByIdAndUpdate({'_id':passenger._id},{password:hash},{new:true},function(err,updated){
                    if(err){
                        console.log('Error Updating Passenger Password in DataBase');
                        console.log(err.message);
                        }
                    
                    var obj = {'Id':updated.Id};
                    var token = jwt.sign(obj,"Garry Kasparov");
                    
                    res.status(201).json({token:token,message:'Password Updated Successfully'});
                    console.log("Password Updated Successfully");
                    
                })
            }
            else{
                res.status(409).json({token:"",message:'Wrong Password'});
                console.log("Wrong Password")
            }
          }
                        
        })
       
    }else if(checkType === 'd'){
        
        
        Driver.findOne({'Id':token.Id},'_id password fname',function(err,driver){
          if(err){
                console.log('Error Getting Driver from DataBase (Invalid Driver)');
                console.log(err.message); 
            } 
          else{
              console.log(driver);
              console.log('Driver Found Successfully');
              console.log("driver password : " + driver.password);
            //////////n3ml fl schema 7aga esmha el last password zy el face kda a2olo en da nta kont 3amlo  w 8yrto
            if(bcrypt.compareSync(req.body.oldPassword,driver.password)){
                console.log("Correct Password");
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(req.body.newPassword,salt);
                Driver.findByIdAndUpdate({'_id':driver._id},{password:hash},{new:true},function(err,updated){
                    if(err){
                        console.log('Error Updating Driver Password in DataBase');
                        console.log(err.message);
                        }
                    
                    var obj = {'Id':updated.Id};
                    var token = jwt.sign(obj,"Garry Kasparov");
                    
                    res.status(201).json({token:token,message:'Password Updated Successfully'});
                    console.log("Password Updated Successfully");
                    
                })
            }
            else{
                res.status(409).json({token:"",message:'Wrong Password'});
                console.log("Wrong Password")
            }
          }
                        
        })
        
    }
        
    });
    module.exports = router;