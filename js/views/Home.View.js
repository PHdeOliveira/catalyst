// Filename: views/AppView.js

// Main App View
// ------------------

define([
  'cat',
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'backbone.paginator',
  'ev',
  'models/Filter',
  'collections/Pager',
  'collections/Photos',
  'views/Home.BannerView',
  'views/Entry.PagedRowView',
  'views/Entry.SingleView',
  'views/Photo.RowView',
  'views/Search.FilterView',
  'views/Social.View',
  'text!templates/home.html',
  'scripts'

], function(cat, $, _, Backbone, Marionette, Paginator, ev, Filter, Pager, Photos, HomeBannerView, EntryPagedRowView, EntrySingleView, PhotoRowView, SearchFilterView, SocialView, homeTpl){

  return Marionette.Layout.extend({

    template: _.template( homeTpl ),
    id: 'home_content',

    regions: {
      banner: '#banner',
      photo_feed: '#photo_feed',
      content_filter: '#content_filter',
      search_entries: '#search_entries',
      favorite_entries: '#favorite_entries',
      recent_entries: '#recent_entries',
      discussed_entries: '#discussed_entries',
      connect: '#connect'
    },

    events: {
      'click #podcastSearch': 'podcastSearch',
      'click .related_entry.Podcast a': 'showPodcast'
    },

    initialize: function() {

      var self = this;

      _.bindAll(this,'renderFilterView','renderPhotoRow','loadHome','showSocial'); //showPodcast

      ev.vent.on('filter', function( searchModel ) {
        // only load it the first time - subsequent searches are handled by the RowView event
        if (self.search_entries.currentView === undefined) { // && !cat.Views.RowViewPodcast && !cat.Views.RowViewBackstage
          self.search_entries.show( new EntryPagedRowView({
            collection: cat.Collections.entriesBySearch,
            rowtype: 'search',
            filter: searchModel,
            model: new Backbone.Model({ orderField: 'entry_date', orderTitle: 'Search Results', orderDir: 'asc' })
          }));
        }
      });

      ev.vent.on('filter:remove', function(){
        if (self.search_entries.currentView) { // && !cat.Views.RowViewPodcast && !cat.Views.RowViewBackstage
          self.search_entries.close();
        }
      });

      ev.vent.on('home:load',this.loadHome,this);

      require(['text!../../../backbone/entry-single'], function( entrySingleTpl ){
        // preload single view
      });

    },

    onRender: function(){
      var self = this;

      this.$el.addClass('active');

      this.loadHome();

    },

    onClose: function(){
      ev.vent.off('filter');
      ev.vent.off('filter:remove');
      ev.vent.off('home:load');
    },


    loadHome: function(options){

      if (this.banner.currentView) return;

      this.showBanner();
      _.delay(this.showSocial,6000);

      // this.$featured = this.$('#featured_entries');
      // this.$search = this.$('#search_entries');
      // this.$podcast = this.$('#podcast_entries');
      // this.$backstage = this.$('#backstage_entries');
      // this.$filters = this.$('#content_filter');
      // this.$photos = this.$('#photo_feed');

      cat.Collections.entriesByDate = new Pager();
      cat.Collections.entriesByFavorite = new Pager();
      cat.Collections.entriesByComments = new Pager();
      cat.Collections.entriesBySearch = new Pager();

      // cat.Collections.featured = new Featured();
      if (!cat.Options.phone) {
        cat.Collections.photos = new Photos();
        cat.Collections.photos.fetch({ success: this.renderPhotoRow });
      }

      cat.Models.filterModel = new Filter();
      cat.Models.filterModel.fetch({ success: this.renderFilterView });

      // add back after getting tweet and single view working
      // quote for the time being
      // cat.Views.Featured = new FeaturedRowView({ collection: cat.Collections.featured });
      // this.listenTo( cat.Collections.favorite, 'reset', this.renderFeaturedRow, this );

      this.showRows();
    },

    showRows: function(){
      var self = this;

      _.delay(function() {
        self.favorite_entries.show( new EntryPagedRowView({
          collection: cat.Collections.entriesByFavorite,
          model: new Backbone.Model({ orderField: 'favorite', orderTitle: 'Our Favorites', orderDir: 'desc' }),
          className: 'Favorites entry-row'
        }));
      }, 1000);

      _.delay(function() {
        self.recent_entries.show( new EntryPagedRowView({
          collection: cat.Collections.entriesByDate,
          model: new Backbone.Model({ orderField: 'entry_date', orderTitle: 'Most Recent', orderDir: 'asc' }),
          className: 'Recent entry-row'
        }));
      }, 2000);

      _.delay(function() {
        self.discussed_entries.show( new EntryPagedRowView({
          collection: cat.Collections.entriesByComments,
          model: new Backbone.Model({ orderField: 'trending', orderTitle: 'Trending Recently', orderDir: 'desc', limit: 15 }),
          className: 'Discussed entry-row'
        }));
      }, 3000);
    },

    showBanner: function(){
      var self = this;

      var template = (cat.Options.phone) ? 'text!../../../backbone/home-banner-mobile' : 'text!../../../backbone/home-banner';

      require([template],
        function( homeBannerTpl ) {
          self.banner.show( new HomeBannerView({ template: _.template(homeBannerTpl) }) );
        }
      );
    },

    showSocial: function(){
      var self = this;

      require(['text!../../../backbone/social'],
        function( socialTpl ) {
          self.connect.show( new SocialView({ template: _.template(socialTpl) }) );
        }
      );
    },

    renderPhotoRow: function( photo ) {
      this.photo_feed.show( new PhotoRowView({ collection: photo }) );
      $('#photo_feed').addClass('loaded');
    },


    renderFilterView: function( filters ) {
      var self = this;
      require(['text!../../../backbone/search-filter'],
        function( searchFilterTpl ) {
          self.content_filter.show(
            new SearchFilterView({
              model: filters,
              template: _.template( searchFilterTpl )
            })
          );
          $('#content_filter').addClass('loaded');
        }
      );
    },


    // renderFeaturedRow: function( featuredOptions ) {
    //  var featured = this.collection.where(featuredOptions);
    //  var featuredRow = new FeaturedRowView({ featuredArray: featured, featuredOptions: featuredOptions });
    //  this.$featured.html( featuredRow.render().el );
    //  var filtered_entries = this.collection.filter(function(entry){
    //    var found = true;
    //    // if (this.collection.findWhere({slug: slug}) ) found = false;
    //    $('#featured_entries').addClass('loaded');
    //    return found;
    //  });
    // },


    // showPodcast: function(vent){
    //  vent.preventDefault();

    //  var slug = ev.currentTarget.attributes['data-slug'].value;
    //  cat.Options.CurrentSlug = slug;
    //  cat.Router.cat.navigate('/podcast/'+slug+'/', {trigger:false, replace:true});
    //  cat.Models.Single = new Single();

    //  this.listenTo( cat.Models.Single, 'change', this.showSingle, this );

    //  cat.Models.Single.fetch({
    //    data: {
    //      entry_slug: cat.Options.CurrentSlug
    //    },
    //    type: 'POST',
    //    success:function(model, response, options){ }

    //  });
    // },


    podcastSearch: function ( vent ) {
      vent.preventDefault();

      var scrollTo = $('#content_filter').offset().top - 60;

      $('html, body').stop().dequeue().animate({
        scrollTop: scrollTo
      }, 500);

      this.$featured.hide();
      var searchModel = cat.Models.Filter;
      searchModel.mediatypes.set({ id: 5, title: 'podcast', selected: true },{silent: true});

      cat.Filter.mediaList = ['podcast'];

      if (!cat.Views.RowViewPodcast) {
        cat.Views.RowViewPodcast = new EntryPagedRowView({
          collection: cat.Collections.entriesByPodcast,
          rowtype: 'podcast',
          filter: searchModel,
          orderField: 'entry_date',
          orderTitle: 'Catalyst Podcast',
          orderDir: 'asc'
        });
      }

    },

    updateEntryCollection: function( update ) {

      // update = search model
      // iterate through search model to create search query post vars
      // run fetch for each row
      // only run fetch if needed - filter first to get X number of results per row, then fetch if we fall short


      // this should first filter the existing collection (per row)
      // then it should know how many are visible (per row / per order)
      // if the filtered collection count is < our limit (30) fetch more per row to fill in
      // fetch per row sends offset equal to number visible

      // 1) Filter has to be exact match client side / server side
      // 2) Need to prevent additional fetches until the first is complete

      var self = this;
      var keywords = update.get('keywords');

      function mapFilterArray( collection ) {
        var selectedSet = update[collection].where({ selected: true });
        var newArray = _.map(selectedSet,function( tag ){ return tag.get('title'); });
        return newArray;
      }

      var tagList = mapFilterArray('tags');
      var categoryList = mapFilterArray('categories');
      var authorList = mapFilterArray('authors');
      var essentialList = mapFilterArray('essentials');
      var mediaList = mapFilterArray('mediatypes');
      var viewtimeList = mapFilterArray('viewtime');

      //if (this.collection.length < 100) {

      var filteredSet = cat.Collections.allEntries.filter(function(entry){

        var self = this;
        var found = false;

        // console.log(entry.get("title"));

        // search text
        if (keywords !== "") {

          found = false;

          var title = entry.get("title");
          var teaser = entry.get("content_full_text");

          if (title.search(keywords) > 0) {
            found = true;
          } else {
            found = false;
          }

          if (found === false) {
            if (teaser.search(keywords) > 0) {
              found = true;
            } else {
              found = false;
            }
          }
        }

        // cycle tags
        var tagSet = entry.get("tags");

        if (tagList.length > 0) {

          found = false;
          var tags = _.values(tagSet.tags);
          _.each(tags,function(tag){
            if (!found) { found = _.contains(tagList,tag); }
          });
        }

        // cycle categories
        if (categoryList.length > 0) {

          found = false;
          var categories = _.values(tagSet.categories);
          _.each(categories,function(category){
            if (!found) { found = _.contains(categoryList,category); }
          });
        }

        // cycle media
        if (mediaList.length > 0) {

          found = false;
          var media = entry.get("content_media_type").toLowerCase();
          found = _.contains(mediaList,media);
        }


        // cycle Essentials
        if (essentialList.length > 0) {

          found = false;
          var essentialSet = entry.get("content_essentials");
          var essentials = _.each(essentialSet, function(essential) { return essential.url_title; });
          _.each(essentials,function(essential){
            found = _.contains(essentialList,essential);
            if (found) { return found; }
          });
        }

        return found;

      });


      if (mediaList.length === 0 && tagList.length === 0 && categoryList.length === 0 && authorList.length === 0 && essentialList.length === 0 && viewtimeList.length === 0 && keywords === "") {
        //console.log(cat.Collections.cacheEntries);
        //cat.Collections.allEntries.reset(cat.Collections.cacheEntries);
      } else {
        cat.Collections.allEntries.reset(filteredSet);
      }

      if (cat.Collections.entriesByDate.length < 15) {

        cat.Collections.entriesByDate.fetch({
          //silent: true,
          remove: false,
          data: {
            order: "date",
            limit: 100,
            //offset: cat.Collections.entriesByDate.length,
            offset: 0,
            search: keywords,
            tags: tagList,
            categories: categoryList,
            viewtime: viewtimeList,
            authors: authorList,
            media: mediaList,
            essentials: essentialList
          },
          type: 'POST',
          success:function(response){
            //self.filterscatend({collection: cat.Collections.entriesByDate, order: 'date', response: response });
            self.filters({collection: cat.Collections.entriesByDate, order: 'date', response: response });
          }
        });

      }

      if (cat.Collections.entriesByTitle.length < 15) {

        cat.Collections.entriesByTitle.fetch({
          //silent: true,
          remove: false,
          data: {
            order: "title",
            limit: 100,
            //offset: cat.Collections.entriesByTitle.length,
            offset: 0,
            search: keywords,
            tags: tagList,
            viewtime: viewtimeList,
            categories: categoryList,
            authors: authorList,
            media: mediaList,
            essentials: essentialList
          },
          type: 'POST',
          success:function(response){
            //self.filterscatend({collection: cat.Collections.entriesByTitle, order: 'title', response: response });
            self.filters({collection: cat.Collections.entriesByTitle, order: 'title', response: response });
          }
        });
      }
    },


    filters: function( filterOptions ) {

      if (cat.Views.Entry.RowView[filterOptions.order]) cat.Views.Entry.RowView[filterOptions.order].remove();

      // ($.isEmptyObject(this.options.filterOptions)) ? filtered = this.collection.where(filterOptions) : filtered = this.collection.toArray();

      //if (cat.Collections.cacheEntries.length < filterOptions.collection.length) { cat.Collections.cacheEntries = filterOptions.collection; }

      var filtered = filterOptions.collection;

      // Create a new filter function that filters this.collection against the search Model

      var entryRow = new EntryPagedRowView({ collection: filtered, filterOptions: filterOptions });
      if (filterOptions.order == 'date') this.$rowByDate.html( entryRow.render().el );
      if (filterOptions.order == 'title') this.$rowByTitle.html( entryRow.render().el );

      entryRow.$el.find('.textfill').textfill({
        maxFontPixels: 60
      });

      entryRow.resizeEntries(filterOptions);
      var entryCarousel = new entryRow.Carousel(filterOptions,entryRow);
      entryCarousel.init();

      entryRow.on('next',function(){
        entryCarousel.next();
      });

      entryRow.on('prev',function(){
        entryCarousel.prev();
      });

      cat.Views.Entry.RowView[filterOptions.order] = entryRow;


      $('#entries').addClass('loaded');
    }



  });

});