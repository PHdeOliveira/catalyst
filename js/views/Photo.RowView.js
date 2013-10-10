// Filename: views/PostView.js

var Modernizr = Modernizr || {};

// Post Entry View
// ---------------

define([
  'cat',
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'models/Photo',
  'collections/Photos',
  'views/Photo.BlockView',
  'text!templates/photo-row.html',
  'swiper'

], function(cat, $, _, Backbone, Marionette, Photo, Photos, PhotoBlockView, photoRowTpl){

  return Marionette.CompositeView.extend({

    tagName: 'div',
    id: 'photoRow',
    template: _.template( photoRowTpl ),

    itemView: PhotoBlockView,
    itemViewContainer: '.swiper-wrapper',

    initialize: function() {

    },

    events: {
      'click .slider_nav_right' : 'nextPage',
      'click .slider_nav_left' : 'prevPage'
    },

    // slideRight: function(e) {
    //   this.$carousel = new this.Carousel();
     //  this.$carousel.next();
     //  return false;
    // },

    // slideLeft: function(e) {
    //   this.$carousel = new this.Carousel();
     //  this.$carousel.prev();
     //  return false;
    // },

    nextPage: function (e) {
      e.preventDefault();
      this.photoSwiper.swipeNext();
    },

    prevPage: function (e) {
      e.preventDefault();
      this.photoSwiper.swipePrev();
    },

    reinit: function(){
      if (!this.photoSwiper) return;
      this.photoSwiper.reInit();
    },

    onRender: function() {

      var self = this;
      // this.retrieveLocation();

      _.defer(function(){

        if (self.photoSwiper) self.photoSwiper.destroy();

        self.photoSwiper = self.$('.swiper-container').swiper({
          mode:'horizontal',
          calculateHeight: true,
          resizeReInit: true,
          freeMode: true,
          freeModeFluid: true,
          slidesPerView: 'auto',
          offsetPxBefore: 60,
          // autoplay: 1,
          // loop: true,
          // autoplay: '5500',
          onInit: function(swiper){
            $('#photo_feed').addClass('loaded');
            // self.resizeBanner(swiper);
          },
          onSlideChangeStart: function(swiper){
            // self.resizeBanner(swiper);
          },
          onSlideChangeEnd: function(swiper){
            // self.resizeBanner();
          }

        });

        // self.$('.swiper-container').imagesLoaded( function() {
        //   self.reinit();
        // });

      });

    }


  });

});