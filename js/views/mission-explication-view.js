var originLat;
var originLng;
var destinationLat;
var destinationLng;
var itemMap;
var itemPicture;
var itemMission;
var imageNameArray = new Array;
var markerArray = new Array;
var actualPics;
var totalPics;


app.Views.MissionExplicationView = app.Extensions.View.extend({

    id: 'mission-explication',

    statsTemplate: _.template($('#explication-nav').html()),

    explicationTemplate: _.template($('#missionExplication-template').html()),

    actualTemplate: _.template($('#missionActual-template').html()),

    menuTemplate: _.template($('#menu-template').html()),

    events: {
        'click #takePicture': 'takePicture',
        'click .finish': 'toggleFinish',
        'click .left-menu': 'toggleMenu'
    },


    initialize: function (missionId) {
        var that = this;

        this.animateIn = 'iosSlideInRight';
        this.animateOut = 'slideOutRight';

        //used to listen the trigger route events
        app.listenDetails = this;

        this.listenTo(app.listenDetails, 'visible', this.toggleVisible);

        this.template = _.template($('script[name=mission-explication]').html());

        this.$el.html(this.template());

        this.$page = this.$('.page');
        this.$leftMenu = this.$('.left-menu');
        this.$navigation = this.$('.navigation');
        this.$explication = this.$('.explication');
        this.$actual = this.$('.actual');
        this.$map = this.$('#googleMap');
        this.$camera = this.$('.camera');
        this.$buttonsMap = this.$('#buttonsMap');
        
        
        app.missions = new Missions();
        app.missionsMaps = new MapsCollection();
        app.missionsPictures = new PicturesCollection();

        //app.missionsMaps.create(this.newAttributesMap(missionId));
        //app.missionsPictures.create(this.newAttributesPicture(missionId));


        app.missions.fetch({
            success: function(model, response) {

                var missionCollection = app.missions.where({'id': missionId});

                var missionModelId = missionCollection[0].id;
                itemMission = app.missions.get(missionModelId);

                actualPics = itemMission.get('actualPics');
                totalPics = itemMission.get('totalPics');

                that.updateNbOfPics();
            }
        });

        //select the map model linked to the mission model
        app.missionsMaps.fetch({
            success: function(model, response) {
                //get list of maps models where his missionId 
                // = the mission model id - here only one

                var exists = app.missionsMaps.where({'missionId': missionId});
                if(exists == "" || exists == undefined){
                    app.missionsMaps.create(that.newAttributesMap(missionId));
                }
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

                //if the array is not null, we save the datas in the markerArray
                if(itemMap.get('markerArray') != 0){
                    markerArray = itemMap.get('markerArray');
                }
            }
        });

        app.missionsPictures.fetch({
            success: function(model, response) {

                var exists = app.missionsPictures.where({'missionId': missionId});

                if(exists == "" || exists == undefined){
                    app.missionsPictures.create(that.newAttributesPicture(missionId));
                }

                var pictureCollection = app.missionsPictures.where({'missionId': missionId});

                var pictureId = pictureCollection[0].id;
                itemPicture = app.missionsPictures.get(pictureId);
                //alert(itemMap.get('origin'));

            }
        });


        return this;
    },

    onRender: function () {

        this.$navigation.html(this.statsTemplate());
        this.$explication.html(this.explicationTemplate());
        this.$actual.html(this.actualTemplate());
        this.$page.append(this.menuTemplate());

        return this;
    },

    toggleVisible: function () {
        var visible;
        if(app.DetailFilter == 'explication'){
            visible = 1;
            this.$explication.toggleClass('hidden', false);
            this.$camera.toggleClass('hidden', true);
            this.$map.toggleClass('hidden', true);
            this.$buttonsMap.toggleClass('hidden', true);
        }
        else if(app.DetailFilter == 'mission'){
            visible = 2;
            this.$explication.toggleClass('hidden', true);
            this.$camera.toggleClass('hidden', false);
            this.$map.toggleClass('hidden', true);
            this.$buttonsMap.toggleClass('hidden', true);
        }
        else if(app.DetailFilter == 'terminate'){
            visible = 3;
            this.$explication.toggleClass('hidden', true);
            this.$camera.toggleClass('hidden', true);
            this.$map.toggleClass('hidden', false);
            this.$buttonsMap.toggleClass('hidden', false);

            this.loadScript();
        }
        for(var i=1;i<=3;i++) {
            if(i == visible) {
                this.$('.filters li:nth-child('+i+') a').addClass('selected');
            }
            else{
                this.$('.filters li:nth-child('+i+') a').removeClass('selected');
            }
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
            if(markerArray.length != 0) {
                for(var i=0;i < markerArray.length;i++){
                    placePictureMarker(markerArray[i], [i]);
                }
                this.setInfoWindow();
            }
        }
    },

    takePicture: function(){
        cameraApp.takePicture(this);
        actualPics+=1;
        itemMission.save({'actualPics': actualPics});
    },
    getPicturePosition: function(){
        this.updateNbOfPics();
        navigator.geolocation.getCurrentPosition(this.placeAndSaveMarker, null);
    },

    //place a marker on the map and save his coordinates to database
    placeAndSaveMarker: function(position){
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        var latLng = new google.maps.LatLng(lat, lng);

        markerArray.push(latLng);
        //save insert the new values in database
        itemMap.save({'markerArray': markerArray});
    },

    //set info window in a marker on the map
    setInfoWindow: function(){
        setInfoWindowOnMarker(0);//the id is the place in markerArray
    },

    updateNbOfPics: function(){
        this.$('#totalPicture').html(actualPics+'/'+totalPics);
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
    },
    //display image selection
    toggleFinish: function () {
        var missionId = itemMission.get('id');
        Backbone.history.navigate('#/imageSelection/'+missionId, true);
    },

    //display or not the panel menu
    toggleMenu: function () {
        this.$page.toggleClass('sml-open');
        this.$leftMenu.toggleClass('open');
    }

});