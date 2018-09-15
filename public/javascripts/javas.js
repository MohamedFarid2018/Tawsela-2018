//var lat1 = 51.7519;
//var lat1 = document.getElementById("latu").value;
//var long1 = -1.2578;
//var long1 = document.getElementById("lng").value;

//var lat2 = 50.8429;
//var lat2 = document.getElementById("latu2").value;
//var long2 = 0.1313;
//var long2 = document.getElementById("lng2").value;


function initMap() {
    var pointA = new google.maps.LatLng(document.getElementById("latu").value, document.getElementById("lng").value),
      pointB = new google.maps.LatLng( document.getElementById("latu2").value, document.getElementById("lng2").value),
      myOptions = {
        zoom: 7,
        center: pointA
      },
      map = new google.maps.Map(document.getElementById('map-canvas'), myOptions),
      // Instantiate a directions service.
      directionsService = new google.maps.DirectionsService,
      directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
      }),
      markerA = new google.maps.Marker({
        position: pointA,
        title: "point A",
        label: "A",
        map: map
      }),
      markerB = new google.maps.Marker({
        position: pointB,
        title: "point B",
        label: "B",
        map: map
      });
  
    // get route from A to B
    calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);
  
  }
  
  
  
  function calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
    directionsService.route({
      origin: pointA,
      destination: pointB,
      travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      } 
    });
  }
  
  initMap();