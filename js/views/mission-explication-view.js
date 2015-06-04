var originLat;
var originLng;
var destinationLat;
var destinationLng;
var itemMap;
var itemPicture;
var picsArray = Array;
var markerLat;
var markerLng;

app.Views.MissionExplicationView = app.Extensions.View.extend({


    id: 'mission-explication',

    statsTemplate: _.template($('#explication-nav').html()),

    explicationTemplate: _.template($('#missionExplication-template').html()),

    events: {
        'click .upload': 'uploadPicture',
        'click .begin': 'takePicture'
    },


initialize: function (missionId) {
        this.animateIn = 'iosSlideInRight';
        this.animateOut = 'slideOutRight';

        //used to listen the trigger route events
        app.listenDetails = this;
        
        this.listenTo(app.listenDetails, 'visible', this.toggleVisible);
        
        this.template = _.template($('script[name=mission-explication]').html());

        this.$el.html(this.template());

        this.$navigation = this.$('.navigation');
        this.$explication = this.$('.explication');
        this.$map = this.$('#googleMap');
        this.$camera = this.$('.camera');
    
        app.missionsMaps = new MapsCollection();
        app.missionsPictures = new PicturesCollection();

        //app.missionsMaps.create(this.newAttributesMap(missionId));
        app.missionsPictures.create(this.newAttributesPicture(missionId));

        //select the map model linked to the mission model
        app.missionsMaps.fetch({
            success: function(model, response) {  
                //get list of maps models where his missionId 
                // = the mission model id - here only one
                var mapCollection = app.missionsMaps.where({'missionId': missionId});
                //select the only one map model's id
                var mapId = mapCollection[0].id;
                //get the map model froms maps collection
                itemMap = app.missionsMaps.get(mapId);
                //display the title from the map model's id
                //alert(itemMap.get('origin'));

                originLat = itemMap.get('originLat');
                originLng = itemMap.get('originLng');
                destinationLat = itemMap.get('destinationLat');
                destinationLng = itemMap.get('destinationLng');
                
                markerLat = itemMap.get('markerLat');
                markerLng = itemMap.get('markerLng');
            }   
        });

        app.missionsPictures.fetch({
            success: function(model, response) {  
               
                var pictureCollection = app.missionsPictures.where({'missionId': missionId});
              
                var pictureId = pictureCollection[0].id;
                itemPicture = app.missionsPictures.get(pictureId);
                //alert(itemMap.get('origin'));

                picsArray = itemPicture.get('picsArray');
            }   
        });

        return this;
    },

    render: function () {

        this.$navigation.html(this.statsTemplate());
        this.$explication.html(this.explicationTemplate());
        
        return this;
    },

    toggleVisible: function () {

        if(app.DetailFilter == 'explication'){
            this.$explication.toggleClass('hidden', false);
            this.$camera.toggleClass('hidden', true);
            this.$map.toggleClass('hidden', true);
        }
        else if(app.DetailFilter == 'mission'){
            this.$explication.toggleClass('hidden', true);
            this.$camera.toggleClass('hidden', false);
            this.$map.toggleClass('hidden', true);
        }
        else if(app.DetailFilter == 'terminate'){
            this.$explication.toggleClass('hidden', true);
            this.$camera.toggleClass('hidden', true);
            this.$map.toggleClass('hidden', false);
            this.loadScript();
        }
        
    },
    

    loadScript: function () {

        //google.maps.event.addDomListener(window, 'load', initialize);
        if (!map) {
            //launch the map
            initialize();

            //trace itineray if exists
            if(originLat && originLng && destinationLat && destinationLng) {
                initItineray(originLat, originLng, destinationLat, destinationLng);
            }
            //place marker if exists
            if(markerLat && markerLng) {
                placePictureMarker(null, markerLat, markerLng);
            }
        }
    },
    
    takePicture: function(){
        if(cameraApp.takePicture()) {
            navigator.geolocation.getCurrentPosition(this.placeAndSaveMarker, null);
        }
    },
    uploadPicture: function(){
        cameraApp.uploadPicture(this);
    },

    savePicturesInDatabase: function(fileArray){
        var imageNameArray = new Array;
        for(var i=0;i < fileArray.length;i++){
            imageNameArray.push(fileArray[i].substr(fileArray[i].lastIndexOf('/') + 1));
            itemPicture.set({'picsArray': imageNameArray});

            if(i == fileArray.length - 1){
                return true;
            }
        }
    },
    
    //place a marker on the map and save his coordinates to database
    placeAndSaveMarker: function(position){
        if(placePictureMarker(position)){
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;

            itemMap.set({'markerLat': lat, 'markerLng': lng});
        }
    },
    // Generate the attributes for a new Mission map itemMap.
    newAttributesMap: function (missionId) {
        return {
            missionId: missionId
        };
    },
    // Generate the attributes for a new Mission picture itemMap.
    newAttributesPicture: function (missionId) {
        return {
            missionId: missionId
        };
    }

    
});