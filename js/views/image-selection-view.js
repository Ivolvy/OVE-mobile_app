var itemPicture;
var imageNameArray = new Array;
var tempImagesArray = new Array;
var imageToSendArray = new Array;

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
        this.$leftMenu = this.$('.left-menu');
        app.missionsPictures = new PicturesCollection();

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
        var index;

        //mettre fileArray dans app.js pour récupérer le liens des images partout,
        //avant de les envoyer ensuite sur le serveur
        //les images sont récupérées sur le téléphone
        for(var i=0;i < fileArray.length;i++){
            this.$gallery.append('<div class=picture'+i+'><div class="backColor hidden"><img id='+i+' src="img/picto_photo_select.png"></div></div>');
            //imageUrl = 'http://michaelgenty.com/test/1433883728454.jpg';
            imageUrl = fileArray[i];
            this.$('.picture'+i+'').css("background", "url('"+imageUrl+"') 50% 50% no-repeat");
            this.$('.picture'+i+'').css("background-size", "cover");
            this.$('.picture'+i+'').attr("srcImg", imageUrl);
        }
        //on click on an image
        $('#gallery div').click(function() {
            $(this).find('div').toggleClass('hidden');
            index = $(this).find('img').attr('id');
            if($(this).find('div').hasClass('hidden')){
                tempImagesArray[index] = "0";
            }
            else {
                tempImagesArray[index] = $(this).attr('srcImg'); //save her url
            }
        });
    },

    //send the selected pics to the server
    sendPicsToWeb: function(){
        for(var i=0;i < tempImagesArray.length;i++) {
            if(tempImagesArray[i]!= "0"){
                imageToSendArray.push(tempImagesArray[i]);
            }
        }
        //upload the selected pictures on the server
        cameraApp.uploadPicture(this, imageToSendArray);
    },

    //saves the selected pictures in the database
    savePicturesInDatabase: function(imageToSaveInBDDArray){
        for(var i=0;i < fileArray.length;i++){
            imageNameArray.push(fileArray[i].substr(imageToSaveInBDDArray[i].lastIndexOf('/') + 1));
            itemPicture.save({'picsArray': imageNameArray});

            if(i == imageToSaveInBDDArray.length - 1){
                return true;
            }
        } 
    },
    goToMissionOpinion: function(){
        Backbone.history.navigate('#/missionOpinion', true);
    },
    cancelSelection: function(){
        var missionId = itemPicture.get('missionId');
        Backbone.history.navigate('#/missionExplication/'+missionId, true);
    },
    
    //display or not the panel menu
    toggleMenu: function () {
        this.$page.toggleClass('sml-open');
        this.$leftMenu.toggleClass('open');
    }
    

});