// Filename: views/Home.BannerView.js

// Home Banner View
// ---------------

define([
  'cat',
  'ev',
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'views/Photo.SingleView',
  'jquery.imagesloaded'

], function(cat, ev, $, _, Backbone, Marionette, PhotoSingleView){

  return Marionette.ItemView.extend({

    // template: _.template( featuredRowTpl ),

    initialize: function(options) {

      var self = this;

      this.options = options;
      this.template = options.template;

      cat.Location.locationData = this.locationData;

      ev.vent.on('scroll', this.parallax, this);
      ev.vent.on('photo:show', this.showPhoto, this);
      ev.vent.on('photo:remove', this.removePhoto, this);
      // ev.vent.on('resized', this.resizeBanner, this);

      this.bannerHeight = (!cat.Options.phone) ? $(window).width() * 0.375 : 320;

      _.bindAll(this,'plotMap','setMap','resizeBanner','reinit','showNav','hideNav');
    },

    events: {
      'click #change_location_btn': 'showLocationModal',
      'click .close_btn': 'closeLocationModal',
      'submit #zip_form': 'changeLocation',
      'click .map_pin': 'chooseEventPin',
      'click .slider_nav_right' : 'nextPage',
      'click .slider_nav_left' : 'prevPage'
    },

    nextPage: function (e) {
      e.preventDefault();
      this.stopAutoplay();
      this.heroSwiper.swipeNext();
    },

    prevPage: function (e) {
      e.preventDefault();
      this.stopAutoplay();
      this.heroSwiper.swipePrev();
    },

    stopAutoplay: function(){
      this.heroSwiper.stopAutoplay();
    },

    reinit: function(){
      if (!this.heroSwiper) return;
      this.heroSwiper.reInit();
    },

    onRender: function() {
      var self = this;
      // this.retrieveLocation();

      _.defer(function(){

        if (self.heroSwiper) self.heroSwiper.destroy();

        self.heroSwiper = self.$('.swiper-container').swiper({
          mode:'horizontal',
          // calculateHeight: true,
          resizeReInit: true,
          //loop: true,
          autoplay: '5500',
          onInit: function(swiper){
            $('#banner').addClass('loaded');

            self.setMap();
            self.plotMap();
            self.resizeBanner(swiper);

            _.delay(function(){ self.resizeBanner(swiper); },500);
          },
          onSlideChangeStart: function(swiper){
            self.resizeBanner(swiper);
          },
          onSlideChangeEnd: function(swiper){
            // self.resizeBanner();
          }

        });

        self.$('.swiper-container').imagesLoaded( function() {
          self.reinit();
        });

        // $('#banner').mouseenter(function(ev){
        //  self.showNav();
        // });

        // $('#banner').mouseleave(function(ev){
        //  self.hideNav();
        // });

      });
    },

    showNav: function(){
      this.$('.slider_nav').stop().dequeue().transition({
        opacity: 100
      }, 400);
    },

    hideNav: function(){
      this.$('.slider_nav').stop().dequeue().transition({
        opacity: 0
      }, 400);
    },


    onClose: function(){
      ev.vent.off('scroll', this.parallax, this);
      ev.vent.off('resized', this.resizeBanner, this);
    },


    parallax: function(top){
      if (top > 400) {
        this.stopAutoplay();
      }
      if(!cat.Options.mobile && cat.Options.screenType !== 'desktop-small'){
        // Parallax Scrolling
        $('.parallax').css('transform', 'translateY(' + (top / 1.5) + 'px)');
      }
    },


    chooseEventPin: function(vent){
      vent.preventDefault();

      this.heroSwiper.stopAutoplay();

      var targetSlide = $(vent.currentTarget).attr('data-targetslide');
      var target = $(vent.currentTarget).attr('data-target');

      if ($(vent.currentTarget).hasClass('map_pin')) {
        $(vent.currentTarget).addClass('active').siblings().removeClass('active');
      }

      this.innerBannerScroll(target, targetSlide);
    },

    resizeBanner: function(swiper){
      var self = this;
      var offset = 60;
      if (cat.Options.tablet) offset = 40;
      var activeEvent = '#' + $('#event_banner .inner_slide.active').attr('id');
      this.innerBannerScroll('#event_banner', activeEvent);

      var active = swiper.activeSlide();
      // var height = $('> div',active).height();
      // $(active).height(height);
      this.$('.swiper-wrapper').height(this.bannerHeight);
      $(active).height(this.bannerHeight); // fix height to 600/1600 ratio

      $('#banner').stop().dequeue().transition({
        height: this.bannerHeight + 'px'
      }, 400, 'easeOutExpo');

      self.$('.slider_nav').stop().dequeue().transition({
        top: (this.bannerHeight/2)-offset + 'px'
      }, 400, 'easeOutExpo');

      this.$('.slider_nav').removeClass('inactive');

      if (swiper.activeIndex+1 === swiper.slides.length) {
        this.$('.slider_nav_right').addClass('inactive');
      }

      if (swiper.activeIndex+1 === 1) {
        this.$('.slider_nav_left').addClass('inactive');
      }
    },

    innerBannerScroll: function(target, targetSlide){
      var $target = $(target);
      var $nextItem = $(targetSlide);
      // var nextItemHeight = $nextItem.outerHeight();
      var nextItemPos = $(targetSlide).position();
      // var totalItems = $('.inner_slide', $target).size();
      //var offset = $('#header').height();

      if (nextItemPos === undefined || $target === undefined) return;

      $nextItem.addClass('active').siblings().removeClass('active');

      $nextItem.closest('.swiper-wrapper, .swiper-slide').height(this.bannerHeight);
      $nextItem.height(this.bannerHeight);

      $('#banner, ' + target).stop().dequeue().transition({
        height: this.bannerHeight + 'px'
      }, 400, 'easeOutExpo');

      $('.inner_slider_wrapper', $target).stop().dequeue().transition({
        y: -nextItemPos.top + 'px'
      }, 400, 'easeOutExpo');
    },


    // Map / Location Data Functions

    setMap: function() {
      var activeMap = '#' + $('#event_banner .inner_slide.active').attr('id');

      $('.map_pin').each(function(){
        if ($(this).attr('data-targetslide') === activeMap) {
          $(this).addClass('active');
        }
      });
    },

    plotMap: function(){
      var self = this;

      $('.event_map').addClass('loaded');

      $('.event_map .map_pin').each(function(i){
        var lat = $(this).attr('data-latitude');
        var lng = $(this).attr('data-longitude');
        var $mapPin = $(this);
        var offsetX = parseFloat($(this).attr('data-offset-x'));
        var offsetY = parseFloat($(this).attr('data-offset-y'));

        cat.Options.latArray.push($(this).attr('data-latitude'));
        cat.Options.lngArray.push($(this).attr('data-longitude'));
        cat.Options.eventArray.push($(this).attr('id'));

        var pinTop = self.yLatToPixel(lat, $('.event_map img')) - 20;
        var pinLeft = self.xLngToPixel(lng, $('.event_map img'));

        $mapPin.css('top', pinTop + offsetY + 'px');
        $mapPin.css('left', pinLeft + offsetX + 'px');

        $mapPin.delay(200 * i).transition({
          opacity: 100,
          y: '20px'
        }, 200, 'easeInQuad');
      });
    },

    changeLocation: function(vent){
      vent.preventDefault();
      var self = this;

      var inputValue = $('#zip_input').val();
      var reg = /^[0-9]+$/;

      // validate form
      if(inputValue === '' || inputValue.length !== 5 || !reg.test(inputValue)){
        this.$('.error').css('display', 'block');
        $('#zip_input').val('');
      } else {
        this.$('.error').css('display', 'none');
        this.$('.location_text').text('Finding location...');
        this.latlng_from_zip(inputValue);
        this.$modal.removeClass('active');
        this.$modal.stop().dequeue().transition({
          opacity: 0
        }, 200, function(){
          self.$modal.css('display', 'none');
        });
       }
    },

    showLocationModal: function(vent){
      vent.preventDefault();

      this.$modal = $('#change_location');
      this.$modal.css('display', 'block').addClass('active');
      this.$modal.stop().dequeue().transition({
        opacity: 100
      }, 200);
    },

    closeLocationModal: function(vent){
      vent.preventDefault();
      var self = this;

      this.$modal.removeClass('active');
      this.$modal.stop().dequeue().transition({
        opacity: 0
      }, 200, function(){
        self.$modal.css('display', 'none');
      });
    },

    yLatToPixel: function( lat, elem ){
      var containerHeight = $(elem).height();
      /*
      Formula
      (givenLat*heightOfContainerElement)/180
      where 360 is the total longitude in degrees
      Height is calculated from the bottom
      */

      // lat += 90;
      var calculatedHeight = (((parseInt(lat,10) - 25 ) * containerHeight) / 25);
      return $(elem).height() - calculatedHeight;
    },

    xLngToPixel: function( lng, elem ){
      //Formula
      /*
      (givenLng*widthOfContainerElement)/360
      where 360 is the total longitude in degrees
      */
      var containerWidth = ($(elem).width());
      var offset = ( (parseInt(lng,10) + 65) * -containerWidth) / 60;
      //lng += 180;
      return $(elem).width() - offset;
    },

    retrieveLocation: function() {
      var self = this;
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position) {
          self.zip_from_latlng(position.coords.latitude,position.coords.longitude);
        });
      }
    },

    // http://api.geonames.org/findNearbyPostalCodesJSON?postalcode=30080&country=US&radius=1&username=catalyst

    zip_from_latlng: function(latitude,longitude) {
      // Setup the Script using Geonames.org's WebService
      var newscript = document.createElement("script");
      newscript.src = "http://ws.geonames.org/findNearbyPostalCodesJSON?lat=" + latitude + "&lng=" + longitude + "&callback=cat.Location.locationData&username=catalyst";
      // Run the Script
      document.getElementsByTagName("head")[0].appendChild(newscript);
    },

    latlng_from_zip: function(zip) {
      // Setup the Script using Geonames.org's WebService
      var newscript = document.createElement("script");
      newscript.src = "http://ws.geonames.org/findNearbyPostalCodesJSON?postalcode=" + zip + "&country=US&radius=1&callback=cat.Location.locationData&username=catalyst";
      // Run the Script
      document.getElementsByTagName("head")[0].appendChild(newscript);
    },

    getDistanceFromLatLngInKm: function(lat1,lng1,lat2,lng2) {
      var R = 6371; // Radius of the earth in km
      var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
      var dLng = this.deg2rad(lng2-lng1);
      var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLng/2) * Math.sin(dLng/2)
        ;
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c; // Distance in km
      return d;
    },

    deg2rad: function(deg) {
      return deg * (Math.PI/180);
    },

    chooseClosestEvent: function(){
      var closestDist = Number.POSITIVE_INFINITY;
      var closestEvent = '';
      var currentURL = window.location.pathname;
      var slugs = currentURL.replace('http:// https://', '').split('/');

      for(var i = cat.Options.eventArray.length; i >= 0; i--){
        var userDist = this.getDistanceFromLatLngInKm(cat.Options.userLat, cat.Options.userLng, cat.Options.latArray[i], cat.Options.lngArray[i]);
        if(closestDist > userDist){
          closestDist = userDist;
          closestEvent = cat.Options.eventArray[i];
        }
      }

      if (slugs[1] === '' && $('#map').hasClass('active')) {
        $('#' + closestEvent).trigger('click');
      }
    },


    locationData: function(json) {
      // Now we have the data!  If you want to just assume it's the 'closest' zipcode, we have that below:
      if (json.postalCodes !== undefined){
        var locationData = {};
        locationData.zip = json.postalCodes[0].postalCode;
        locationData.stateShort = json.postalCodes[0].adminCode1;
        locationData.state = json.postalCodes[0].adminName1;
        locationData.city = json.postalCodes[0].placeName;
        locationData.lat = json.postalCodes[0].lat;
        locationData.lng = json.postalCodes[0].lng;

        cat.Options.userLat = locationData.lat;
        cat.Options.userLng = locationData.lng;

        $('#change_location_btn .location_text').text(locationData.city + ', ' + locationData.state);

        $('#zip_input').val(locationData.zip);

        // chooseClosestEvent(); // removed while CAT Atl is featured
      } else {
        $('#change_location_btn .location_text').text('Location not found');
      }

    },

    showPhoto: function(model){
      this.stopAutoplay();
      if (this.singlePhoto) this.prevPhoto = this.singlePhoto;

      this.singlePhoto = new PhotoSingleView({ model: model });
      $('#banner').append( this.singlePhoto.render().el );
    },

    removePhoto: function(){
      if (this.prevPhoto) {
        this.prevPhoto.close();
      }
    }

  });

});