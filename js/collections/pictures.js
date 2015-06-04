// Pictures Collection

/*We use Firebase to store the datas*/
var PicturesCollection = Backbone.Firebase.Collection.extend({
    // Reference to this collection's model.
    model: app.MissionPicture,
    url: 'https://ove.firebaseio.com/pictures',
    autoSync: true

});
