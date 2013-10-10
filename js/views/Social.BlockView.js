// Filename: views/Photo.BlockView.js

// Photo Block View
// ---------------

define([
  'cat',
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'text!templates/social-block.html',
  'jquery.imagesloaded'
], function(cat, $, _, Backbone, Marionette, socialBlockTpl){

  return Marionette.ItemView.extend({

    className: 'swiper-slide social-item',
    template: _.template( socialBlockTpl ),

    templateHelpers: {
      socialText: function(){
        var message = (this.text || this.message) || (this.caption || {}).text;
        return message.parseURL().parseHashtag().parseUsername();
      },
      socialType: function(){
        var type = '';
        if (this.actor_id) type = 'youtube';
        if (this.filter) type = 'instagram';
        if (this.like_info) type = 'facebook';
        if (typeof this.retweet_count !== 'undefined') type = 'twitter';
        return type;
      },
      socialImg: function(){
        var img;
        if (this.images) img = this.images.standard_resolution.url;
        if ( ((this.attachment||{}).media || [{}])[0].src )
          img = this.attachment.media[0].src;
        return img;
      }
    },

    initialize: function() {

      this.$container = $('#banner');

    },

    events: {
      // 'click a': 'showSingle'
    },

    onRender: function() {

      var self = this;

      this.$el.imagesLoaded( function() {
        self.$el.addClass('loaded');
      });

      var socialType = this.socialType();
      _.defer( function(){ self.$el.addClass(socialType); });

    },

    socialType: function(){
      var type = '';
      if (this.model.get('actor_id')) type = 'youtube';
      if (this.model.get('filter')) type = 'instagram';
      if (this.model.get('like_info')) type = 'facebook';
      if (this.model.get('retweet_count')) type = 'twitter';
      return type;
    }

  });

});









