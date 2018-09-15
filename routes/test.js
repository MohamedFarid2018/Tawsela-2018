<!DOCTYPE html>
<html>
   <head>
      <title>Hello world</title>
   </head>
   <script src = "/socket.io/socket.io.js"></script>
   <script>
      var socket = io('/drivers');
      socket.emit('goOnline',{token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6ImRJZC0xNTE4NDA0MDUwMDUwNDk5NDI2NzczOGY0ZDY3NTIiLCJpYXQiOjE1MTg0MDQwNTB9.CzwYKBcGVRztNWLEz5YgMBHv-WN2E5hy1JMQI6um3GU',
        slong:22.2254,slat:30.111323434,dlong:10.10101010, dlat: 12.12121212,etime:60, edistance:12});
      
        for(var i = 0; i< 10; i++){
        setTimeout(() => {
          socket.emit('online',{token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6ImRJZC0xNTE4NDA0MDUwMDUwNDk5NDI2NzczOGY0ZDY3NTIiLCJpYXQiOjE1MTg0MDQwNTB9.CzwYKBcGVRztNWLEz5YgMBHv-WN2E5hy1JMQI6um3GU',
        slong:22.2254,slat:30.111323434,dlong:10.10101010, dlat: 12.12121212,etime:60, edistance:12});
        }, 1000);

      }
          socket.on('live', function(data){
      console.log(data);
    });
   </script>

<!--  <script>
    var socket = io();
    socket.emit('goOnline',{token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6ImRJZC0xNTE4NDA0MDUwMDUwNDk5NDI2NzczOGY0ZDY3NTIiLCJpYXQiOjE1MTg0MDQwNTB9.CzwYKBcGVRztNWLEz5YgMBHv-WN2E5hy1JMQI6um3GU',
        slong:22.2254,slat:30.111323434,dlong:10.10101010, dlat: 12.12121212,etime:60, edistance:12});

  </script>
-->
   <body></body>
</html>