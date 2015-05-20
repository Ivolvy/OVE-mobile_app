/*global Backbone */
var app = app || {};

// Mission Router

var MissionRouter = Backbone.Router.extend({
	routes: {
		'*filter': 'setFilter'
	},

	setFilter: function (param) {
		// Set the current filter to be used
		app.MissionFilter = param || '';

		// Trigger a collection filter event, causing hiding/unhiding
		// of Mission view items
		app.missions.trigger('filter');
	}
});

app.MissionRouter = new MissionRouter();
Backbone.history.start();

