
// Mission Item View
// --------------

// The DOM element for a mission itemMap...
app.Views.MissionView = app.Extensions.View.extend({
	//... is a list tag.
	tagName:  'li',

	// Cache the template function for a single itemMap.
	template: _.template($('#item-template').html()),

	// The DOM events specific to an itemMap.
	events: {
		'click .item-content': 'toggleMission'
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

	// Re-render the titles of the mission itemMap.
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
		this.$el.toggleClass('actual', this.model.get('actual'));
		return this;
	},
	//set the class hidden
	toggleVisible: function () {
		//the second parameter determine whether the class should be added or removed.
		this.$el.toggleClass('hidden', this.isHidden());
	},

	isHidden: function () {

		if(this.model.get('completed') == true){
			//if this.model.get('completed') = true,
			//return false if we've clicked on active filter, so we display her.
			//return true if we've clicked on completed filter, so we hide it

			if((app.MissionFilter === 'completed') == true){
				return false;
			}
			else{
				return true;
			}
		}
		else{
			if(this.model.get('actual') == true){
				if((app.MissionFilter === 'actual') == true){
					return false;
				}
				else{
					return true;
				}
			}
			//return false if the mission is uncompleted, so we hide her
			else{
				if((app.MissionFilter === 'active') == true){
					return false;
				}
				else{
					return true;
				}
			}
		}
	},

	addIcon: function(){
		//select the icons' id for the actual mission
		this.$icons = this.$('#mission-icons');
		this.$shared = this.$('#mission-share');

		//if the frequency exists, display the associate image
		if(this.model.get('frequency')){
			this.$icons.append('<img src="img/mission-picto/f_'+this.model.get('frequency')+'.png"/>');
		}
		else{
			this.$icons.append('<img src="img/mission-picto/i_none_grey.png"/>');
		}
		if(this.model.get('sense')){
			this.$icons.append('<img src="img/mission-picto/s_'+this.model.get('sense')+'.png"/>');
		}
		else{
			this.$icons.append('<img src="img/mission-picto/i_none_grey.png"/>');
		}
		if(this.model.get('interaction')){
			this.$icons.append('<img src="img/mission-picto/i_'+this.model.get('interaction')+'.png"/>');
		}
		else{
			this.$icons.append('<img src="img/mission-picto/i_none_grey.png"/>');
		}
		if(this.model.get('genre')){
			//3 choices: game, fun, sensibility
			this.$el.toggleClass(this.model.get('genre')+'-light');
			this.$shared.toggleClass(this.model.get('genre')+'-dark');
		}
		if(this.model.get('shared') == 1) {
			this.$shared.toggleClass('hidden');
		}
	},

	// Toggle the `"completed"` state of the model.
	toggleCompleted: function () {
		this.model.toggle();
	},

	//display missionExplication and pass the id of the selected mission
	toggleMission: function () {
		var missionId = this.model.get('id');
		Backbone.history.navigate('#/missionExplication/'+missionId, true);
	}

});

