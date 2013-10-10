// Filename: views/SingleView.js

var DISQUS = DISQUS || {};
var Modernizr = Modernizr || {};
var UstreamEmbed = UstreamEmbed || {};

// Entry Single View
// -----------------



define([
  'cat',
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'ev',
  'models/Single',
  // 'text!ee-templates/entry-single',
  // 'text!templates/entry-single-dummy.html',
  // 'text!templates/entry-single-ee',
  'collections/Banners',
  'jwplayer',
  'jwplayer.html5',
  'jquery.mobile',
  'ustream'
], function(cat, $, _, Backbone, Marionette, ev, Single, Banners){

  return Marionette.ItemView.extend({

    tagName: 'article',
    id: 'single_article',

    // template: _.template( entrySingleEE ),
    // dummyTemplate: _.template( entrySingleDummyTpl ),

    initialize: function(options) {
      var self = this;

      this.options = options;
      this.template = options.template;

      _.bindAll(this, 'loadHeaderImg', 'loadJWPlayer', 'initAddThis', 'initDisqus', 'initTracking', 'show');

      var viewReady = _.after(2, this.showSingle);

      require(['text!../../../backbone/entry-single'], function( entrySingleTpl ){
        self.template = _.template( entrySingleTpl );
        viewReady();
      });

      // cat.Collections.bannerCollection = new Banners();
      // cat.Collections.bannerCollection.fetch({ success: this.loadHeaderImg });

      // cat.Options.singleDirect = true;

      this.model = _.clone(cat.Models.activeEntry) || new Single();

      if (!this.options.slug) {
        alert('slug is required for single entry view');
        return;
      }

      if (this.model.isNew()) {
        this.model.fetch({
          data: {
            entry_slug: this.options.slug
          },
          type: 'POST',
          success:function(model, response, options){
            viewReady();
          }
        });
      } else {
        viewReady();
      }

      if (cat.Options.singleDirect !== true) {

        // handle the back and forward buttons
        $(window).bind('popstate', function(vent) {
          // if the event has our history data on it, load the page fragment with AJAX
          $('.close_article_btn').trigger('click');
        });
      }

    },

    events: {
      'click .close_article_btn': 'slideDown'
    },

    onRender: function( model ) {
      var self = this,
          classes = '',
          speed;

      _.each(this.model.get('content_essentials'), function(essential){
        classes += essential.url_title+' ';
      });

      classes += this.model.get('content_media_type')+' ';

      // classes += this.model.get('content_important')+' ';
      // if (this.model.get('content_important') == '') {
      //  classes = 'hidden';
      // }

      this.$el.addClass(classes);

      // Single Page Video Wrapping

      if(!$('#main_content iframe').closest('div').hasClass('video_container') && !$('#main_content iframe').closest('div').hasClass('wufoo')){
        $('#main_content iframe').wrap('<div class="video_container" />');
      }

      ev.vent.trigger('ustream:pause');

      if (cat.app.main.currentView === undefined) speed = 0.1;
      _.defer( function() { self.show( speed ); });

    },

    onClose: function(){
      ev.vent.off('single:show');
      cat.Options.CurrentSlug = '';
      cat.app.single.currentView = null;
      delete cat.app.single.currentView;


    },


    loadHeaderImg: function() {

      var randNum = Math.floor(Math.random()*11);

      var imgsrc = window.location.protocol+'//'+window.location.hostname + '/fw/php/timthumb.php?src=' + cat.Collections.bannerCollection.at(randNum).get("photos_file")[0].url_full + '&w=1600&h=600&q=85';

      var $headerImg = this.$el.find('#header_img img');

      $headerImg.attr("src", imgsrc);
    },

    showSingle: function(){
      ev.vent.trigger('single:show');
    },

    show: function( speed ) {

      var self = this;

      var screenHeight = $(window).height() - 100;
      this.windowOffset = $(window).scrollTop();
      speed = speed || 400;

      if(cat.Options.phone) {
        screenHeight = $(window).height() - 60;
        speed = 0;
      }

      if(!$('#main_content iframe', this.$el).closest('div').hasClass('video_container')){
        $('#main_content iframe', this.$el).wrap('<div class="video_container" />');
      }

      this.$el.transition({
        y: -screenHeight + 'px'
      }, speed, 'easeOutExpo', function(){

        self.activeStyle = this.attr('style');
        this.addClass('active').attr('style', '');
        $('#main > div').removeClass('active');
        $(window).scrollTop(0);

        _.defer(function(){
          self.loadJWPlayer();
          self.initDisqus();
          self.initAddThis();
          self.initTracking();
        });
      });

    },

    loadJWPlayer: function() {

      var s3media = this.model.get('content_media_s3');
      var zen_ee = this.model.get('content_video_zenee');
      var vidWidth = 770;
      var vidHeight = 435;

      if (cat.Options.screenType == 'desktop-large') {
        // vidWidth = 620;
        // vidHeight = 350;
      } else if (cat.Options.screenType == 'desktop-medium') {
        vidWidth = 620;
        vidHeight = 350;
      } else if (cat.Options.screenType == 'desktop-medium-small' || cat.Options.screenType == 'tablet') {
        vidWidth = 476;
        vidHeight = 269;
      } else if (cat.Options.screenType == 'desktop-small' || cat.Options.screenType == 'phone') {
        vidWidth = 280;
        vidHeight = 157;
      }

      window.jwplayer.key = 'o0s/BzHiXLG6mpYDcH4QIcrEgi+5DpXewQbCEOsfnvs=';

      if (!_.isEmpty(zen_ee)) {
        window.jwplayer("video_zenee").setup({
          playlist: [{
            image: zen_ee.thumb_url,
            sources: [
              { file: zen_ee.mp4_url, label: "MP4" },
              { file: zen_ee.webm_url, label: "WebM" }
            ]
          }],
          skin: "/fw/js/vendor/jwplayer/six.xml",
          width: vidWidth,
          height: vidHeight
        });
      } else if (s3media.search(/flv|mp4|mov/gi) > 0) {
        window.jwplayer("video_s3").setup({
          file: s3media,
          image: "/fw/img/video_poster.png",
          skin: "/fw/js/vendor/jwplayer/six.xml",
          width: vidWidth,
          height: vidHeight
        });
      } else if (s3media.search(/mp3/gi) > 0) {
        window.jwplayer("audio_s3").setup({
          file: s3media,
          skin: "/fw/js/vendor/jwplayer/six.xml",
          height: 40,
          width: vidWidth
        });
      }
    },

    initDisqus: function() {

      var disqus_identifier = this.model.get('entry_id');
      var disqus_url = window.location.protocol + '//' + window.location.host + this.options.slug + '/' + this.model.get('url_title') + '/';
      var disqus_title = this.model.get('title');

      if ((window.DISQUS || {}).reset) {
        if (!cat.Options.mobile) {
          // disabled on phone / tablet until DISQUS can fix this memory leak
          // https://groups.google.com/forum/#!topic/disqus-dev/PFlJ68J--44
          window.DISQUS.reset({
            reload: true,
            config: function () {
              this.page.identifier = disqus_identifier;
              this.page.url = disqus_url;
              this.page.title = disqus_title;
            }
          });
        }
      } else {
        (function() {
          var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
          dsq.src = '//catalystconference.disqus.com/embed.js';
          (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
        })();
      }
    },


    initAddThis: function() {
      var addthis_config =
      {
         data_track_clickback: true,
         data_ga_property: 'UA-2886311-11',
         data_ga_social : true
      };

      var addthis_share =
      {
         url: window.location.protocol+'//'+window.location.host + this.options.slug + '/' + this.model.get('url_title') + '/',
         title: this.model.get('title'),
         description: this.model.get('content_teaser')
      };

      if (window.addthis){
        window.addthis.toolbox("#addthis_toolbox", addthis_config, addthis_share);
        window.addthis.toolbox("#addthis_toolbox2", addthis_config, addthis_share);
      } else {
        (function() {
          var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
          dsq.src = '//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-516ffe5d5de4c088';
          (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
        })();
      }
    },

    initTracking: function(){
      // Updates Disqus counts via PHP library
      // Also handles updating the general hit count via exp_entry_tracking

      $.ajax({
        type: 'POST',
        url: '/api/trending_count.json',
        data: {
          entry_id : this.model.get('entry_id'),
          url      : window.location.href
        },
        success: function (response) {

        },
        dataType: 'json'
      });
    },

    slideDown: function(vent){
      if (vent) vent.preventDefault();
      var self = this,
          speed = 400;

      if ((window.DISQUS || {}).reset) {
        window.DISQUS.reset();
      }

      if (cat.Options.mobile) speed = 0;

      // Reset the url
      var trigger = (cat.app.main.currentView) ? false : true;
      var backstage = (cat.Options.backstage) ? 'backstage/' : '';
      var podcast = (cat.Options.podcast) ? 'podcast/' : '';
      cat.router.navigate('/'+backstage+podcast, { replace: true, trigger: trigger });

      // Animate the window
      $(window).scrollTop(this.windowOffset);
      $('#main > div').addClass('active');
      this.$el.removeClass('active').attr('style', this.activeStyle);


      this.$el.transition({
          y: '300px'
        }, speed, 'easeInOutExpo', function(){
          // $('#main > div').attr('style', '');
          self.close();
      });
    }

  });

});