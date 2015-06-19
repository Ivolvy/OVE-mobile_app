var originLat;
var originLng;
var destinationLat;
var destinationLng;
var itemMap;
var itemPicture;
var itemMission;
var markerArray = [];
var picsArray = [];
var actualPics;
var totalPics;
var indexNavPage; //the start page id
var route;
var that;
var previousPosition; //previous position of the photo on the map


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
        that = this;
        
        this.animateIn = 'iosSlideInRight';
        this.animateOut = 'slideOutRight';

        //used to listen the trigger route events
        app.listenDetails = this;

        this.listenTo(app.listenDetails, 'visible', this.toggleVisible);

        this.template = _.template($('script[name=mission-explication]').html());

        this.$el.html(this.template());

        this.$page = this.$('.pageContent');
        this.$leftMenu = this.$('.left-menu');
        this.$navigation = this.$('.navigation');
        this.$explication = this.$('.explication');
        this.$actual = this.$('.actual');
        this.$map = this.$('#googleMap');
        this.$camera = this.$('.camera');
        this.$buttonsMap = this.$('#buttonsMap');

        //used to set the indexNavPage
        this.initClickMenu();
        //add event on swipe
        this.initSwipeEvent();

        
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
                
                //if the array is not null, we save the datas in the picsArray
                if(itemPicture.get('picsArray') != 0){
                    picsArray = itemPicture.get('picsArray');
                }
                //launch the map
                that.loadScript();
            }
        });


        return this;
    },

    onRender: function () {

        this.$navigation.html(this.statsTemplate());
        this.$explication.html(this.explicationTemplate());
        this.$actual.html(this.actualTemplate());
        this.$page.append(this.menuTemplate());

        indexNavPage = 1;

        //used to set the indexNavPage
        this.initClickMenu();
        //add event on swipe
        this.initSwipeEvent();

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
                    placePictureMarker(markerArray[i], i, this);
                    //set the info window on the correspondent marker
                    this.setOldInfoWindow(i);
                }
            }
        }
    },
    //take anew picture with the camera
    takePicture: function(){
        if(actualPics < totalPics) {
            cameraApp.takePicture(this);
            actualPics += 1;
        }
    },
    //get the position on the map where the picture is taken
    getPicturePosition: function(){
        navigator.geolocation.getCurrentPosition(this.placeAndSaveMarker, null);
    },
    

    //place a marker on the map and save his coordinates to database
    placeAndSaveMarker: function(position){
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        var position = new google.maps.LatLng(lat, lng);
        var prevMarker = markerArray[markerArray.length-1];

        previousPosition = new google.maps.LatLng(prevMarker.A, prevMarker.F);

        //test if the picture's position is 50 meters further
        //used to store the pictures in the same marker if the are close
        if(previousPosition && position) {
   
            var distance = google.maps.geometry.spherical.computeDistanceBetween(previousPosition, position);

            if(distance > 50) {
                 alert("position supérieur à 0m");
                
                //set a new marker on the map
                var newMarker = markerArray.length;
                fileArray[newMarker] = [];
                fileArray[newMarker].push(fileURL); //add image path in the array
                
                markerArray.push(position);
                placePictureMarker(position, (markerArray.length - 1), this);
                //save insert the new values in database
                itemMap.save({'markerArray': markerArray});

                var actualMarker = markerArray.length - 1;
                that.setNewInfoWindow(actualMarker);
                that.savedPositionAnimation();
            }
            else{
              alert("position inférieure à 0m");

               var actualMarker = markerArray.length - 1;
                if(!fileArray[actualMarker]){
                    fileArray[actualMarker] = [];
                }
                fileArray[actualMarker].push(fileURL); //add image path in the array
                
                //keep the same marker id
                that.setNewInfoWindow(actualMarker);
                that.savedPositionAnimation();
            }
        }
                
    },
    
    //display a popup to say that the picture and the position are saved
    savedPositionAnimation: function(){
        var mc = this.$(".popupUploadOk");

        //on click on begin experience
        this.$pageBody.click(function(){
            var tl = new TimelineMax();
            tl.add( TweenMax.to(mc, 0.5, {bottom:350, force3D:true}) );
            tl.add( TweenMax.to(mc, 0.5, {delay:1, bottom:-50, ease:Back.easeIn, force3D:true}) );
        });
        
    },

    //set info window in a marker on the map - the pictures are present in database
    setOldInfoWindow: function(index){
        if(picsArray[index]) { //if the pics array with index exists
            if (picsArray[index].length != 0) {
                setInfoWindowOnMarker(index);//the id is the place in markerArray
            }
        }
    },
    //set new info window in a marker on the map - the pictures are NOT present in database
    setNewInfoWindow: function(index){
        if(fileArray[index]) { //if the pics array with index exists
            if (fileArray[index].length != 0) {
                setNewInfoWindowOnMarker(index);//the id is the place in markerArray
            }
        }
    },
    //save the value of actualPics in database 
    saveNbPicsOnDatabase: function(){
        itemMission.save({'actualPics': actualPics});
        that.updateNbOfPics();
    },
    //display the new value on the "take picture screen"
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
    },

    initClickMenu: function(){
        this.$('.1').click(function() {
            indexNavPage = 1;
        });
        this.$('.2').click(function() {
            indexNavPage = 2;
        });
        this.$('.3').click(function() {
            indexNavPage = 3;
        });
    },
    initSwipeEvent: function(){
        this.$page.swipe({
            swipeLeft:function(ev){
                if(indexNavPage < 3) {
                    indexNavPage+=1;
                    route = $(".filters ." + indexNavPage).attr('href');
                    Backbone.history.navigate(route, true);
                }
            },
            swipeRight:function(ev){
                if(indexNavPage > 1) {
                    indexNavPage-=1;
                    route = $(".filters ." + indexNavPage).attr('href');
                    Backbone.history.navigate(route, true);
                }
            }
        });
    }
});