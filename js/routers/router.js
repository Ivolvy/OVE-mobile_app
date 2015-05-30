/*global Backbone */
//var app = app || {};

// Mission Router

app.Router = Backbone.Router.extend({
	routes: {
		'missionPage': 'missionPage',
		'': 'home',
		'missionProposition': 'missionProposition',
		'missionExplication': 'missionExplication',
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
		//if (!this.homeView) {
			//this.homeView = new app.Views.Home();
		//}
		var view = new app.Views.Home();
		app.getInstance().goto(view);
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
	},
	missionProposition: function(){
		var view = new app.Views.MissionPropositionView();
		app.getInstance().goto(view);
	},
	missionExplication: function(){
		var view = new app.Views.MissionExplicationView();
		app.getInstance().goto(view);
	}
});


