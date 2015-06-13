var index;

app.Views.MissionOpinionView = app.Extensions.View.extend({

    id: 'mission-opinion-template',

    menuTemplate: _.template($('#menu-template').html()),

    events: {
        'click .valid': 'sendOpinion',
        'click .pass': 'passOpinion',
        'click .left-menu': 'toggleMenu'        
    },

    initialize: function () {

        this.animateIn = 'iosSlideInRight';
        this.animateOut = 'slideOutRight';

        this.template = _.template($('script[name=mission-opinion-template]').html());
        this.$el.html(this.template());

        this.$page = this.$('.pageContent');
        this.$leftMenu = this.$('.left-menu');

        // return this;
    },

    onRender: function () {
        this.$page.append(this.menuTemplate());

        this.initBarSelection();               
        // return this;
    },
    
    sendOpinion: function(){
        Backbone.history.navigate('#/missionPage', true);
    },
    passOpinion: function(){
        Backbone.history.navigate('#/missionPage', true);
    },
    initBarSelection: function(){
        this.$circle = this.$('.pos');
        index = 3;

        this.$circle.click(function() {
            //hide the previous index if we don't click on it
            if($(this).attr('id') != index) {
                $("#" + index).find('img').toggleClass('visibilityNone');
                $(".label" + index).toggleClass('hidden');
            }
            //display the index on which we clicked
            $(this).find('img').toggleClass('visibilityNone');
            index = $(this).attr('id');
            $(".label"+index).toggleClass('hidden');

        });
    },

    //display or not the panel menu
    toggleMenu: function () {
        this.$page.toggleClass('sml-open');
        this.$leftMenu.toggleClass('open');
    }


});