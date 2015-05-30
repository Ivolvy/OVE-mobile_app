

app.Views.MissionPropositionView = app.Extensions.View.extend({


    id: 'mission-proposition',

    events: {
        'click .accept': 'acceptMission'
    },
    
    initialize: function () {
        this.animateIn = 'iosSlideInRight';
        this.animateOut = 'slideOutRight';

        this.template = _.template($('script[name=mission-proposition]').html());

        this.$el.html(this.template());



        return this;
    },

    onRender: function () {


        return this;
    },

    acceptMission: function () {
        Backbone.history.navigate('#/missionExplication', true);
    }
    
    
});