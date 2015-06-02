// Mission Collection

/*We use Firebase to store the datas*/
var MapsCollection = Backbone.Firebase.Collection.extend({
    // Reference to this collection's model.
    model: app.MissionMap,
    url: 'https://ove.firebaseio.com/maps',
    autoSync: true

});
