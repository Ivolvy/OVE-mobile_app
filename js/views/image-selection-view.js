var itemPicture;
var imageNameArray = [];
var tempImagesArray = [];
var itemMission;

app.Views.ImageSelectionView = app.Extensions.View.extend({

    id: 'image-selection-template',

    menuTemplate: _.template($('#menu-template').html()),

    events: {
        'click .send': 'sendPicsToWeb',
        'click .cancel': 'cancelSelection',
        'click .left-menu': 'toggleMenu'
    },

    initialize: function (missionId) {
        var that = this;

        this.animateIn = 'iosSlideInRight';
        this.animateOut = 'slideOutRight';

        this.template = _.template($('script[name=image-selection-template]').html());
        this.$el.html(this.template());

        this.$page = this.$('.pageContent');
        this.$leftMenu = this.$('.left-menu')

        app.missions = new Missions();
        app.missionsPictures = new PicturesCollection();


        app.missions.fetch({
            success: function(model, response) {

                var missionCollection = app.missions.where({'id': missionId});

                var missionModelId = missionCollection[0].id;
                itemMission = app.missions.get(missionModelId);

            }
        });

        app.missionsPictures.fetch({
            success: function(model, response) {

                var pictureCollection = app.missionsPictures.where({'missionId': missionId});

                var pictureId = pictureCollection[0].id;
                itemPicture = app.missionsPictures.get(pictureId);
                //alert(itemMap.get('origin'));

                // imageNameArray = itemPicture.get('picsArray');
                if(fileArray != 0){
                    that.addImagesOnGallery();
                }
            }
        });

        // return this;
    },

    onRender: function () {
        this.$page.append(this.menuTemplate());
    },

    addImagesOnGallery: function(){
        this.$gallery = this.$('#gallery');
        var imageUrl;
        var picsId;
        var markerId;
        var srcImg;

        //before send the pictures on the server, they are retrieved from the phone
        //display all the marker's image on the screen of imageSelection
        for(var index=0;index < (markerArray.length);index++){
            if(fileArray[index]){
                for(var i=0;i < fileArray[index].length;i++){
                    this.$gallery.append('<div class=picture'+i+'><div class="backColor hidden"><img id='+i+' markerId='+index+' src="img/picto_photo_select.png"></div></div>');
                    //imageUrl = 'http://michaelgenty.com/test/1433883728454.jpg';
                    imageUrl = fileArray[index][i];
                    this.$('.picture'+i+'').css("background", "url('"+imageUrl+"') 50% 50% no-repeat");
                    this.$('.picture'+i+'').css("background-size", "cover");
                    this.$('.picture'+i+'').attr("srcImg", imageUrl);
                }
            }
        }
        //init the slick slide gallery
        this.$gallery.slick({
            vertical: true,
            verticalSwiping: true,
            arrows: false,
            slidesToShow: 2,
            slidesToScroll: 1
        });
        
        //on click on an image
        $('.slick-track div').click(function() {
            $(this).find('div').toggleClass('hidden');
            srcImg = $(this).attr('srcImg');
            markerId = $(this).find('img').attr('markerId');
            picsId = $(this).find('img').attr('id');

            if(!tempImagesArray[markerId]){
                tempImagesArray[markerId] = [];
            }

            //if the picture is not seleted
            if($(this).find('div').hasClass('hidden')){
                tempImagesArray[markerId][picsId] = "0";
            }
            else {
                //if the picture is selected, save her url in the array
                tempImagesArray[markerId][picsId] = srcImg;
            }
        });
    },

    //send the selected pics to the server
    sendPicsToWeb: function(){
        //upload the selected pictures on the server
        cameraApp.uploadPicture(this, tempImagesArray);
    },

    //saves the selected pictures from imageSelection in database
    savePicturesInDatabase: function(imageToSaveInBDDArray){
        var length = imageToSaveInBDDArray.length;
        for(var index=0;index < length;index++) {
             if(imageToSaveInBDDArray[index]){
                var subLength = imageToSaveInBDDArray[index].length;
                for (var i = 0; i < subLength; i++) {
                    if(imageToSaveInBDDArray[index][i] != "0"){ //if there is no pictures
                        var imageFile = imageToSaveInBDDArray[index][i];
                        var fileName = imageFile.substr(imageFile.lastIndexOf('/') + 1);

                        if(!imageNameArray[index]){
                            imageNameArray[index] = [];
                        }

                        imageNameArray[index][i] = fileName;
                    }
                }
             }

          if(index == (length - 1)){
                //save the array of all marker's pictures
                itemPicture.save({'picsArray': imageNameArray});
                return true;
          }
      }


    },
    goToMissionOpinion: function(){
        itemMission.save({'actual': false});
        Backbone.history.navigate('#/missionPage', true);
    },
    cancelSelection: function(){
      /*  var missionId = itemPicture.get('missionId');
        Backbone.history.navigate('#/missionExplication/'+missionId, true);*/
    },
    
    //display or not the panel menu
    toggleMenu: function () {
        this.$page.toggleClass('sml-open');
        this.$leftMenu.toggleClass('open');
    }
    

});