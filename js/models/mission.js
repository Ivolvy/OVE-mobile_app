/*global Backbone */
var app = app || {};

// Mission Model
// ----------


app.Mission = Backbone.Model.extend({
	// Default attributes for the mission
	defaults: {
		title: '',
		date: '19/03',
		category: '',
		sense: '',
		frequency: '',
		interaction: '',
		genre: '',
		completed: false
	},

	// Toggle the `completed` state of this mission item.
	toggle: function () {
		this.save({
			completed: !this.get('completed')
		});
	}
});

