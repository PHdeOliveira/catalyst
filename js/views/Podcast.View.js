// Filename: views/AppView.js

// Main App View
// ------------------

define([
  'cat',
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'ev',
  'models/Filter',
  'views/Entry.PagedRowView',
  'views/Social.View',
  'views/Search.FilterView',
  'collections/Pager',
  'views/Podcast.BannerView',
  'text!templates/podcast.html'

], function(cat, $, _, Backbone, Marionette, ev, Filter, EntryPagedRowView, SocialView, SearchFilterView, Pager, PodcastBannerView, podcastTpl){

  return Marionette.Layout.extend({

    template: _.template( podcastTpl ),

    regions: {
      banner: '#banner',
      content_filter: '#content_filter',
      podcast_entries: '#podcast_entries',
      social: '#social'
    },

    events: {
      'click #podcastSearch': 'podcastSearch'
      // 'click .related_entry.Podcast a': 'showPodcast'
    },

    initialize: function() {

      var self = this;

      // Need to set this so that the single page view knows which route to return to
      cat.Options.podcast = true;

      _.bindAll(this,'showSocial','renderFilterView'); //showPodcast

      cat.Collections.entriesByPodcast = new Pager();

    },

    onRender: function(){
      var self = this;

      this.$el.addClass('active');
      // this.$('#banner').css('min-height','620px');

      this.showPodcast();

      _.delay(this.showSocial,2000);

      cat.Models.filterModel = new Filter();
      cat.Models.filterModel.fetch({ success: this.renderFilterView });

    },

    onClose: function(){
      ev.vent.off('filter');
      cat.Filter.mediaList = [];
      cat.Options.podcast = false;
    },

    showPodcast: function(){
      var self = this;

      require(['text!../../../backbone/podcast'],
        function( podcastTpl ) {
          self.banner.show( new PodcastBannerView({ template: _.template(podcastTpl) }) );

          var searchModel = new Filter();
          searchModel.get('mediatypes').set({ id: 5, title: 'podcast', selected: true },{silent: true});

          cat.Filter.mediaList = ['podcast'];

          self.podcast_entries.show( new EntryPagedRowView({
            collection: cat.Collections.entriesByPodcast,
            model: new Backbone.Model({
              orderField: 'entry_date',
              orderTitle: 'Recent Episodes',
              orderDir: 'desc'
            }),
            className: 'Podcast entry-row',
            filter: searchModel
          }));

        }
      );
    },

    showSocial: function(){
      var self = this;

      require(['text!../../../backbone/social'],
        function( socialTpl ) {
          self.social.show( new SocialView({ template: _.template(socialTpl) }) );
        }
      );
    },

    // renderPhotoRow: function( photo ) {
    //  this.photo_feed.show( new PhotoRowView({ collection: photo }) );
    //  $('#photo_feed').addClass('loaded');
    // }

    podcastSearch: function ( vent ) {
      vent.preventDefault();

      $('#content_filter').addClass('loaded podcast').removeClass('hidden');

      var scrollTo = $('#content_filter').offset().top - 60;

      $('html, body').stop().dequeue().animate({
        scrollTop: scrollTo
      }, 500);

    },

    renderFilterView: function() {
      var self = this;
      require(['text!../../../backbone/search-filter'],
        function( searchFilterTpl ) {
          self.content_filter.show(
            new SearchFilterView({
              model: cat.Models.filterModel,
              template: _.template( searchFilterTpl )
            })
          );
        }
      );
    }

  });

});