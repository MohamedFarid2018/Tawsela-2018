const server = require('../index').server;
const io = require('socket.io').listen(server);
const jwt = require('jsonwebtoken');
const nsp = io.of('/live');
nsp.on('connection',function(socket){
    var token = jwt.verify(socket.token, 'Garry Kasparov');
    
    socket.join();
});
module.exports = function(){
    io.on('connection',function(socket){
        console.log('A user Connected');

        socket.on('message',function(data){
            var token = jwt.verify(data.token, 'Garry Kasparov');
            console.log(data.token);
            console.log(data.updatedslat);
            console.log(data.updatedslong);
            socket.emit('message',{message:'Success'});
        });

        socket.on('disconnect',function(){
            console.log('A user Disconnected');
        });
    });
}
