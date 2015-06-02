var originLat;
var originLng;
var destinationLat;
var destinationLng;
var item;
var markerLat;
var markerLng;

app.Views.MissionExplicationView = app.Extensions.View.extend({


    id: 'mission-explication',

    statsTemplate: _.template($('#explication-nav').html()),

    explicationTemplate: _.template($('#missionExplication-template').html()),

    events: {
     //   'click .begin': 'beginMission',
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
        //app.missionsMaps.create(this.newAttributes(missionId));

       
        //select the map model linked to the mission model
        app.missionsMaps.fetch({
            success: function(model, response) {  
                //get list of maps models where his missionId 
                // = the mission model id - here only one
                var plop = app.missionsMaps.where({'title': missionId});
                //select the only one map model's id
                var mapId = plop[0].id;
                //get the map model froms maps collection
                item = app.missionsMaps.get(mapId);
                //display the title from the map model's id
                //alert(item.get('origin'));

                originLat = item.get('originLat');
                originLng = item.get('originLng');
                destinationLat = item.get('destinationLat');
                destinationLng = item.get('destinationLng');
                
                markerLat = item.get('markerLat');
                markerLng = item.get('markerLng');
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
    

    beginMission: function () {
      //  Backbone.history.navigate('#/missionPage', true);
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
        navigator.geolocation.getCurrentPosition(this.placeAndSaveMarker, null);
    },

    placeAndSaveMarker: function(position){
        if(placePictureMarker(position)){
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;

            item.set({'markerLat': lat, 'markerLng': lng});
        }
    },
    // Generate the attributes for a new Mission map item.
    newAttributes: function (missionId) {
        return {
            title: missionId
        };
    }
    
  

    
    
});