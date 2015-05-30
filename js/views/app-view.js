/*global Backbone*/
//var app = app || {};

// The Application

app.Views.AppView = app.Extensions.View.extend({
    
    el: 'body',

    goto: function (view) {
        // cache the current view and the new view
        var previous = this.currentPage || null;
        var next = view;

        if (previous) {
            previous.transitionOut(function () {
                // only remove the old view if its not the Home view
               // if (previous.$el.hasClass('home')) {
                 //   console.log('Previous view is Home; not removing for it should persist');
                //} else {
                    // otherwise cleanup all other views since we dont want them to persist
                    previous.remove();
                //}
            });
        }

        next.render({ page: true });  // render the next view
        this.$el.append( next.$el );  // append the next view to the body (the el for this root view)
        next.transitionIn();
        this.currentPage = next;

    }
});

