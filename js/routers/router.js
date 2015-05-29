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
		// make the Home view persist in memory and on the DOM
		if (!this.homeView) {
			this.homeView = new app.Views.Home();
		}
		app.getInstance().goto(this.homeView);
	},
	missionPage: function () {
		var view = new app.Views.MissionPageView();
		app.getInstance().goto(view);
		
		/*put this fix if I can't resolve the bug when we reload the page
		(the data doesn't display again)*/
		 /*if (!this.pageView) {
		 this.pageView = new app.Views.MissionPageView();
		 }
		 app.getInstance().goto(this.pageView);
		 */
	}
});


