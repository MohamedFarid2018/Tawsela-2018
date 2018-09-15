const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Passenger = require('../model/passengers/schema').Passenger;
const Driver = require('../model/drivers/schema').Driver;

const bcrypt = require('bcryptjs');

router.get('/', function(req, res, next) {
    res.send("Profile");
});
router.post('/',function(req, res){
    console.log("Request on Profile");
    try{
        var token = jwt.verify(req.body.token, 'Garry Kasparov');
        //for further checking the token value if it's expired
        console.log('valid token verification');   
    }catch(err){
        console.log('Invalid Token that came from Passenger in profile');
        console.log(err.message);
    }
    if(req.body.type === "p"){
        console.log("Passenger want Profile Data");
        Passenger.findOne({'Id':token.Id},'Id rate date fname lname email numOfTrips phone photo',function(err,profile){
            if(err)
            {
                console.log(err.message);
            }else{
                var totalDate = Math.floor((new Date(Date.now()) - profile.date)/(1000*60*60*24*30));
                console.log(totalDate);
                res.status(201).json({"rate":(profile.rate)/(profile.numOfTrips),"months":totalDate,"trips":profile.numOfTrips,"fname":profile.fname,
                                      "lname":profile.lname,"email":profile.email,"phone":profile.phone,"phot":""}); 
                console.log(profile.fname +" "+ profile.lname);
                }
            })
    }
    else if(req.body.type === "d"){
        console.log("Driver want Profile Data");
        Driver.findOne({'Id':token.Id},'Id rate date fname lname email numOfTrips phone photo',function(err,profile){
            if(err)
            {
                console.log(err.message);
            }else{
                var totalDate = Math.floor((new Date(Date.now()) - profile.date)/(1000*60*60*24*30));
                console.log(totalDate);
                res.status(201).json({"rate":(profile.rate)/(profile.numOfTrips),"months":totalDate,"trips":profile.numOfTrips,"fname":profile.fname,
                                      "lname":profile.lname,"email":profile.email,"phone":profile.phone,"phot":""}); 
                console.log(profile.fname +" "+ profile.lname);
                }
            })
    }
});

module.exports=router;