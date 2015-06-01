
var ENTER_KEY = 13;

window.app = {
    Views: {},
    Extensions: {},
    Router: {},
    Collections: {},
    Model: {},

    init: function () {
        // get an instance of the root App view
        this.getInstance();
        new app.Router();
        // start backbone hash change listener
        Backbone.history.start();
    },

    // use a getter method to get the instance instead accessing this.instance
    // directly. Also, this prevents multiple instantiation of the application
    getInstance: function() {
        // creates a new instance of the root App
        // or returns the instance if it already exists
        if (!this.instance) {            
            this.instance = new app.Views.AppView();
        }
        return this.instance;
    }

};

//app.init();
