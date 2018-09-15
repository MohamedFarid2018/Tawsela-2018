const express = require('express');
const Passenger = require('../model/passengers/schema').Passenger;
const Driver = require('../model/drivers/schema').Driver;
const Trip = require('../model/trips/schema').Trip;
const Car = require('../model/drivers/schema').Car;
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const path =  require('path').join(__dirname,'../public/html/signup.html');
const router = express.Router();
router.get('/', function(req, res, next) {
    res.sendFile(path, { "Content-Type": "text/html" });
});
router.post('/',function(req, res){
    try{
        var token = jwt.verify(req.body.token, 'Garry Kasparov');
    }catch(err){
        console.log('Invalid Token that came from Driver in Trip');
        console.log(err.message);
        return;
    }
    var date, obj, days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    
    function formatDate(date){
        var day = date.getDay()
        var month = date.getMonth()
        var year = date.getFullYear()
        var strDate = day + '/' + month + '/' + year;
        return strDate;
    }

    if(req.body.type == "p"){ 
    Trip.findOne({"tId":req.body.tId},"pslat pslong dlat dlong tripDate tripCost tripDistance pRate dId").then(
        function(passengerTripData){  
            if(passengerTripData.length === 0){
                console.log('Error there is no trip hasing this id')
                res.status(200).json({message:'invalid trip id'});
            }else{
                Driver.findOne({"Id":passengerTripData.dId},"fname lname photo").then(function(driverData){
                    date =  new Date(passengerTripData.tripDate);

                    obj = {"slat":passengerTripData.slat,"slong":passengerTripData.slong,"dlat":passengerTripData.dlat,
                        "dlong":passengerTripData.dlong,"tripCost":passengerTripData.tripCost.toFixed(2) + "LE",
                        "tripDistance":passengerTripData.tripDistance,"pRate":passengerTripData.pRate,
                        "tripDay":days[date.getDay()] ,"tripHour":formatAMPM(date),"tripDate":formatDate(date),
                        "fname":driverData.fname,"lname":driverData.lname,"photo":"","waited"}
                        
                    res.status(201).json({'tripDetails':obj})
                }).catch(function(err){
                    console.log('Error getting driver data from the database');
                    console.log(err.message);
                });
            }
            }).catch(function(err){
                console.log('Error getting Trip data')
                console.log(err.message);
            });
}else if(req.body.type === "d"){
    Trip.findOne({"tId":req.body.tId},"pslat pslong dlat dlong tripDate tripCost tripDistance dRate pId").then(
        function(driverTripData){  
            if(driverTripData.length === 0){
                console.log('Error there is no trip hasing this id')
                res.status(200).json({message:'invalid trip id'});
            }else{
               Passenger.findOne({"Id":driverTripData.pId},"fname lname photo").then(function(passengerData){
                date =  new Date(driverTripData.tripDate);

                obj = {"slat":driverTripData.slat,"slong":driverTripData.slong,"dlat":driverTripData.dlat,
                    "dlong":driverTripData.dlong,"tripCost":driverTripData.tripCost.toFixed(2) + "LE",
                    "tripDistance":driverTripData.tripDistance,"dRate":driverTripData.dRate,
                    "tripDay":days[date.getDay()] ,"tripHour":formatAMPM(date),"tripDate":formatDate(date),
                    "fname":passengerData.fname,"lname":passengerData.lname,"photo":""}

                res.status(200).json({'tripDetails':obj})
               }).catch(function(err){
                console.log('Error getting driver data from the database');
                console.log(err.message);
               })
            }
            }).catch(function(err){
                console.log('Error getting Trip data')                
                console.log(err.message);
            });
}

});

module.exports = router;