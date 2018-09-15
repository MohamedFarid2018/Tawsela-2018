const server = require('../index').server;
const io = require('socket.io').listen(server);
const jwt = require('jsonwebtoken');
io.on('connection',function(socket){
        if(socket.token){
            token =  jwt.verify(socket.token, 'Garry Kasparov');
            socket.Id = token.Id;
        }else{
            console.log('The token is not send');
            //handling the error
        }
        //serialize the driver object to the database
    socket.on('requestTrip',function(data){
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
        var emptyDrivers = io.sockets.sockets.filter(function(sock){
            if(sock.type === 'd' && sock.status === 'true' && sock.pending === 'false'){
                return sock;
            }
        }).map(function(sock){
            sock.dist = getDistance(socket, sock);
        });
        emptyDrivers.sort(compare);

    });
});
