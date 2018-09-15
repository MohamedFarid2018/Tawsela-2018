//var time = Date.now();
//console.log(time);
//
//
// const jwt = require('jsonwebtoken');
// var token = jwt.sign("mohammedsharabash3@gmail.com",'Garry Kasparov');
// console.log(token);
//var token2 = jwt.sign("0126517426",'Garry Kasparov');
//console.log(token2); 

// var Phone = new Buffer("bW9oYW1lZEBnbWFpbC5jb20=", 'base64').toString('ascii');
//console.log(Phone);
// var nodemailer = require("nodemailer");


// var transporter = nodemailer.createTransport({
//     service: "Gmail",
//     secure: false,
//     port: 25,
//     auth: {      
//         user: "twsela2018@gmail.com",
//         pass: "0126517426"
//     },
// });
// var x =((0.066666).toFixed(4));
// console.log(new Buffer("mohammedsharabash3@gmail.com").toString('base64'));
// console.log(new Buffer('123').toString('base64'));


// var x = (Math.random()*1000000).toFixed(6);
// console.log(x);

// var str = "How,we";
// var res = str.split(",");
// console.log(res[0]);



var date = new Date();

console.log(getStringDate(date))




// var mailOptions = {
// from: '"Twsela" <twsela2018@gmail.com>', // sender address
// to: "ebrahim.elmohamed26@gmail.com", // list of receivers
// subject: "Reset Password ", // Subject line
// text: "Nigga Ur Your Code is : " + String(x) + " \nRestore Your Account with now and work Begin Your Trip now"
// }
// transporter.sendMail(mailOptions, function(error, response){
// if(error){
//     console.log("Error Here"); 
//     console.log(error.message);
// }else{
//     console.log("Message sent: " + JSON.stringify(response));
//     console.log("Message sent: " + "\n home");
// }
// });

// const express = require('express');
// const Passenger = require('./model/passengers/schema').Passenger;
// const router = express.Router();

// console.log("welcome");
// Passenger.findOne({'Id':"pp"}).then(function(deleted){
//     console.log("Done Deleting Driver in GoOffline");
// }).catch(function(err){
//     console.log('Error Deleting Driver after pressing GoOffline)');
//     console.log(err.message);
// });
// module.exports = router;

// var s = new Buffer('mohammedsharabash3@gmail.com').toString('base64');
// console.log(s);
// var s = new Buffer('876667').toString('base64');
// console.log(s);
// var Phone = new Buffer("MTIz", 'base64').toString('ascii');
//console.log(Phoe);n

//const bcrypt = require('bcryptjs');
//if(bcrypt.compareSync("123","$2a$10$9cIEIA8oJIvfSAnur7rCCu3BPVF49bQm8wq8EK7oy2nqSLfZ4ENtO")){
//                console.log("True");
//}

// var map = require('google_directions');
// params = {
//     origin: "26.906099,30.8768375",
//     destination: "26.257653,28.009406",
//     key:'AIzaSyAHZZhBGK76v9aRk3bdABGAemWol2jyFuo',
//     mode:'driving',
//     avoid:'ferries',
//     language:'en',
//     units:'metric',
//     region:''
// }
// map.getDistance(params,function(err, data){
//     if(err){
//         console.log(err.message);
//         return 1;
//     }else
//         console.log(data);
// });
// var server = require('http').createServer();
// var app = require('express')();
// var server = require('http').createServer(app);
// var io = require('socket.io')(server);
// var d = io.of('/drivers');
// d.on('connection', function(socket){ 
//     socket.on('goOnline',function(data){
//         console.log("Go Online");
//     });
//     socket.on('online',function(data){
//         console.log(data);
//         d.to(socket.id).emit('waitTrip',{message:"Mohamed Farid:D"});
//     });
//  });
// server.listen(8000,function(){
//     console.log("Listen on port " + 8000);
// });

//  var someDate = new Date() + 0;
//  console.log(someDate);
//  someDate.setDate(someDate.getDate() + 2);
//  someDate.setHours(someDate.getHours() + 2);

// console.log(someDate);
// Date.prototype.addDays = function(days){
//     var date = new Date(this.valueOf());
//     date.setDate(date.getDate() + days);
//     return date;
// }

// console.log(date.addDays(2));
// console.log(new Buffer("shika@gmail.com").toString('base64'));
// console.log(new Buffer('123').toString('base64'));

/*
{
	"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiU2hhcmFiYWVyZUBnbWFpbC5jb20iLCJpYXQiOjE1MTg0MDY4Mzd9.ztxURrlwAb75l-qBO9aa_CrMOOdIV7dYYoFWN5aiAh8",
	"slat":"28.09495",
	"slong":"32.008429",
	"dlat":"28.09495",
	"dlong":"28.09495"
}




//*/
// var nodemailer = require("nodemailer");


// // create reusable transport method (opens pool of SMTP connections)
// var transporter = nodemailer.createTransport({
//     service: "Gmail",
//     secure: false,
//     port: 25,
//     auth: {      
//         user: "sa234523452345@gmail.com",
//         pass: "0126517426"
//     },
// //    tls{
// //        rejectUnauthorized: false;
// //        }
// });
// var mailOptions = {
//     from: '"Twsela" <sa234523452345@gmail.com>', // sender address
//     to: "mohamedamal780@yahoo.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world ✔", // plaintext body
// }


// transporter.sendMail(mailOptions, function(error, response){
//     if(error){
//         console.log(error);
//     }else{
//         console.log("Message sent: " + JSON.stringify(response));
//     }

//     // if you don't want to use this transport object anymore, uncomment following line
//     //smtpTransport.close(); // shut down the connection pool, no more messages
// }); 

// console.log(Math.random()); 


//        from: '"Fred Foo 👻" <mohamedamal680@gmail.com>', // sender address
//        to: 'mohammedsharabash3@gmail.com', // list of receivers


//const jwt = require('jsonwebtoken');
//// var temp = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6ImRJZC0xNTE4NDA0MDUwMDUwNDk5NDI2NzczOGY0ZDY3NTIiLCJpYXQiOjE1MTg0MDQwNTB9.CzwYKBcGVRztNWLEz5YgMBHv-WN2E5hy1JMQI6um3GU';
//var token = jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6InBJZC0xNTE5NzU0MTUxNDE1MjQ4MzQzNjkzNjIwZWFkZTgiLCJpYXQiOjE1MTk3NTQxODd9._rGUxnceC09qXazKUzA8QaiTDD49vBG0KiTdvT3KGzM","Garry Kasparov");
//console.log(token);
//// console.log('break');


/*
var drivers = [{slat:29.5419986,slang:28.0270864,dist:0},{slat:26.7001748,slang:31.5497501,dist:0},
    {slat:26.9060999,slang:30.8768375,dist:0},{slat:24.590785,slang:37.259894,dist:0},
    {slat:28.09495,slang:32.008429,dist:0}];
var userLoc = {slat:25.546107,slang:31.437140};
var compare = function(val1, val2) {
    if (val1.dist < val2.dist)
        return -1;
    else if (val1.dist > val2.dist)
        return 1;
    else
        return 0;
};
var rad = function(degree) {
    return degree * Math.PI / 180;
};
var getDistance = function(p1, p2) {
    var R = 6378137;
    var dLat = rad(p2.slat - p1.slat);
    var dLong = rad(p2.slang - p1.slang);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(p1.slat)) *
        Math.cos(rad(p2.slat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    var distance = R * c;
    return distance;
};
for(var i = 0; i < drivers.length;i++){
    drivers[i].dist = getDistance(userLoc, drivers[i]);
}
// drivers.map(function(driver){
//     driver.dist = getDistance(userLoc,driver);
// });
drivers.sort(compare);
console.log(drivers);
console.log('selected');
console.log(drivers[0]);
*/
/*
{
    "_id" : ObjectId("5a80ff58eda15a2708479786"),
    "Id" : "dId-1518403416841290905503d51d0e49",
    "email" : "Sharabash@gmail.com",
    "phone" : "01132334556",
    "password" : "$2a$10$0WwGuWz7tnTrMZF9zG.1WusecqmM/gidQDGSb2MZWsBZS2OHS1M.G",
    "token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6ImRJZC0xNTE4NDAzNDE2ODQxMjkwOTA1NTAzZDUxZDBlNDkiLCJpYXQiOjE1MTg0MDM0MTZ9.pCsRpTE0WS0a666a8e6xh9J-PDav8ZBQRo8ZAKczOrQ",
    "city" : "Fayoum",
    "date" : ISODate("2018-02-12T02:43:36.844Z"),
    "color" : "Black",
    "model" : "Camry",
    "type" : "Toyota",
    "platenumber" : "687634297362",
    "rate" : 0,
    "lname" : "Sharabash",
    "fname" : "Mohamed",
    "__v" : 0
}

{
    "_id" : ObjectId("5a810029eda15a2708479787"),
    "Id" : "dId-1518403625829278053142edafd834",
    "email" : "hamada@gmail.com",
    "phone" : "010068",
    "password" : "$2a$10$IxAzkJqXANaUm6ivnXoKVeLsxRU5.PyKsFNRkc2.NbUIOQ9DGosGu",
    "token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6ImRJZC0xNTE4NDAzNjI1ODI5Mjc4MDUzMTQyZWRhZmQ4MzQiLCJpYXQiOjE1MTg0MDM2MjV9.MK5uarjICmgc95_tM_LBSWIovKPvYVkUGlg02hPjDVg",
    "city" : "Fayoum",
    "date" : ISODate("2018-02-12T02:47:05.829Z"),
    "color" : "red",
    "model" : "TeslaX",
    "type" : "Tesla",
    "platenumber" : "998877",
    "rate" : 0,
    "lname" : "Abdrabou",
    "fname" : "Hamada",
    "__v" : 0
}

{
    "_id" : ObjectId("5a8101d2eda15a2708479788"),
    "Id" : "dId-15184040500504994267738f4d6752",
    "email" : "mohamed@gmail.com",
    "phone" : "0100345656",
    "password" : "$2a$10$FPPKp/nc07c.9Qcf1eEWuOj5DCWupjKQ47pIGzNZ30pKL2LWXGmxO",
    "token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6ImRJZC0xNTE4NDA0MDUwMDUwNDk5NDI2NzczOGY0ZDY3NTIiLCJpYXQiOjE1MTg0MDQwNTB9.CzwYKBcGVRztNWLEz5YgMBHv-WN2E5hy1JMQI6um3GU",
    "city" : "Cairo",
    "date" : ISODate("2018-02-12T02:54:10.050Z"),
    "color" : "Black",
    "model" : "TX",
    "type" : "Jeep",
    "platenumber" : "7664838972",
    "rate" : 0,
    "lname" : "Aml",
    "fname" : "Mohamed",
    "__v" : 0
}

{
    "_id" : ObjectId("5a81070cc92aec291d37c712"),
    "Id" : "dId-15184053883377866204145b853b07",
    "email" : "Ebrahim1@gmail.com",
    "phone" : "0100203606",
    "password" : "$2a$10$1NRuRFCRG.U/bQtFbwcbjebGVUEpicSA8DD8bcEAKUi0RBY8/mYIW",
    "token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTg0MTAxMTB9.lN43bn6Yc-Kmtp4rXzeBMCmSnJHbysIBJfpg3r1CHzo",
    "city" : "Fayoum",
    "date" : ISODate("2018-02-12T03:16:28.338Z"),
    "color" : "white",
    "model" : "BMWX",
    "type" : "BMW",
    "platenumber" : "9984277",
    "rate" : 0,
    "lname" : "Mohamed",
    "fname" : "Ibrahim",
    "__v" : 0
}
*/ 
