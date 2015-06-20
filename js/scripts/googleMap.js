var map;
var direction;
var markerArrayOnMap = [];

function initialize() {

    var styles = [
        {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [
                { "visibility": "off" }
            ]
        },{
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [
                { "visibility": "off" }
            ]
        },{
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
                { "color": "#ffffff" }
            ]
        },{
            "featureType": "landscape",
            "elementType": "labels",
            "stylers": [
                { "visibility": "off" }
            ]
        },{
            "featureType": "poi",
            "elementType": "labels",
            "stylers": [
                { "visibility": "off" }
            ]
        },{
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
                { "color": "#a59ebd" }
            ]
        },{
            "featureType": "landscape",
            "elementType": "geometry.fill",
            "stylers": [
                { "color": "#e7dfee" }
            ]
        },{
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                { "visibility": "off" }
            ]
        },{
            "featureType": "transit",
            "elementType": "labels.icon",
            "stylers": [
                { "visibility": "off" }
            ]
        },{
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [
                { "visibility": "on" }
            ]
        },{
            "featureType": "poi.medical"  }

        ];

    var mapOptions = {
        center: {lat: 45.8992470, lng: 6.1293840},
        //center: new google.maps.LatLng(-34.397, 150.644)
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        panControl: false,
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        streetViewControl: false
    };



    if (navigator.geolocation) {
        //watch periodically the position
        // var watchId = navigator.geolocation.watchPosition(successCallback, null, {enableHighAccuracy: true});
    }else{
        alert("We can't geotag you");
    }

    function successCallback(position) {
        //don't take in consideration when gps lost the signal
        // if (position.coords.accuracy < 100) {
        //center the map on the new coordinates
        map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
        //place a marker to the exact position
        /* var marker = new google.maps.Marker({
         position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
         map: map
         });*/
        //draw a line between the previous position and the actual
        /*if (previousPosition) {
         var newLineCoordinates = [
         new google.maps.LatLng(previousPosition.coords.latitude, previousPosition.coords.longitude),
         new google.maps.LatLng(position.coords.latitude, position.coords.longitude)];

         var newLine = new google.maps.Polyline({
         path: newLineCoordinates,
         strokeColor: "#FF0000",
         strokeOpacity: 1.0,
         strokeWeight: 2
         });
         newLine.setMap(map);
         }
         previousPosition = position;*/
        //  }
    }
    //custom map
    var styledMap = new google.maps.StyledMapType(styles);
    map = new google.maps.Map(document.getElementById("googleMap"),mapOptions);
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');
    
    direction = new google.maps.DirectionsRenderer({
        map   : map
    });

    //display the map init where the user is
    navigator.geolocation.getCurrentPosition(successCallback, null);
}


//init the values to trace the itinerary
function initItineray(originLat, originLng, destinationLat, destinationLng){
    setAddress(originLat, originLng, 'origin');
    setAddress(destinationLat, destinationLng, 'destination');
}

/* set the address with lat and long coordinates*/
function setAddress(lat, lng, position){
    var latlng = new google.maps.LatLng(lat, lng);

    geocoder = new google.maps.Geocoder();
    geoOptions = {
        "latLng" : latlng
    };
    geocoder.geocode( geoOptions, function(results, status) {
        /* Si les coordonnées ont pu être geolocalisées */
        if (status == google.maps.GeocoderStatus.OK) {
            if(position == 'origin'){
                origin = results[0].formatted_address;
            }
            else if(position == 'destination'){
                destination = results[0].formatted_address;
                traceItinerary(origin, destination);
            }

        } else {
            alert("Les nouvelles coordonnées n'ont pu être géocodées avec succès.");
        }
    });
}

//trace the itinerary between the start and the end point of the traject
function traceItinerary(origin, destination){

    if(origin && destination){
        var request = {
            origin      : origin,
            destination : destination,
            travelMode  : google.maps.DirectionsTravelMode.WALKING // Type de transport
        };
        var directionsService = new google.maps.DirectionsService(); // Service de calcul d'itinéraire
        directionsService.route(request, function(response, status){ // Envoie de la requête pour calculer le parcours
            if(status == google.maps.DirectionsStatus.OK){
                direction.setDirections(response); // Trace l'itinéraire sur la carte et les différentes étapes du parcours
            }
        });
    }
}

//place a marker on the map when a picture is taken
function placePictureMarker(markerLatLngPosition, idMarker, missionExplication){
    //center the map on the new coordinates
    //map.panTo(new google.maps.LatLng(lat, lng));
    //place a marker to the exact position
    markerArrayOnMap[idMarker] = new google.maps.Marker({
        position:  new google.maps.LatLng(markerLatLngPosition.A, markerLatLngPosition.F),
        map: map
    });
    map.panTo(new google.maps.LatLng(markerLatLngPosition.A, markerLatLngPosition.F);
}

//set an info window on the selected marker - for existing pictures on server
function setInfoWindowOnMarker(index) {
    //the content displayed in the marker

    var contentString = '<div class="infoWindow_'+index+'" style="width:150px">';
    
    //insert all the marker's pictures in the popup content
    for (var i = 0; i < picsArray[index].length; i++) {
        contentString += '<div><img style="width:150px" src=http://michaelgenty.com/test/' + picsArray[index][i] + '></div>';
    }
    contentString += '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        size: new google.maps.Size(1000, 1000)
    });

    google.maps.event.addListener(markerArrayOnMap[index], 'click', function () {
        infowindow.open(map, markerArrayOnMap[index]);
    });

    //display the carousel when infowindow is created
    google.maps.event.addListener(infowindow, 'domready', function () {
        $('.infoWindow_'+index).slick(); //slick is the carousel
    });

}

//set an new info window on the selected marker - for inexistent pictures on server
function setNewInfoWindowOnMarker(index){
    //the content displayed in the marker

    var contentString = '<div class="infoWindow_'+index+'" style="width:150px">';

    //insert all the marker's pictures in the popup content
    for(var i=0;i < fileArray[index].length;i++){
        contentString+='<div><img style="width:150px" src='+fileArray[index][i]+'></div>';
    }
   
    contentString+='</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        size: new google.maps.Size(1000, 1000)
    });
 
    google.maps.event.addListener(markerArrayOnMap[index], 'click', function(){
        infowindow.open(map,markerArrayOnMap[index]);
    });
   
    //display the carousel when infowindow is created
    google.maps.event.addListener(infowindow, 'domready', function(){
        $('.infoWindow_'+index).slick(); //slick is the carousel
    });
    
}
