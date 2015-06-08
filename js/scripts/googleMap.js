var map;
var direction;
var markerArray = new Array;

function initialize() {
    var previousPosition = null;
    var address = null;
    var origin;
    var destination;
    
    
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

//place a marker on the map
function placePictureMarker(markerLatLngPosition, idMarker){
    //center the map on the new coordinates
    //map.panTo(new google.maps.LatLng(lat, lng));

    //place a marker to the exact position
    markerArray[idMarker] = new google.maps.Marker({
        position:  new google.maps.LatLng(markerArray[idMarker].A, markerArray[idMarker].F),
        map: map
    });
}

//set an info window on the selected marker
function setInfoWindowOnMarker(idMarker){
    //the content displayed in the marker
    var contentString = '<div id="infoWindow" style="width:150px">' +
        '<div><img style="width:150px" src="img/backgrounds/bg_img_dog_blurr.jpg"/></div>'+
        '<div><img style="width:150px" src="img/backgrounds/bg_img_dog_blurr.jpg"/></div>'+
        '<div><img style="width:150px" src="img/backgrounds/bg_img_dog_blurr.jpg"/></div>'+
        '</div>';


    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        size: new google.maps.Size(1000, 1000)
    });

    google.maps.event.addListener(markerArray[idMarker], 'click', function(){
        infowindow.open(map,markerArray[idMarker]);
    });

    //display the carousel when infowindow is created
    google.maps.event.addListener(infowindow, 'domready', function(){
        $('#infoWindow').slick();
    });
}
