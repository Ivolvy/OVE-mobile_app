// Mission Collection

/*We use Firebase to store the datas*/
var Maps = Backbone.Firebase.Collection.extend({
    // Reference to this collection's model.
    model: app.Map,
    url: 'https://ove.firebaseio.com/maps',
    autoSync: true

});
