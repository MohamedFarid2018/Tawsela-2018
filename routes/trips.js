const express = require('express');
const bcrypt = require('bcryptjs');
const Passenger = require('../model/passengers/schema').Passenger;
const Driver = require('../model/drivers/schema').Driver;
const Trip = require('../model/trips/schema').Trip;
const Car = require('../model/drivers/schema').Car;
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
        var token = jwt.verify(req.body.token, 'Garry Kasparov');
    }catch(err){
        console.log('Invalid Token that came from Driver in Trip');
        console.log(err.message);
        return;
    }
    var allTrips=[];
    var date, obj, i,days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
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
        Trip.find({"pId":token.Id},"pslat pslong dlat dlong tId tripCost tripDate").then(function(passengerTrips){
            if(passengerTrips.length === 0){
                res.status(200).json({allTrips: allTrips});

            }else{

            for(i=0;i<passengerTrips.length;i++){
                date = new Date(driverTrips[i].tripDate);
                obj = {"slat":passengerTrips[i].slat,"slong":passengerTrips[i].slong,"dlat":passengerTrips[i].dlat,
                 "dlong":passengerTrips[i].dlong,"tripCost":driverTrips[i].tripCost + "LE","tripId":passengerTrips[i].tId,
                 "tripDay":days[date.getDay()] ,"tripHour":formatAMPM(date),"tripDate":formatDate(date)}

                allTrips.push(obj);
            }
            res.status(201).json({allTrips: allTrips});
        }
        }).catch(function(err){
            console.log(err.message);
        });
    }

    else if(req.body.type == "d"){
        Trip.find({"dId":token.Id},"pslat pslong dlat dlong tId tripCost tripDate").then(function(driverTrips){
            if(driverTrips.length === 0){
                res.status(200).json({allTrips: allTrips});

            }else{

            for(i=0;i<driverTrips.length;i++){
                date = new Date(driverTrips[i].tripDate);
                obj = {"slat":driverTrips[i].slat,"slong":driverTrips[i].slong,"dlat":driverTrips[i].dlat,
                 "dlong":driverTrips[i].dlong,"tripCost":driverTrips[i].tripCost + "LE","tripId":driverTrips[i].tId,
                "tripDay":days[date.getDay()] ,"tripHour":formatAMPM(date),"tripDate":formatDate(date)}

                allTrips.push(obj);
            }
            res.status(201).json({allTrips: allTrips});
        }
        }).catch(function(err){
            console.log(err.message);
        });
    }    
});
module.exports = router;
