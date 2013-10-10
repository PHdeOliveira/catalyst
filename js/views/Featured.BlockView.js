// Filename: views/Featured.BlockView.js

// Post Entry View
// ---------------

define([
  'cat',
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'collections/Featured',
  'views/Entry.SingleView',
  'text!templates/featured-block.html'
], function(cat, $, _, Backbone, Marionette, Featured, EntrySingleView, featuredBlockTpl){

  return Marionette.ItemView.extend({

    tagName: 'article',
    className: 'slide',
    template: _.template( featuredBlockTpl ),

    initialize: function() {
	    // this.listenTo(this.model, 'change', this.render);
    },

    events: {
	    //'click .front': 'rollover',
      'click':  'single'
      //'mouseenter': 'rollover',
      //'mouseleave': 'rollout'
    },

    onRender: function() {
      this.$el.attr('ondragstart', 'return false');
    },

    single: function() {

      var singleEntry = new EntrySingleView({ model: this.model });
      $('#home_content').after( singleEntry.render().el );
      singleEntry.show();

    },

    rollover: function() {
      this.$el.addClass('flip');
    },

    rollout: function() {
      this.$el.removeClass('flip');
    }

  });

});