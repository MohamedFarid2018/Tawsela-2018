var router = require('express').Router();
var onlineDriver = require('../model/drivers/schema').onlineDriver;
var jwt = require('jsonwebtoken');
//when the driver clicks the goOnline button he will send token and his slan and slat

router.post('/', function(req, res, next){
    var token, onlnDriver;
    if(req.body.token){
        token =  jwt.verify(req.body.token, 'Garry Kasparov');
    }else{
        console.log('The token is not send');
        res.json({message:'token is not send'});
    }
    onlnDriver = new onlineDriver({
        driverId:token.Id,
        passengerId:'',
        slong:req.body.slong,
        slat:req.body.slat,
        status:true,
        dlong:0,
        dlat:0,
        pending:false
    });
    onlnDriver.save().then(function(saved){
        console.log(saved);
        res.status(201).json({message:'User Added to the online Successfully'});
    }).catch(function(err){
        console.log(err.message);
        res.status(401).json({message:'Driver already exist in the online Driver'});
    });

});
module.exports = router;