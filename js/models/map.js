// Mission Map
// ----------

app.MissionMap = Backbone.Model.extend({

// Default attributes for the map
    defaults: {
        missionId: '',
        originLat: '',
        originLng: '',
        destinationLat: '',
        destinationLng: '',
        markerArray: '0'
    }

});

