/*global Backbone*/
//var app = app || {};


// The Application

// Our overall **MissionPageView** is the top-level piece of UI.
app.Views.MissionPageView = app.Extensions.View.extend({

	/* Instead of generating a new element, bind to the existing skeleton of
	 the App already present in the HTML.*/
	id: 'ove-app',

	// Our template for the line of statistics at the bottom of the app.
	statsTemplate: _.template($('#stats-template').html()),

	// Delegated events for creating new items, and clearing completed ones.
	events: {
		'keypress #new-mission': 'createOnEnter'
	},

	// At initialization we bind to the relevant events on the `Missions`
	// collection, when items are added or changed. Kick things off by
	// loading any preexisting missions that might be saved in *localStorage*.
	initialize: function () {
		this.animateIn = 'iosSlideInRight';
		this.animateOut = 'slideOutRight';

		this.template = _.template($('script[name=ove-app]').html());

		this.$el.html(this.template());

		//this.allCheckbox = this.$('#toggle-all')[0];
		this.$input = this.$('#new-mission');
		this.$navigation = this.$('#navigation');
		this.$footer = this.$('#footer');
		this.$main = this.$('#main');
		this.$list = this.$('#mission-list');

		app.missions = new Missions();

		this.listenTo(app.missions, 'add', this.addOne);
		this.listenTo(app.missions, 'reset', this.addAll);
		this.listenTo(app.missions, 'change:completed', this.filterOne);
		this.listenTo(app.missions, 'filter', this.filterAll);
		this.listenTo(app.missions, 'all', _.debounce(this.render, 0));

		// Suppresses 'add' events with {reset: true} and prevents the app view
		// from being re-rendered for every model. Only renders when the 'reset'
		// event is triggered at the end of the fetch.
		app.missions.fetch({reset: true});

		return this;//usefull?
	},

	// Re-rendering the App just means refreshing the statistics -- the rest
	// of the app doesn't change.
	onRender: function () {

		var completed = app.missions.completed().length;
		var remaining = app.missions.remaining().length;

		if (app.missions.length) {
			this.$main.show();
			this.$navigation.show();

			this.$navigation.html(this.statsTemplate({
				completed: completed,
				remaining: remaining
			}));

			this.$('#filters li a')
				.removeClass('selected')
				.filter('[href="#/' + (app.MissionFilter || '') + '"]')
				.addClass('selected');
		} else {
			this.$main.hide();
			this.$footer.hide();
		}

		return this; //usefull?
	},

	// Add a single mission item to the list by creating a view for it, and
	// appending its element to the `<ul>`.
	addOne: function (mission) {
		var view = new app.Views.MissionView({ model: mission });
		this.$list.append(view.render().el);
	},

	// Add all items in the **Missions** collection at once.
	addAll: function () {
		this.$list.html('');
		app.missions.each(this.addOne, this);
	},

	filterOne: function (mission) {
		mission.trigger('visible');
	},

	filterAll: function () {
		app.missions.each(this.filterOne, this);
	},

	// Generate the attributes for a new Mission item.
	newAttributes: function () {
		return {
			title: this.$input.val().trim(),
			order: app.missions.nextOrder(),
			completed: false
		};
	},

	// If you hit return in the main input field, create new **Mission** model,
	// persisting it to *localStorage*.
	createOnEnter: function (e) {
		if (e.which === ENTER_KEY && this.$input.val().trim()) {
			app.missions.create(this.newAttributes());
			this.$input.val('');
		}
	}

});