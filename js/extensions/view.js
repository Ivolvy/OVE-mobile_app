/*global Backbone */
//var app = app || {};


app.Extensions.View = Backbone.View.extend({
    
    
    render: function(options) {

        options = options || {};

        if (options.page === true) {
            this.$el.addClass('page');
        }

        // From comment above, refactoring to use onRender() instead of override
        if (_.isFunction(this.onRender())) {
            // trigger whatever current/caller view's onRender() method
            this.onRender();
        }

        return this;
    },

    transitionIn: function (callback) {

        var view = this;

        var transitionIn = function () {

            view.$el.addClass(view.animateIn+' animated');
            view.$el.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd animationend', function () {

                view.$el.removeClass(view.animateIn+' animated');

                if (_.isFunction(callback)) {
                    callback();
                    console.log('Callback triggered on transitionend for TransitionIn method');
                }
            });
        };

        // setting the page class' css to position: fixed; obviates the need
        // for this and still allows transitions to work perfectly since pos
        // is absolute during animation
        _.delay(transitionIn, 0);
    },

    transitionOut: function (callback) {

        var view = this;

        view.$el.addClass(view.animateOut+' animated');
        view.$el.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd animationend', function () {

            view.$el.removeClass(view.animateOut + ' animated');

            if (_.isFunction(callback)) {

                callback();   // hard to track bug! He's binding to transitionend each time transitionOut called
                              // resulting in the callback being triggered callback * num of times transitionOut
                              // has executed
                console.log('Callback triggered on transitionend for TransitionOut method');
            }
        });
    }
});