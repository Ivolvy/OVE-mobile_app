

app.Views.MissionExplicationView = app.Extensions.View.extend({


    id: 'mission-explication',

    statsTemplate: _.template($('#explication-nav').html()),

    events: {
        'click .begin': 'beginMission'
    },

    
    initialize: function () {
        this.animateIn = 'iosSlideInRight';
        this.animateOut = 'slideOutRight';
        
        this.template = _.template($('script[name=mission-explication]').html());

        this.$el.html(this.template());

        this.$navigation = this.$('.navigation');

        return this;
    },

    onRender: function () {

        this.$navigation.html(this.statsTemplate());

        this.loadScript();
        return this;
    },

    beginMission: function () {
      //  Backbone.history.navigate('#/missionPage', true);
    },

    loadScript: function () {
        google.maps.event.addDomListener(window, 'load', initialize);
    }
    
  

    
    
});