
// Mission Router

app.Router = Backbone.Router.extend({
	routes: {
		'missionPage': 'missionPage',
		'': 'home',
		'missionProposition': 'missionProposition',
		'missionExplication/:id': 'missionExplication',
		'missionOpinion': 'missionOpinion',
		'filterMissions/*action': 'setFilterMissions',
		'filterDetails/*action': 'setFilterDetails',
		'imageSelection/:id': 'imageSelection'
	},

	setFilterMissions: function (param) {
		//param = the argument in the "href="#/completed": this is "completed" here
		// Set the current filter to be used
		app.MissionFilter = param || '';

		// Trigger a collection filter event, causing hiding/unhiding
		// of Mission view items
		app.missions.trigger('filter');
	},
	setFilterDetails: function (param) {
		//param = the argument in the "href="#/completed": this is "completed" here
		// Set the current filter to be used
		app.DetailFilter = param || '';

		// Trigger a collection filter event, causing hiding/unhiding
		// of Mission view items
		app.listenDetails.trigger('visible');
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
	missionExplication: function(id){
		var view = new app.Views.MissionExplicationView(id);
		app.getInstance().goto(view);
	},
	imageSelection: function(id){
		var view = new app.Views.ImageSelectionView(id);
		app.getInstance().goto(view);
	},
	missionOpinion: function(){
		var view = new app.Views.MissionOpinionView();
		app.getInstance().goto(view);
	}
});


