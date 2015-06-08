var itemPicture;
var imageNameArray = new Array;

app.Views.ImageSelectionView = app.Extensions.View.extend({


    id: 'image-selection-template',

    events: {

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

                imageNameArray = itemPicture.get('picsArray');

                that.addImagesOnGallery();
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
        alert("hey");
alert(fileArray[1]);
        //mettre fileArray dans app.js pour récupérer le liens des images partout,
        //avant de les envoyer ensuite sur le serveur
        for(var i=0;i < imageNameArray.length;i++){
            this.$gallery.append('<img class=picture'+i+'>');
            imageUrl = 'http://michaelgenty.com/test/'+imageNameArray[i]+'';
            this.$('.picture'+i+'').css("background", "url('"+imageUrl+"') 50% 50% no-repeat");
            this.$('.picture'+i+'').css("background-size", "cover");
        }

        $('#gallery').click(function(e) {
            var target = $(e.target);
        });
    }

    
});