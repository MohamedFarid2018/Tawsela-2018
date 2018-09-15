const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Passenger = require('../model/passengers/schema').Passenger;
const Driver = require('../model/drivers/schema').Driver;
const bcrypt = require('bcryptjs');
const path =  require('path').join(__dirname,'../public/html/login.html');


router.get('/', function(req, res, next) {
    res.sendFile(path, { "Content-Type": "text/html" });
});
router.post('/',function(req, res){
    var checkType = req.body.type, ePhone, password, decoded, checkEmail, obj, token;
    if(!(req.body.user && req.body.password)){
        console.log('Failed Login Data');
         res.status(401).json({token:"",message:"empty user/password"});
    }
    ePhone = new Buffer(req.body.user, 'base64').toString('ascii');
    password = new Buffer(req.body.password, 'base64').toString('ascii');
    decoded = {ePhone:ePhone, password:password};

    console.log(decoded.ePhone);
    console.log(decoded.password);

    if(decoded.ePhone.search('@')!=-1){
        checkEmail = true;
    }else{ checkEmail = false;}
    console.log(checkEmail);

    if(checkType === 'p'){      //passenger login

        if(!checkEmail){
            Passenger.find({'phone':decoded.ePhone},'phone password Id',function(err, passenger){
                console.log(passenger);
                if(err){
                    console.log('Database Error');
                    res.status(500).json({token:"",message:'Internal Server Error'});
                }else if(!passenger.length){
                    console.log('The phone you Entered doesn\'t exist');
                    res.status(409).json({token:"",message:'The phone you Entered doesn\'t exist'});
                }else if(passenger){
                    if(bcrypt.compareSync(decoded.password,passenger[0].password)){
                        obj = {'Id':passenger[0].Id}
                        console.log(obj);
                        token = jwt.sign(obj,'Garry Kasparov');
                        console.log(token);
                        //Asyncronous code but working well
                        Passenger.findByIdAndUpdate(passenger[0]._id, {token:token},{new:true}).then(
                            function(updated){
                                console.log(updated);
                            }).catch(function(err){
                                console.log(err.message);
                                res.status(401).json({token:token,message:'Error Updateing the token'});
                            });
                        console.log('authenticated successfully');
                        res.status(201).status(201).json({token:token,message:'Passenger authenticated successfully'});
                    }else{
                        console.log('Wrong Password');
                        res.status(409).json({token:"",message:'Wrong Password'});
                    }
                }
            });
        }else if(checkEmail){
            Passenger.find({'email':decoded.ePhone},'email password Id',function(err, passenger){
                console.log("Passenger : "+ passenger);
                if(err){
                    console.log('Database Error');
                    res.status(500).json({token:"",message:'Internal Server Error'});
                }else if(!passenger.length){
                    console.log('The email you Entered doesn\'t exist');
                    res.status(409).json({token:"",message:'The email you Entered doesn\'t exist'});
                }else if(passenger){
                    if(bcrypt.compareSync(decoded.password,passenger[0].password)){
                        obj = {'Id':passenger[0].Id}
                        console.log(obj);
                        token = jwt.sign(obj,'Garry Kasparov');
                        console.log(token);
                        //Asyncronous code but working well
                        Passenger.findByIdAndUpdate(passenger[0]._id, {token:token},{new:true}).then(
                            function(updated){
                                console.log(updated);
                                console.log('authenticated successfully');
                                res.status(201).json({token:token,message:"Passenger authenticated successfully"});
                            }).catch(function(err){
                                console.log(err.message);
                                res.status(401).json({token:token,message:'Error Updateing the token'});
                            });
                    }else{
                        console.log('Wrong Password');
                        res.status(409).json({token:"",message:'Wrong Password'});
                    }
                }
            });
        }else{
            console.log('There is no email or phone sent');
            res.status().json({token:"",message:'Internal Server Error'});
        }
    }else if(checkType === 'd'){
        if(!checkEmail){
            Driver.find({'phone':decoded.ePhone},'phone password Id',function(err, driver){
                console.log(driver);
                if(err){
                    console.log('Database Error');
                    res.status(500).json({token:"",message:'Internal Server Error'});
                }else if(driver.length === 0){
                    console.log('The phone you Entered doesn\'t exist');
                    res.status(409).json({token:"",message:'The phone you Entered doesn\'t exist'});
                }else if(driver){
                    if(bcrypt.compareSync(decoded.password,driver[0].password)){
                        obj = {'Id':driver[0].Id}
                        console.log(obj);
                        token = jwt.sign(obj,'Garry Kasparov');
                        console.log(token);
                        //Asyncronous code but working well
                        Driver.findByIdAndUpdate(driver[0]._id, {token:token},{new:true}).then(
                            function(updated){
                                console.log(updated);
                            }).catch(function(err){
                                console.log(err.message);
                                res.status(401).json({token:token,message:'Error Updating the token'});
                        });
                        console.log('authenticated successfully');
                        res.status(201).status(201).json({token:token,message:'Driver authenticated successfully'});
                    }else{
                        console.log('Wrong Password');
                        res.status(409).json({token:"",message:'Wrong Password'});
                    }
                }
            });
        }else if(checkEmail){
            Driver.find({'email':decoded.ePhone},'email password Id',function(err, driver){
                if(err){
                    console.log('Database Error');
                    res.status(500).json({token:"",message:'Internal Server Error'});
                }else if(driver.length === 0){
                    console.log('The email you Entered doesn\'t exist');
                    res.status(409).json({token:"",message:'The email you Entered doesn\'t exist'});
                }else if(driver){
                    if(bcrypt.compareSync(decoded.password,driver[0].password)){
                        obj = {'Id':driver[0].Id}
                        console.log(obj);
                        token = jwt.sign(obj,'Garry Kasparov');
                        console.log(token);
                        //Asyncronous code but working well
                        Driver.findByIdAndUpdate(driver[0]._id, {token:token},{new:true}).then(
                            function(updated){
                                console.log(updated);
                            }).catch(function(err){
                                console.log(err.message);
                                res.status(401).json({token:token,message:'Error Updateing the token'});
                        });
                        console.log('authenticated successfully');
                        res.status(201).json({token:token,message:"Driver authenticated successfully"});
                    }else{
                        console.log('Wrong Password');
                        res.status(409).json({token:"",message:'Wrong Password'});
                    }
                }
            });
        }else{
            console.log('There is no email or phone sent');
            res.status().json({token:"",message:'Internal Server Error'});
        }

    }else{
        res.json({message:'You must Provide type'});
    }
});
module.exports = router;