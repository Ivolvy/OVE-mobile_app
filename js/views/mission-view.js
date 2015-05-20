/*global Backbone, jQuery, _, ENTER_KEY, ESC_KEY */
var app = app || {};

	// Mission Item View
	// --------------

	// The DOM element for a mission item...
	app.MissionView = Backbone.View.extend({
		//... is a list tag.
		tagName:  'li',

		// Cache the template function for a single item.
		template: _.template($('#item-template').html()),

		// The DOM events specific to an item.
		events: {
			'click .toggle': 'toggleCompleted'
		},

		// The MissionView listens for changes to its model, re-rendering. Since
		// there's a one-to-one correspondence between a **Mission** and a
		// **MissionView** in this app, we set a direct reference on the model for
		// convenience.
		initialize: function () {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
			this.listenTo(this.model, 'visible', this.toggleVisible);


		},

		// Re-render the titles of the mission item.
		render: function () {
			// Backbone LocalStorage is adding `id` attribute instantly after
			// creating a model.  This causes our MissionView to render twice. Once
			// after creating a model and once on `id` change.  We want to
			// filter out the second redundant render, which is caused by this
			// `id` change.
			if (this.model.changed.id !== undefined) {
				return;
			}

			this.$el.html(this.template(this.model.toJSON()));
			
			//add the icons' images for the mission
			this.addIcon();

			this.$el.toggleClass('completed', this.model.get('completed'));
			return this;
		},

		toggleVisible: function () {
			this.$el.toggleClass('hidden', this.isHidden());
		},

		isHidden: function () {
			return this.model.get('completed') ?
			app.MissionFilter === 'active' :
			app.MissionFilter === 'completed';
		},

		addIcon: function(){
			//select the icons' id for the actual mission
			this.$icons = this.$('#mission-icons');
			
			//if the frequency exists, display the associate image
			if(this.model.get('frequency')){
				this.$icons.append('<img src="img/mission-picto/'+this.model.get('frequency')+'"/>');
			}
			if(this.model.get('sense')){
				this.$icons.append('<img src="img/mission-picto/'+this.model.get('sense')+'"/>');
			}
			if(this.model.get('interaction')){
				this.$icons.append('<img src="img/mission-picto/'+this.model.get('interaction')+'"/>');
			}
			if(this.model.get('genre')){
				//TODO - select different color
			}
		},
		
		// Toggle the `"completed"` state of the model.
		toggleCompleted: function () {
			this.model.toggle();
		}

	});

