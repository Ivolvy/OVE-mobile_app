var itemPicture;
var imageNameArray = new Array;
var imageToSendArray = new Array;

app.Views.ImageSelectionView = app.Extensions.View.extend({

    id: 'image-selection-template',

    events: {
        'click .send': 'sendPicsToWeb',
        'click .cancel': 'cancelSelection'
    },

    initialize: function (missionId) {
        var that = this;

        this.animateIn = 'iosSlideInRight';
        this.animateOut = 'slideOutRight';

        this.template = _.template($('script[name=image-selection-template]').html());
        this.$el.html(this.template());

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

    render: function () {
        // return this;
    },

    addImagesOnGallery: function(){
        this.$gallery = this.$('#gallery');
        var imageUrl;

        //mettre fileArray dans app.js pour récupérer le liens des images partout,
        //avant de les envoyer ensuite sur le serveur
        for(var i=0;i < fileArray.length;i++){
            this.$gallery.append('<img class=picture'+i+'>');
            //imageUrl = 'http://michaelgenty.com/test/'+imageNameArray[i]+'';
            imageUrl = fileArray[i];
            this.$('.picture'+i+'').css("background", "url('"+imageUrl+"') 50% 50% no-repeat");
            this.$('.picture'+i+'').css("background-size", "cover");
            this.$('.picture'+i+'').attr("srcImg", imageUrl);
        }

        $('#gallery img').click(function() {
            imageToSendArray.push($(this).attr('srcImg'));
        });
    },

    sendPicsToWeb: function(){
        cameraApp.uploadPicture(this, imageToSendArray);
    },

    savePicturesInDatabase: function(imageToSaveInBDDArray){
        for(var i=0;i < fileArray.length;i++){
            imageNameArray.push(fileArray[i].substr(imageToSaveInBDDArray[i].lastIndexOf('/') + 1));
            itemPicture.save({'picsArray': imageNameArray});

            if(i == imageToSaveInBDDArray.length - 1){
                return true;
            }
        }
        alert("pictures uploaded");
    },
    cancelSelection: function(){
        var missionId = itemPicture.get('missionId');
        Backbone.history.navigate('#/missionExplication/'+missionId, true);
    }

});