var router = require('express').Router();
var jwt = require('jsonwebtoken');
const Passenger = require('../model/passengers/schema').Passenger;
const Driver = require('../model/drivers/schema').Driver;

router.get('/', function(req, res){
    res.status(200).json({message:"expecting a post request not get request"});
});
router.post('/',function(req, res){
    console.log(req.body);
    try{
        var token = jwt.verify(req.body.token, 'Garry Kasparov');
        //for further checking the token value if it's expired
        console.log('valid token verification');
       // res.status(200).json({status:'valid'});     
    }catch(err){
        console.log('Invalid Token that came from Passenger in check');
        console.log(err.message);
        res.status(302).json({status:'invalid'});
    }
    if(req.body.type === "p"){
        console.log("Passenger Check");
        Passenger.find({'Id':token.Id},'_id').then(function(passenger){
            if(!passenger.length){
                // res.status(201).json({status:'invalid'});
                // console.log("passenger doesn't exist before");
                console.log(err.message);
            }else{
                console.log("passenger found successfully: " + passenger);
                res.status(201).json({status:'valid'});
            }
        }).catch(function(err){
            res.status(201).json({status:'invalid'});
            console.log("passenger doesn't exist before");
            console.log(err.message);
        });
    }
    else if(req.body.type === "d"){
        console.log("Driver Check");
        Driver.find({'Id':token.Id},'_id').then(function(driver){
            if(!driver.length){
                // res.status(201).json({status:'invalid'});
                // console.log("passenger doesn't exist before");
                console.log(err.message);
            }else{
                console.log("Driver found successfully: " + driver);
                res.status(201).json({status:'valid'});
            }
        }).catch(function(err){
            res.status(201).json({status:'invalid'});
            console.log("Driver doesn't exist before");
            console.log(err.message);
        });
    }
});

module.exports = router;