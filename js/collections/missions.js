// Mission Collection

/*We use Firebase to store the datas*/
var Missions = Backbone.Firebase.Collection.extend({
	// Reference to this collection's model.
	model: app.Mission,
	url: 'https://ove.firebaseio.com/missions',
	autoSync: true, // this is true by default

	// Save all of the mission items under the `"missions-backbone"` namespace.
	//localStorage: new Backbone.LocalStorage('missions-backbone'),

	// Filter down the list of all mission items that are finished.
	completed: function () {
		return this.where({completed: true});
	},
	actual: function () {
		return this.where({actual: true});
	},
	// Filter down the list to only mission items that are still not finished.
	remaining: function () {
		return this.where({completed: false});
	},

	// We keep the Missions in sequential order, despite being saved by unordered
	// GUID in the database. This generates the next order number for new items.
	nextOrder: function () {
		return this.length ? this.last().get('order') + 1 : 1;
	},

	// Missions are sorted by their original insertion order.
	comparator: 'order'
});

// Create our global collection of **Missions**.
