const express = require('express');
const bcrypt = require('bcryptjs');
const Passenger = require('../model/passengers/schema').Passenger;
const Driver = require('../model/drivers/schema').Driver;
//const Car = require('../model/drivers/schema').Car;
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const path =  require('path').join(__dirname,'../public/html/signup.html');
const router = express.Router();
function generateUniqueId(prefix = ''){
    if(typeof prefix != 'string'){
        process.emitWarning('The prefix you entered is not a string, ignoring');
        prefix = '';
    }
    return `${(prefix?prefix + '-':prefix)
            +Date.now()
            +process.hrtime()[1]
            +crypto.randomBytes(5).toString('hex').substr(0,8)
            }`;
} 
router.get('/', function(req, res, next) {
    res.sendFile(path, { "Content-Type": "text/html" });
});
router.post('/',function(req, res){
        try{
        var checkType = req.body.type, obj, token, salt, hash, Id;

        obj = { fname:req.body.fname,lname:req.body.lname,email:req.body.email,
            phone:req.body.phone,password:req.body.password,city:req.body.city
        };
        if(checkType === 'p'){      //passenger signup
            Passenger.find({phone:obj.phone}).then(function(temp){
                if(temp.length !== 0){
                    throw Error('Passenger Already exists');
                }
                salt = bcrypt.genSaltSync(10);
                hash = bcrypt.hashSync(obj.password,salt);
                Id = generateUniqueId('pId');
                console.log(Id);
                token = jwt.sign({'Id':Id},'Garry Kasparov');
                var passenger = new Passenger({
                    Id:Id,
                    fname : obj.fname,
                    lname : obj.lname,
                    email : obj.email,
                    phone : obj.phone,
                    password : hash,
                    token:token,
                    city : obj.city,
                    date: new Date(),
                    rate:5,
                    numOfTrips:0,
                    temporaryDate: new Date() 
                });
                passenger.save(function(err,saved){
                    if(err){
                        console.log(err.message);
                        console.log('DataBase Error User Already Exist');
                        res.status(409).json({token:"",message:'Passenger Already Exists'});
                    }
                    else{
                        res.status(201).json({token:token,message:"Passenger Added successfully"});
                    }
                });
            }).catch(function(err){
                console.log(err.message);
                console.log('DataBase Error during saving the passenger data');
                res.status(409).json({token:"",message:'User Already Exists'});
            });
            // console.log(obj);
            //  var decoded = jwt.verify(token, 'Garry Kasparov',function(err, decoded){
            //      if(err){
            //         console.log(err);
            //      }
            //      return decoded;
            //  });
            //console.log(obj.password);

        }else if(checkType === 'd'){      //driver signup
            Driver.find({phone:obj.phone}).then(function(temp){
                if(temp.length !== 0){
                    throw Error('Driver Already exists');
                }
                salt = bcrypt.genSaltSync(10);
                hash = bcrypt.hashSync(obj.password, salt);
                Id = generateUniqueId('dId');
                token = jwt.sign({'Id':Id},'Garry Kasparov');
                var driver = new Driver({
                    Id:Id,
                    fname : obj.fname,
                    lname : obj.lname,
                    email : obj.email,
                    phone : obj.phone,
                    password : hash,
                    token:token,
                    city : obj.city,
                    rate: 5,
                    date: new Date(),
                    numOfTrips:0,
                    temporaryDate: new Date() 
                });
                driver.save(function(err, saved){
                    if(err){
                        console.log(err.message);
                        console.log('DataBase Error during saving the driver data1');
                        res.status(409).json({token:"",message:'Driver Already Exists in Saving'});
                    }else{
                        res.status(201).json({token:token,message:"Driver Added successfully"});
                    }
                });
                //if the user already exists
            }).catch(function(err){
                console.log(err.message);
                console.log('DataBase Error during saving the driver data2');
                res.status(409).json({token:"",message:'Driver Already Exists in find'});
            });

        }else{
             res.json({message:'You must provide type'});
        }
    }catch(err){
            console.log('Internal Server Error');
            console.log(err);
            res.status(500).json({token:"",message:'Internal Server Error'});
        }
});
module.exports = router;
