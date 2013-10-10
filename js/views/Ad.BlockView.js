// Filename: views/BlockView.js

var App = App || {};

// Post Entry View
// ---------------

define([
  'jquery',
  'underscore',
  'backbone',
  'models/Ad',
  'text!templates/ad-block.html'
], function($, _, Backbone, Ad, adBlockTpl){

  App.Views.Ad.BlockView = Backbone.View.extend({
    tagName: 'article',
    className: 'slide spot',
    template: _.template( adBlockTpl ),
    
    initialize: function() {
          
    },
    
    events: {
      'click': 'link'
    },
    
    render: function() {
          
      _.each(this.model.get('content_elements'), function(element){
        elementClass = element.url_title;
      })

      this.$el.attr('ondragstart', 'return false').html( this.template( this.model.toJSON() ));

      return this;
    },
    
    show: function(slug) {

      this.$el.append( this.render(post).el );
      
    },

    link: function() {
                
      var targetURL = this.$el.find('.spot_link').attr('href');
      
      
    },
    
  });

  return App.Views.Ad.BlockView;
});