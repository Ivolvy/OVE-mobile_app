
app.Views.MissionOpinionView = app.Extensions.View.extend({

    id: 'mission-opinion-template',

    events: {

    },

    initialize: function () {
        var that = this;

        this.animateIn = 'iosSlideInRight';
        this.animateOut = 'slideOutRight';

        this.template = _.template($('script[name=mission-opinion-template]').html());
        this.$el.html(this.template());


        // return this;
    },

    render: function () {
        // return this;
    }





});