var that;

// The initial view triggered on start (Home view)
app.Views.Home = app.Extensions.View.extend({

    className: 'home',
    template: null,

    initialize: function() {
        that = this;
        this.animateIn = 'fadeIn';
        this.animateOut = 'iosFadeLeft';

        // cache the template -- especially if your homeview may contain a collection or
        // act like a CollectionView; This prevents us from having to re-create the view
        // instance and re-fetch the collection if the apps primary purpose is focused around
        // the list view.
        this.template = _.template($('script[name=home]').html());

        return this;
    },


    //call from extensions/view.js
    onRender: function() {
        console.log('HomeView#onRender method triggered');

        // fill this view's element with html from the template
        // and render it only once (we have no collection so no need to re-render since view persists)
        if (this.$el.is(':empty')) {
            this.$el.html(this.template());
        }
            
        setTimeout(function(){
            that.passToMissionPage();
        },2000);
        
        return this;
    },
    
    passToMissionPage: function(){
        Backbone.history.navigate('#/missionPage', true);
    }

});