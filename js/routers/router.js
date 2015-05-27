/*global Backbone */
//var app = app || {};

// Mission Router

app.Router = Backbone.Router.extend({
	routes: {
		'missionPage': 'missionPage',
		'': 'home',
		'*filter': 'setFilter'
	},

	setFilter: function (param) {
		// Set the current filter to be used
		app.MissionFilter = param || '';

		// Trigger a collection filter event, causing hiding/unhiding
		// of Mission view items
		app.missions.trigger('filter');
	},
	home: function () {
		var view = new app.Views.Home();
		app.instance.goto(view);
	},
	missionPage: function () {
		var view = new app.Views.MissionPageView();
		app.instance.goto(view);
	}
});
//app.Router = new Router();
//Backbone.history.start();

