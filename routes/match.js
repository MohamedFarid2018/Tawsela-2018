const app = require('express')();
const http = require('http').Server(app);
const jwt = require('jsonwebtoken');
http.listen(5000);
const io = require('socket.io')(http);
const passenger = require('../model/passengers/schema').Passenger;
const driver = require('../model/drivers/schema').Driver;
const online = require('../model/drivers/schema').onlineDriver;
app.get('/',function(req, res){
    res.sendFile(__dirname + '/test.html');
});
io.on('connection',function(socket){
    //passenger
    socket.on('event',function(data){
        console.log(data);
        io.to(socket.id).emit("hi",{message:"Fuckin Shit Nigga"});
    });
    socket.on('requestTrip',function(passengerData){
        console.log('event requestTrip');
        if(typeof passengerData === 'string')
            passengerData = JSON.parse(passengerData);
        try{
            var token = jwt.verify(passengerData.token, 'Garry Kasparov');
        }catch(err){
            console.log('Error4');
            console.log(err.message);
            return;
        }
        var check = false
       var checkDriver = function(check){
           while(check === false){
       online.find({'status':'true','pending':'false'},'dsocketId driverId slong slat')
        .then(function(drivers){
            if(!drivers.length){
                check = false;
                setTimeout(()=>{checkDriver(check)}, 6000);
            }else{
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
                    var dLong = rad(p2.slong - p1.slong);
                    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(p1.slat)) *
                        Math.cos(rad(p2.slat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
                    var distance = R * c;
                    return distance;
                };
                drivers.map(function(driver){
                    driver.dist = getDistance({ slat:passengerData.slat, slong: passengerData.slong},
                        { slat:driver.slat, slong: driver.slong} );
                });
                drivers.sort(compare);
                // for(var i = 0; i < drivers.length; i++){
                    passenger.find({'Id':token.Id},'fname lname phone Id').then(function(passen){
                        if(passen.length === 0){//undefined doesn't exist
                            console.log('Error fetching passenger data to send it to Driver in Request Trip');
                            console.log(err.message);
                            return;
                        }else{

                            var obj = {
                                "fname":passen[0].fname, "lname":passen[0].lname, "phone": passen[0].phone,"rate":"0",
                                "slong":passengerData.slong, "slat":passengerData.slat,
                                "edistance":passengerData.edistance, "etime":passengerData.etime
                            };
                            online.findByIdAndUpdate({'_id':drivers[0]._id},
                                {
                                    passengerId:passen[0].Id, psocketId:socket.id, pslat:passengerData.slat,
                                    pslong:passengerData.slong,  dlat:passengerData.dlat, dlong:passengerData.dlong,
                                    dist: drivers[0].dist,pending:true
                                }
                                ,{new:true}).then(function(updated){
                                    console.log('The driver and passenger combined temporarily until Passenger Response');
                                    console.log(JSON.stringify(obj));
                                    driverNsp.to(drivers[0].dsocketId).emit('waitTrip',obj);
                                }).catch(function(err){
                                    console.log('Error Updating the driver while combining with Passenger');
                                    console.log(err.message);
                                });
                            //if he accept or reject
                        }
                    }).catch(function(err){
                        console.log('Invalid Passenger Data in Request Trip');
                        console.log(err.message);
                        return;
                    });
                // }


            }
        }).catch(function(err){
            console.log('Error getting online drivers');
            console.log(err.message);
            return;
        });
        check=true;
    }
}
checkDriver(check);
    });

    socket.on('passengerConfirmTrip',function(data){
        console.log('event passengerConfirmTrip');
        if( typeof data === 'string')
            data = JSON.parse(data);
        try{
            var token = jwt.verify(data.token, 'Garry Kasparov');
        }catch(err){
            console.log('Error in token');
            console.log(err.message);
            return;
        }
        if(data.status === 'accept'){
            console.log('Passenger Press Accepted');
        online.findOne({'passengerId':token.Id},'dsocketId psocketId pslat pslong').then(function(driverData){

            online.findByIdAndUpdate({'_id':driverData._id},{'status':'false','pending':'false'},{new:true})
            .then(function(updatedDriver){
                console.log('Passenger Accept and Driver status updated successfully and trip began');
                var Json = {'slat':driverData.pslat,'slong':driverData.pslong};
                console.log(typeof Json);
                driverNsp.to(driverData.dsocketId).emit('tripStart',Json);
            }).catch(function(err){
                console.log('Error updating driver Status when passenger accept');
                console.log(err.message);
            });

        }).catch(function(err){
            console.log('Error Getting Driver when Passenger Accept');
            console.log(err.message);
        });

        }else if(data.status === 'reject'){
           console.log('Passenger Press Rejected');

        online.findOne({'passengerId':token.Id},'_id').then(function(passenger){
            online.findByIdAndUpdate({'_id':passenger._id},{passengerId:'',psocketId:'',dist:'0'
            ,dlat:'0',dlong:'0',pending:false},{new: true})
             .then(function(updatedPassenger){
                    console.log("Passenger Refused the Driver");

                }).catch(function(err){
                    console.log('Error Updating the Online list when passenger reject');
                    console.log(err.message);
                });
        }).catch(function(err){
            console.log('Error Getting the Driver when passenger reject');
            console.log(err.message);
        });
        }
    });

    socket.on('goOnline',function(data){
        console.log('event goOnline');
        if( typeof data === 'string')
            data = JSON.parse(data);
        try{
            var token = jwt.verify(data.token, 'Garry Kasparov');
        }catch(err){
            console.log('Invalid Token in GoOnline');
            console.log(err.message);
            return;
        }
        var onlnDriver = new online({
            dsocketId:socket.id,
            driverId:token.Id,
            slong:data.slong,
            slat:data.slat,
            pending:false,
            status:true,
            dlong:0,
            dlat:0,
            passengerId:'',
            psocketId:'',
            pslat:0,
            pslong:0
        });
        online.find({'driverId':token.Id},'_id',function(err, existed){
            if(err){
                console.log('Error Getting the Driver in GoOnline');
                console.log(err.message);
                return;
            }else if(!existed.length){
                onlnDriver.save().then(function(saved){
                    console.log('Driver saved in the online DB in GoOnline');
                }).catch(function(err){
                    console.log('Error');
                    console.log(err.message);
                });
            }else if(existed){
                online.findByIdAndUpdate({'_id':existed[0]._id},
                {dsocketId:socket.id,slat:data.slat,slong:data.slong},{new:true},function(err, updated){
                    if(err){
                        console.log('Error updating the driver');
                        console.log(err.message);
                        return;
                    }else{
                    console.log('Driver socket Updated successfully after Reconnecting');
                    }
                });
            }
        });
    });

    socket.on('online',function(data){
        console.log('event online');
        if( typeof data === 'string')
            data = JSON.parse(data);
        try{
            var token = jwt.verify(data.token, 'Garry Kasparov');
        }catch(err){
            console.log('Invalid Token in Online');
            console.log(err.message);
            return;
        }
        online.findOne({'driverId':token.Id},'_id').then(function(onlineDriver){
                online.findByIdAndUpdate({'_id':onlineDriver._id},{slat:data.slat,slong:data.slong},{new: true})
                .then(function(updatedDriver){

                    if(updatedDriver.status){
                        if(updatedDriver.pending)
                        {
                            console.log("online and waiting for passenger response");
                        }else{
                            console.log("online and empty driver");
                            console.log({'slat':updatedDriver.slat,'slong':updatedDriver.slong});
                            driverNsp.to(updatedDriver.dsocketId).emit('live',{'slat':updatedDriver.slat,'slong':updatedDriver.slong});
                        }
                    }else{
                        console.log("online and  combined(Driver is online and in Trip)");
                        passengerNsp.to(updatedDriver.psocketId).emit('live',{'slat':updatedDriver.slat,'slong':updatedDriver.slong});
                    }

                }).catch(function(err){
                    console.log('Error Updating the driver slat slong in Online');
                    console.log(err.message);
                });

        }).catch(function(err){
            console.log('Error Getting the driver from the online database(Invalid Driver)');
            console.log(err.message);
        });

    });

    socket.on('driverConfirmTrip',function(data){
        console.log('event driverConfirmTrip');
        if( typeof data === 'string')
            data = JSON.parse(data);
        try{
            var token = jwt.verify(data.token, 'Garry Kasparov');
        }catch(err){
            console.log('Invalid Token in DriverConfirmTrip');
            console.log(err.message);
            return;
        }
        console.log(data.status);
        if(data.status === 'accept'){
            console.log('Driver Press Accepted');
        online.findOne({'driverId':token.Id},'_id driverId psocketId slat slong dist').then(function(driver1){

            driver.findOne({'Id':driver1.driverId},'_id fname lname phone rate model type platenumber color').then(function(driverData){
                //this is the driver object return to the user different from database driver
                var driver = {
                    "fname":driverData.fname,"lname":driverData.lname,"phone":driverData.phone,
                    "rate":driverData.rate,"slat":driver1.slat,"slong":driver1.slong,
                    "edistance":driver1.dist,"etime":"10","photo":""
                };
                var car = {
                    "model":driverData.model,"type":driverData.type,"platenumber":driverData.platenumber,
                    "color":driverData.color,"photo":""
                };
                console.log('Driver Data sent to Passenger');
                passengerNsp.to(driver1.psocketId).emit('responseTrip',{car,driver});
            }).catch(function(err){
                console.log('Error Getting driverData');
                console.log(err.message);
            });
        }).catch(function(err){
            console.log('Error Getting driver1');
            console.log(err.message);
        });

        }else if(data.status === 'reject'){
            console.log('Driver Press Rejected');
        online.findOne({'driverId':token.Id},'_id').then(function(driver){
                online.findByIdAndUpdate({'_id':driver._id},{passengerId:'',psocketId:'',dist:0
                ,dlat:0,dlong:0,pending:false},{new: true})
                .then(function(updatedDriver){
                        console.log("Driver Refused Passenger and he is Free");

                    }).catch(function(err){
                        console.log('Error Updating the driver slat slong after Refusing Passenger');
                        console.log(err.message);
                    });
            }).catch(function(err){
                console.log('Error Getting the Driver');
                console.log(err.message);
            });
        }
    });

    socket.on('goOffline',function(data){
        console.log('event goOffline');
        if( typeof data === 'string')
            data = JSON.parse(data);
        try{
            var token = jwt.verify(data.token, 'Garry Kasparov');
        }catch(err){
            console.log('Invalid Token in GoOffline');
            console.log(err.message);
            return;
        }
        online.findOne({'driverId':token.Id},'_id').then(function(driver){
            online.findByIdAndRemove({'_id':driver._id}).then(function(deleted){
                    console.log("Done Deleting");
                }).catch(function(err){
                    console.log('Error Deleting the Diver in GoOffline');
                    console.log(err.message);
                });
        }).catch(function(err){
            console.log('Error Getting the Driver in GoOffline');
            console.log(err.message);
        });

    });

    socket.on("position",function(data){
        console.log("event position");
        if( typeof data === 'string')
            data = JSON.parse(data);
        try{
            var token = jwt.verify(data.token, 'Garry Kasparov');
        }catch(err){
            console.log('Error in token');
            console.log(err.message);
            return;
        }
        online.findOne({"driverId":token.Id},'psocketId').then(function(passengerSocket){
            console.log("Confirm Position sent Successfully to Passenger");
            passengerNsp.to(passengerSocket.psocketId).emit("inPosition",{message:"Driver is in Position"})
        }).catch(function(err){
            console.log("Error Getting the Driver in i'm in position");
            console.log(err.message);
        })
    });

    socket.on('disconnect',function(){

        console.log('Driver DisConnected');
    });

});




////////////////////////////////////////////////////
// E4t8lt ya3m hamada el7mdullah :"D

// const app = require('express')();
// const http = require('http').Server(app);
// const jwt = require('jsonwebtoken');
// http.listen(4000);
// const io = require('socket.io')(http);
// const passenger = require('../model/passengers/schema').Passenger;
// const driver = require('../model/drivers/schema').Driver;
// const online = require('../model/drivers/schema').onlineDriver;
// var passengerNsp = io.of('/passengers');
// var driverNsp = io.of('/drivers');
// var  map = require('google_directions');
// app.get('/',function(req, res){
//     res.sendFile(__dirname + '/test.html');
// });
// passengerNsp.on('connection',function(socket){
//     //passenger
//     console.log('Passenger connected');
//     socket.on('goOnline',function(data){
//         console.log('event passenger goOnline');
//         if( typeof data === 'string')
//             data = JSON.parse(data);
//         try{
//             var token = jwt.verify(data.token, 'Garry Kasparov');
//         }catch(err){
//             console.log('Error in token');
//             console.log(err.message);
//             return;
//         }
//         online.find({'passengerId':token.Id},'_id')
//         .then(function(passen){
//             if(!passen.length){
//                 console.log('The driver was not connected before');
//                 socket.emit('online',{'status':false});
//             }else{
//                 online.findByIdAndUpdate({'_id':passen[0]._id},{psocketId:socket.id},{new:true})
//                 .then(function(updatedPassenger){
//                     console.log('sucess updating passenger socket after disconnecting ');
//                    socket.emit('online',{'status':true});
//                 })
//                 .catch(function(err){
//                     console.log('Error Updating Passenger');
//                     console.log(err.message);
//                     socket.emit('online',{'status':false});
//                 });
//                 socket.emit('online',{'status':true});
//             }
//         })
//         .catch(function(err){
//             console.log('Error Getting Combined Passenger');
//             console.log(err.message);
//             socket.emit('online',{'status':false});
//         });
//     });
//     socket.on('requestTrip',function(passengerData){
//         console.log('event requestTrip');
//         if(typeof passengerData === 'string')
//             passengerData = JSON.parse(passengerData);
//         try{
//             var token = jwt.verify(passengerData.token, 'Garry Kasparov');
//         }catch(err){
//             console.log('Error4');
//             console.log(err.message);
//             return;
//         }
//         var check = false
//        var checkDriver = function(check){
//            while(check === false){
//        online.find({'status':'true','pending':'false'},'dsocketId driverId slong slat')
//         .then(function(drivers){
//             if(!drivers.length){
//                 check = false;
//                 setTimeout(()=>{checkDriver(check)}, 6000);
//             }else{
//                 var compare = function(val1, val2) {
//                     if (val1.dist < val2.dist)
//                         return -1;
//                     else if (val1.dist > val2.dist)
//                         return 1;
//                     else
//                         return 0;
//                 };
//                 var rad = function(degree) {
//                     return degree * Math.PI / 180;
//                 };
//                 var getDistance = function(p1, p2) {
//                     var R = 6378137;
//                     var dLat = rad(p2.slat - p1.slat);
//                     var dLong = rad(p2.slong - p1.slong);
//                     var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(p1.slat)) *
//                         Math.cos(rad(p2.slat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
//                     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
//                     var distance = R * c;
//                     return distance;
//                 };
//                 drivers.map(function(driver){
//                     driver.dist = getDistance({ slat:passengerData.slat, slong: passengerData.slong},
//                         { slat:driver.slat, slong: driver.slong} );
//                 });
//                 drivers.sort(compare);
//                 // for(var i = 0; i < drivers.length; i++){
//                     passenger.find({'Id':token.Id},'fname lname phone Id').then(function(passen){
//                         if(passen.length === 0){//undefined doesn't exist
//                             console.log('Error fetching passenger data to send it to Driver in Request Trip');
//                             console.log(err.message);
//                             return;
//                         }else{

//                             var obj = {
//                                 "fname":passen[0].fname, "lname":passen[0].lname, "phone": passen[0].phone,"rate":"0",
//                                 "slong":passengerData.slong, "slat":passengerData.slat,
//                                 "edistance":passengerData.edistance, "etime":passengerData.etime
//                             };
//                             online.findByIdAndUpdate({'_id':drivers[0]._id},
//                                 {
//                                     passengerId:passen[0].Id, psocketId:socket.id, pslat:passengerData.slat,
//                                     pslong:passengerData.slong,  dlat:passengerData.dlat, dlong:passengerData.dlong,
//                                     dist: drivers[0].dist,pending:true
//                                 }
//                                 ,{new:true}).then(function(updated){
//                                     console.log('The driver and passenger combined temporarily until Passenger Response');
//                                     console.log(JSON.stringify(obj));
//                                     driverNsp.to(drivers[0].dsocketId).emit('waitTrip',obj);
//                                 }).catch(function(err){
//                                     console.log('Error Updating the driver while combining with Passenger');
//                                     console.log(err.message);
//                                 });
//                             //if he accept or reject
//                         }
//                     }).catch(function(err){
//                         console.log('Invalid Passenger Data in Request Trip');
//                         console.log(err.message);
//                         return;
//                     });
//                 // }


//             }
//         }).catch(function(err){
//             console.log('Error getting online drivers');
//             console.log(err.message);
//             return;
//         });
//         check=true;
//     }
// }
//     checkDriver(check);
//     });
//     socket.on('passengerConfirmTrip',function(data){
//         console.log('event passengerConfirmTrip');
//         if( typeof data === 'string')
//             data = JSON.parse(data);
//         try{
//             var token = jwt.verify(data.token, 'Garry Kasparov');
//         }catch(err){
//             console.log('Error in token');
//             console.log(err.message);
//             return;
//         }
//         if(data.status === 'accept'){
//             console.log('Passenger Press Accepted');
//         online.findOne({'passengerId':token.Id},'dsocketId psocketId pslat pslong').then(function(driverData){

//             online.findByIdAndUpdate({'_id':driverData._id},{'status':'false','pending':'true'},{new:true})
//             .then(function(updatedDriver){
//                 console.log('Passenger Accept and Driver status updated successfully');
//                 driverNsp.to(driverData.dsocketId).emit('tripStart',{'slat':driverData.pslat,'slong':driverData.pslong});
//             }).catch(function(err){
//                 console.log('Error updating driver Status when passenger accept');
//                 console.log(err.message);
//             });

//         }).catch(function(err){
//             console.log('Error Getting Driver when Passenger Accept');
//             console.log(err.message);
//         });

//         }else if(data.status === 'reject'){
//            console.log('Passenger Press Rejected');

//         online.findOne({'passengerId':token.Id},'_id').then(function(passenger){
//             online.findByIdAndUpdate({'_id':passenger._id},{passengerId:'',psocketId:'',dist:'0'
//             ,dlat:'0',dlong:'0',pending:false},{new: true})
//              .then(function(updatedPassenger){
//                     console.log("Passenger Refused the Driver");

//                 }).catch(function(err){
//                     console.log('Error Updating the Online list when passenger reject');
//                     console.log(err.message);
//                 });
//         }).catch(function(err){
//             console.log('Error Getting the Driver when passenger reject');
//             console.log(err.message);
//         });
//         }
//     });

//     socket.on('disconnect',function(){
//         console.log('Passenger Disconnected')
//     });
// });


// driverNsp.on('connection',function(socket){
//     console.log('Driver connected');

//     socket.on('goOnline',function(data){
//         console.log('event goOnline');
//         if( typeof data === 'string')
//             data = JSON.parse(data);
//         try{
//             var token = jwt.verify(data.token, 'Garry Kasparov');
//         }catch(err){
//             console.log('Invalid Token in GoOnline');
//             console.log(err.message);
//             return;
//         }
//         var onlnDriver = new online({
//             dsocketId:socket.id,
//             driverId:token.Id,
//             slong:data.slong,
//             slat:data.slat,
//             pending:false,
//             status:true,
//             dlong:0,
//             dlat:0,
//             passengerId:'',
//             psocketId:'',
//             pslat:0,
//             pslong:0
//         });
//         online.find({'driverId':token.Id},'_id',function(err, existed){
//             if(err){
//                 console.log('Error checking Driver existance in GoOnline');
//                 console.log(err.message);
//                 socket.emit('check',{'status':false});

//             }else if(!existed.length){
//                 onlnDriver.save().then(function(saved){
//                     console.log('Driver saved in the online DB in GoOnline');
//                     socket.emit('check',{'status':false});
//                 }).catch(function(err){
//                     console.log('Error');
//                     console.log(err.message);
//                     socket.emit('check',{'status':false});
//                 });
//             }else if(existed){
//                 online.findByIdAndUpdate({'_id':existed[0]._id},
//                 {dsocketId:socket.id,slat:data.slat,slong:data.slong},{new:true},function(err, updated){
//                     if(err){
//                         console.log('Error updating the driver');
//                         console.log(err.message);
//                         socket.emit('check',{'status':false});
//                     }else{
//                         console.log('Driver socket Updated successfully after Reconnecting');
//                         if(updated.status === true && updated.pending === false){
//                             console.log('is not combined');
//                             socket.emit('check',{'status':false});
//                         }else if (updated.status === false && updated.pending === false){
//                             console.log('is combined');
//                             console.log(updated.pslat);
//                             console.log(updated.pslong);
//                             socket.emit('check',{'status':true,'slat':updated.pslat,'slong':updated.pslong});
//                         }
//                     }
//                 });
//             }
//         });
//     });

//     socket.on('online',function(data){
//         console.log('event online');
//         if( typeof data === 'string')
//             data = JSON.parse(data);
//         try{
//             var token = jwt.verify(data.token, 'Garry Kasparov');
//         }catch(err){
//             console.log('Invalid Token in Online');
//             console.log(err.message);
//             return;
//         }
//         online.findOne({'driverId':token.Id},'_id slat slong').then(function(onlineDriver){
//                 online.findByIdAndUpdate({'_id':onlineDriver._id},{slat:data.slat,slong:data.slong},{new: true})
//                 .then(function(updatedDriver){
//                     if(updatedDriver.status){
//                         if(updatedDriver.pending)
//                         {
//                             //requested driver waiting for the passenger confirmation
//                             console.log("online and waiting for passenger response");
//                         }else{
//                             //fresh driver just went online
//                             console.log("online and empty driver");
//                             // driverNsp.to(updatedDriver.dsocketId).emit('live',{'slat':updatedDriver.slat,'slong':updatedDriver.slong});
//                         }
//                     }else{
//                         if(updatedDriver.pending)
//                         {
//                             //in the route to the waiting passenger
//                             console.log("online Driver is on his way to the passenger");
//                             passengerNsp.to(updatedDriver.psocketId).emit('live',{'slat':updatedDriver.slat,'slong':updatedDriver.slong});
//                         }else{
//                             //the driver is already on a trip
//                             console.log("online and busy driver");
//                             var or =onlineDriver.slat + ',' + onlineDriver.slong;
//                             var dest = updatedDriver.slat + ',' + updatedDriver.slong
//                             params = {
//                                 origin: or,
//                                 destination: dest,
//                                 key:'AIzaSyCy8mxfOmJn18yCsHZ-58JPnXelQ95N2aQ',
//                                 mode:'driving',
//                                 avoid:'ferries',
//                                 language:'en',
//                                 units:'metric',
//                                 region:''
//                             }
//                             map.getDistance(params,function(err, dist){
//                                 if(err){
//                                     console.log('Error while getting distance data from google api');
//                                     console.log(err.message);
//                                     if(dist.includes("km"))
//                                         dist = parseFloat(dist) * 1000;
//                                     else if(dist.includes("m"))
//                                         dist = parseFloat(dist)
//                                 }
//                                 var newDist = updatedDriver.edistance + parseFloat(dist);
//                                 online.findByIdAndUpdate({'_id':updatedDriver._id},{edistance:newDist},{new:true})
//                                 .then(function(drvr){
//                                     console.log("distance:" + drvr.edistance);
//                                 })
//                                 .catch(function(err){
//                                     console.log('Error updating the distance and time');
//                                     console.log(err.message);
//                                 });
//                             });
//                         }
//                     }

//                 }).catch(function(err){
//                     console.log('Error Updating the driver slat slong in Online');
//                     console.log(err.message);
//                 });

//         }).catch(function(err){
//             console.log('Error Getting the driver from the online database(Invalid Driver)');
//             console.log(err.message);
//         });

//     });
//     //when the driver gets to the passenger pickup location
//     socket.on('trip',function(data){
//         console.log('event starting the trip');
//         if( typeof data === 'string')
//             data = JSON.parse(data);
//         try{
//             var token = jwt.verify(data.token, 'Garry Kasparov');
//         }catch(err){
//             console.log('Invalid Token in Online');
//             console.log(err.message);
//             return;
//         }
//         online.find({'driverId':token.Id}, '_id')
//         .then(function(drvr){
//             //updating the passenger location and using it as the pickup location reference for that trip
//             online.findByIdAndUpdate({'_id':drvr._id},{pslat:data.slat, pslong: data.pslong, pending:false},{new:true})//{edistance:0,etime:0}
//             .then(function(updatedDriver){

//             });
//         }).catch(function(err){
//             console.log('fatal error getting driver from online DB');
//             console.log(err.message);
//         });
//     });
//     socket.on('driverConfirmTrip',function(data){
//         console.log('event driverConfirmTrip');
//         if( typeof data === 'string')
//             data = JSON.parse(data);
//         try{
//             var token = jwt.verify(data.token, 'Garry Kasparov');
//         }catch(err){
//             console.log('Invalid Token in DriverConfirmTrip');
//             console.log(err.message);
//             return;
//         }
//         console.log(data.status);
//         if(data.status === 'accept'){
//             console.log('Driver Press Accepted');
//         online.findOne({'driverId':token.Id},'_id driverId psocketId slat slong dist').then(function(driver1){

//             driver.findOne({'Id':driver1.driverId},'_id fname lname phone rate model type platenumber color').then(function(driverData){
//                 //this is the driver object return to the user different from database driver
//                 var driver = {
//                     "fname":driverData.fname,"lname":driverData.lname,"phone":driverData.phone,
//                     "rate":driverData.rate,"slat":driver1.slat,"slong":driver1.slong,
//                     "edistance":driver1.dist,"etime":"10","photo":""
//                 };
//                 var car = {
//                     "model":driverData.model,"type":driverData.type,"platenumber":driverData.platenumber,
//                     "color":driverData.color,"photo":""
//                 };
//                 console.log('Driver Data sent to Passenger');
//                 passengerNsp.to(driver1.psocketId).emit('responseTrip',{car,driver});
//             }).catch(function(err){
//                 console.log('Error Getting driverData');
//                 console.log(err.message);
//             });
//         }).catch(function(err){
//             console.log('Error Getting driver1');
//             console.log(err.message);
//         });

//         }else if(data.status === 'reject'){
//             console.log('Driver Press Rejected');
//         online.findOne({'driverId':token.Id},'_id').then(function(driver){
//                 online.findByIdAndUpdate({'_id':driver._id},{passengerId:'',psocketId:'',dist:0
//                 ,dlat:0,dlong:0,pending:false},{new: true})
//                 .then(function(updatedDriver){
//                         console.log("Driver Refused Passenger and he is Free");

//                     }).catch(function(err){
//                         console.log('Error Updating the driver slat slong after Refusing Passenger');
//                         console.log(err.message);
//                     });
//             }).catch(function(err){
//                 console.log('Error Getting the Driver');
//                 console.log(err.message);
//             });
//         }
//     });

//     socket.on('goOffline',function(data){
//         console.log('event goOffline');
//         if( typeof data === 'string')
//             data = JSON.parse(data);
//         try{
//             var token = jwt.verify(data.token, 'Garry Kasparov');
//         }catch(err){
//             console.log('Invalid Token in GoOffline');
//             console.log(err.message);
//             return;
//         }
//         online.findOne({'driverId':token.Id},'_id').then(function(driver){
//             online.findByIdAndRemove({'_id':driver._id}).then(function(deleted){
//                     console.log("Done Deleting");
//                 }).catch(function(err){
//                     console.log('Error Deleting the Diver in GoOffline');
//                     console.log(err.message);
//                 });
//         }).catch(function(err){
//             console.log('Error Getting the Driver in GoOffline');
//             console.log(err.message);
//         });

//     });

//     socket.on("position",function(data){
//         console.log("event position");
//         if( typeof data === 'string')
//             data = JSON.parse(data);
//         try{
//             var token = jwt.verify(data.token, 'Garry Kasparov');
//         }catch(err){
//             console.log('Error in token');
//             console.log(err.message);
//             return;
//         }
//         online.findOne({"driverId":token.Id},'psocketId').then(function(passengerSocket){
//             console.log("Confirm Position sent Successfully to Passenger");
//             passengerNsp.to(passengerSocket.psocketId).emit("inPosition",{message:"Driver is in Position"})
//         }).catch(function(err){
//             console.log("Error Getting the Driver in i'm in position");
//             console.log(err.message);
//         })
//     });

//     socket.on('disconnect',function(){

//         console.log('Driver DisConnected');
//     });

// });





















//add two rooms one for the empty drivers and the other for the busy drivers (busy - empty)

/*
const router = require('express').Router();
const online = require('../model/drivers/schema').onlineDriver;
const Driver = require('../model/drivers/schema').Driver;
const Passenger = require('../model/passengers/schema').Passenger;
const Car = require('../model/drivers/schema').Car;
const map = require('google_directions');
const jwt = require('jsonwebtoken');

router.post('/',function(req, res){
    if(req.body.slong && req.body.slat){
    var userLoc = {slat:req.body.slat, slong:req.body.slong};
    var params = {
        origin:'',
        destination:userLoc,
        key:'AIzaSyCy8mxfOmJn18yCsHZ-58JPnXelQ95N2aQ',
        mode:'driving',
        avoid:'ferries',
        language:'en',
        units:'metric',
        region:''
    },arr = new Array()
    ,token = jwt.verify(req.body.token,'Garry Kasparov');
        console.log(token);
        online.find({'status':'true','pending':'false'},'driverId slong slat dist').then(function(drivers){
            if(!drivers.length){
                console.log(err.message);
                console.log('There is no Online Drivers now');
                res.status(200).json({status:'Not Valid',message:'There is NO Online drivers now!!'});
            }else{
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
                var dLong = rad(p2.slong - p1.slong);
                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(p1.slat)) *
                    Math.cos(rad(p2.slat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
                var distance = R * c;
                return distance;
            };
            drivers.map(function(driver){
                params.origin = { slat:driver.slat, slong: driver.slong};
                driver.dist = getDistance(userLoc, params.origin);
            });
            drivers.sort(compare);
            //check driver acceptance
            Passenger.findOne({'Id':token.Id},'fname lname rate',function(err, passenger){
                if(err){
                    console.log('Error getting passenger Data');
                    console.log(err.message);
                }else{
                    for (var i = 0; i < drivers.length; i++) {
                        function checkDriverAcceptance(){
                        }
                    }
                }
            });
            return drivers[0];
        }
    }).then(function(selected){
        console.log(selected);
        // res.body.selected = selected;
        //there is a problem in the callback couldn't get selected values
        Driver.find({'Id':selected.driverId},'fname lname phone rate carName model color plateNum',function(err, driverData){
            if(err||!driverData.length){
                console.log('Error Getting Driver Data');
                res.status(200).json({status:'Not Valid',message:'Error Getting Driver Data'});
            }else{
                console.log(token.Id);
                //must check that this passenger isn't combined with another driver first
                online.findByIdAndUpdate({'_id':selected._id},
                    {'driverId':selected.driverId,'passengerId':token.Id,'pending':true,dlong:req.body.dlong
                        , dlat:req.body.dlat,dist:selected.dist},{new:true},function(err, saved){
                    if(err){
                        console.log(err.message)
                        console.log('Failed to update the online driver');
                    }
                        console.log(saved);
                        res.json({
                            status:'Valid',
                            driver:{
                               fname:driverData[0].fname, lname: driverData[0].lname, phone: driverData[0].phone,
                               rate: driverData[0].rate,slong:selected.slong,slat:selected.slat, etime:'',photo:'',
                               edistance:selected.dist
                           },
                            car:{
                               color:driverData[0].color, model:driverData[0].model,
                               platenumber:driverData[0].plateNum,type:driverData[0].type,photo:''
                            }
                        });
                });
            }
        });
    }).catch(function(err){
        console.log(err.message);
        res.status(200).json({status:'Not Valid',message:'Busy Drivers'});
    });

}else{
    res.json({token:'', message:'Source Location is not Valid'});
}
});
module.exports = router;
*/
///////////////////////////////////////////////////////////////////////////////////////////////////////
/*
const router = require('express').Router();
const online = require('../model/drivers/schema').onlineDriver;
const Driver = require('../model/drivers/schema').Driver;
const Car = require('../model/drivers/schema').Car;
const map = require('google_directions');
const async = require('async');
router.post('/',function(req, res){
    var userLoc = {slat:req.body.slat, slang:req.body.slang};
    var params = {
        origin:'',
        destination:userLoc,
        key:'AIzaSyCy8mxfOmJn18yCsHZ-58JPnXelQ95N2aQ',
        mode:'driving',
        avoid:'ferries',
        language:'en',
        units:'metric',
        region:''
    },arr = new Array();

function reject(err){
    console.log('there is no Online Drivers now');
    res.json({message:err.message});
}
 var tr = new Promise.resolve().then(function(){
    online.find({'status':'true'},'driverId slang slat dist',function(err,drivers){
        if(err||!drivers.length){
            reject();
        }else{
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
        drivers.map(function(driver){
        params.origin = { slat:driver.slat, slang: driver.slang};
        driver.dist = getDistance(userLoc, params.origin);
        })
        drivers.sort(compare);
        arr.push(drivers[0]);
        return new Promise(arr);
    }
});
 }).then(function(tempArr){
    Driver.find({'Id':tempArr[0].driverId},'fname lname phone rate',function(err, driverData){
        if(err||!driverData.length){
            reject(Error(''));
        }else{
            console.log(driverData);
            arr.push(driverData[0]);
            return new Promise(arr);
        }
    });
 }).then(function(tempArr){
    Car.find({'driverId':tempArr[0].driverId},'carName model color plateNum',function(err, carData){
        if(err||!carData.length){
            reject(err);
        }else{
            console.log(carData);
            arr.push(carData[0]);
            return new tempArr;
        }
    });
 }).then(function(tempArr){
     res.json({result:tempArr});
 }).catch(function(err){
    reject(err);
 });
console.log(tr);
});
module.exports = router;
*/
/*const router = require('express').Router();
const online = require('../model/drivers/schema').onlineDriver;
const Driver = require('../model/drivers/schema').Driver;
const Car = require('../model/drivers/schema').Car;
const map = require('google_directions');

router.post('/',function(req, res){
    var userLoc = {slat:req.body.slat, slang:req.body.slang};
    var params = {
        origin:'',
        destination:userLoc,
        key:'AIzaSyCy8mxfOmJn18yCsHZ-58JPnXelQ95N2aQ',
        mode:'driving',
        avoid:'ferries',
        language:'en',
        units:'metric',
        region:''
    },arr = new Array();
    online.find({'status':'true'},'driverId slang slat dis').then(function(drivers){
        var compare = function(val1, val2) {
            if (val1.dist < val2.dist)
                return -1;
            else if (val1.dist > val2.dist)
                return 1;
            else
                return 0;
        };
        drivers.map(function(driver){
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
                params.origin = { slat:driver.slat, slang: driver.slang};
                driver.dist = getDistance(userLoc, params.origin);
        }).sort(compare);
        arr.push(drivers[0]);
        return findDriverInfo(arr[0].driverId);
    }).then(function(drivData){
        console.log('Driver' + drivData);
        arr.push(drivData);
        return findCarInfo(arr[0].driverId);
    }).then(function(crData){
        console.log('Car' + crData);
        arr.push(crData);
        return arr;
    }).then(function(tempo){

        console.log('Final' + tempo);
         res.json({message:'Failure'});
    }).catch(function(err){
        console.log(err.message);
        res.json({message:'Failure'});
    });
function findDriverInfo(driverId){
    return new Promise(function(resolve, reject){
        Driver.find({'_id':driverId},'fname lname phone rate'),function(err, driverData){
            if(err){
                reject(err);
                return;
            }
            resolve({
                fname:driverData[0].fname,
                lname:driverData[0].lname,
                phone:driverData[0].phone,
                rate:driverData[0].rate
            });
        }
    });
}
function findCarInfo(driverId){
    return new Promise(function(resolve, reject){
        Car.find({'driverId':driverId},'carName model color plateNum',function(err, carData){
            if(err){
                reject(err);
                return;
                }
            resolve({
                carName:carData[0].carName,
                model:carData[0].model,
                color:carData[0].color,
                plateNum:carData[0].plateNum
            });
        });
    });
}

});
module.exports = router;

//try 2

1-user token ==> for data manipulation
2-getting the driver id and source address in memory
3-


const router = require('express').Router();
const online = require('../model/drivers/schema').onlineDriver;
const Driver = require('../model/drivers/schema').Driver;
const Car = require('../model/drivers/schema').Car;
const map = require('google_directions');
router.post('/',function(req, res){
        console.log(req.body);
        var userLoc = {slat:req.body.slat, slang:req.body.slang};
        var params = {
            origin:'',
            destination:userLoc,
            key:'AIzaSyCy8mxfOmJn18yCsHZ-58JPnXelQ95N2aQ',
            mode:'driving',
            avoid:'ferries',
            language:'en',
            units:'metric',
            region:''
        },obj;
        console.log(userLoc);
        online.find({'status':'true'},'driverId slang slat dist').then(function(drivers){
            console.log(drivers);
            //risky code with async code requesting google api and going to calculate before the result is done
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
            for(var i = 0; i < drivers.length; i++){
                params.origin = { slat:drivers[i].slat, slang: drivers[i].slang};
                drivers[i].dist = getDistance(userLoc, params.origin);
                // map.getDistance(params,function(err, data){
                //     if(err){
                //         console.log('Error requesting google distance api');
                //         return null;
                //     }
                //     console.log(data);
                //     drivers[i].dist = parseFloat(data);
                // });
            }
            console.log(drivers);
            var compare = function(val1, val2) {
                if (val1.dist < val2.dist)
                    return -1;
                else if (val1.dist > val2.dist)
                    return 1;
                else
                    return 0;
            }
            drivers.sort(compare);
            //caching the rest driver if he doesn't accept the first
            return drivers[0];
        }).then(function(selected){
            console.log('Selected' + selected.driverId +'\t'+selected._id);
            // selected.etime = map.getDuration(params, function(err, data){
            //     if(err){
            //         console.log('Error requesting google duration api');
            //         return -1;
            //     }
            //     return data;
            // });
            // if(selected.etime === -1){console.log('OMG FATAL ERROR');}
            Driver.find({'_id':selected.driverId},'fname lname phone rate')
                .then(function(driverData){
                        // selected.driverData = driverData[0];
                        console.log('Driver Data');
                        console.log(driverData[0]);
                        return driverData[0];
                }).then(function(selected){
                    //   Car.find({'_id':select.driverId},'carName model color plateNum')
                    //     .then(function(carData){
                    //             tempo.carData = carData;
                    //         }).catch(function(err){
                    //             console.log('DataBase Error while getting the car data');
                    //             res.json('Internal Server Error');
                    //         });
                }).catch(function(err){
                    console.log('DataBase Error when getting the driver data');
                    res.json('Internal Server Error');
                });
        }).then(function(selected){
            console.log(selected);
            // var obj = { driver:
            //                 {
            //                 fname:selected.driverData.fname,lname:selected.driverData.lname,
            //                 slang:selected.slang,slat:selected.slat,edistance:selected.dist,
            //                 etime:selected.etime,photo:'',rate:selected.driverData.rate,
            //                 phone:selected.driverData.phone
            //             },
            //             car:
            //                 {
            //                 type:selected.carData.carName,model:selected.carData.model,
            //                 color:selected.carData.color,photo:'',plateNum:selected.carData.plateNum
            //             }
            //     };
            // console.log(obj);
            res.status(201).json('Success');
        }).catch(function(err){
            console.log(err.message);
            console.log('DataBase Error when getting the driver data');
            res.json('Internal Server Error');
        });

       //getting the time for this driver to sent to the user


});
module.exports = router;


(function(test) {

    test.match = function(userLoc) {

        var driver = function(lng, lt, dst) {
            this.long = lng;
            this.lat = lt;
            this.dist = dst;
        }
        var driverLocations = [];
        const Drivers = 20;
        var i = 0;
        //    var userlong = (Math.random() * 100).toPrecision(10);
        //    var userlat = (Math.random() * 100).toPrecision(10);
        //    var userLoc = new driver(userlong, userlat);

        for (i; i < Drivers; i++) {
            var long = (Math.random() * 100).toPrecision(10);
            var lat = (Math.random() * 100).toPrecision(10);
            driverLocations[i] = new driver(long, lat);
        }
        //functions
        var rad = function(degree) {
            return degree * Math.PI / 180;
        };

        var getDistance = function(p1, p2) {
            var R = 6378137;
            var dLat = rad(p2.lat - p1.lat);
            var dLong = rad(p2.long - p1.long);
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(p1.lat)) *
                Math.cos(rad(p2.lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
            var distance = R * c;
            return distance;
        };

        var compare = function(val1, val2) {
            if (val1.dist < val2.dist)
                return -1;
            else if (val1.dist > val2.dist)
                return 1;
            else
                return 0;
        }


        for (i = 0; i < driverLocations.length; i++)
            driverLocations[i].dist = getDistance(userLoc, driverLocations[i]);
        driverLocations.sort(compare);

        var obj = new driver(driverLocations[0].long, driverLocations[0].lat, driverLocations[0].dist);

        return driverLocations[0];
    };
    //testo

})(module.exports);


//try 3
const router = require('express').Router();
const online = require('../model/drivers/schema').onlineDriver;
const Driver = require('../model/drivers/schema').Driver;
const Car = require('../model/drivers/schema').Car;
const map = require('google_directions');

router.post('/',function(req, res){
    var userLoc = {slat:req.body.slat, slang:req.body.slang};
    var params = {
        origin:'',
        destination:userLoc,
        key:'AIzaSyCy8mxfOmJn18yCsHZ-58JPnXelQ95N2aQ',
        mode:'driving',
        avoid:'ferries',
        language:'en',
        units:'metric',
        region:''
    },arr = new Array();
    online.find({'status':'true'},'driverId slang slat dist').then(function(drivers){
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
        for(var i = 0; i < drivers.length; i++){
            params.origin = { slat:drivers[i].slat, slang: drivers[i].slang};
            drivers[i].dist = getDistance(userLoc, params.origin);
        }
        var compare = function(val1, val2) {
            if (val1.dist < val2.dist)
                return -1;
            else if (val1.dist > val2.dist)
                return 1;
            else
                return 0;
        };
        drivers.sort(compare);
        arr.push(drivers[0]);
        Driver.find({'_id':arr[0].driverId},'fname lname phone rate',function(err, driverData){
            if(err){console.log(err.message);}
            arr.push(driverData[0]);
        });
        Car.find({'driverId':arr[0].driverId},'carName model color plateNum',function(err, carData){
            if(err){console.log(err.message);}
            arr.push(carData[0]);
        });
        return arr;
    }).then(function(tempArr){
        console.log(tempArr);
        res.json({message:'Success'});
    }).catch(function(err){
        console.log(err.message);
    });


});
module.exports = router;


        Driver.find({'_id':driverId},'fname lname phone rate')
            .then(function(driverData){
                console.log('Driver Data');
                console.log(driverData[0]);
                arr.push(driverData[0]);
                return driverData[0]._id;
            }).catch(function(err){
                console.log(err.message);
            });
             Car.find({'driverId':driverId},'carName model color plateNum')
            .then(function(carData){
                console.log('Car Data');
                console.log(carData);
                arr.push(carData);
                return arr;
            }).catch(function(err){
                console.log(err.message);
            });
*/



