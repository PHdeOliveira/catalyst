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
	'collections/Photos',
	'views/Events.BannerView',
	'views/Social.View',
	'views/Photo.RowView',
	'text!templates/events.html'

], function(cat, $, _, Backbone, Marionette, ev, Photos, EventsBannerView, SocialView, PhotoRowView, eventsTpl){

	return Marionette.Layout.extend({

		template: _.template( eventsTpl ),

		regions: {
			banner: '#banner',
			photo_feed: '#photo_feed',
			social: '#social'
		},

		events: {
			// 'click #podcastSearch': 'podcastSearch',
			// 'click .related_entry.Podcast a': 'showPodcast'
		},

		initialize: function() {

			var self = this;

			_.bindAll(this,'renderPhotoRow','showSocial'); //showPodcast

		},

		onRender: function(){
			var self = this;

			this.$el.addClass('active');
			this.$('#banner').css('min-height','800px');

			this.showEvents();

			_.delay(this.showSocial,2000);

			if (!cat.Options.phone) {
			  cat.Collections.photos = new Photos();
			  cat.Collections.photos.fetch({ success: this.renderPhotoRow });
			}
		},

		showEvents: function(){
			var self = this;

			require(['text!../../../backbone/events-listing'],
				function( eventListingTpl ) {
					self.banner.show( new EventsBannerView({ template: _.template(eventListingTpl) }) );
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

		renderPhotoRow: function( photo ) {
			this.photo_feed.show( new PhotoRowView({ collection: photo }) );
			$('#photo_feed').addClass('loaded');
		}

		// podcastSearch: function ( vent ) {
		// 	vent.preventDefault();

		// 	var scrollTo = $('#content_filter').offset().top - 60;

		// 	$('html, body').stop().dequeue().animate({
		// 		scrollTop: scrollTo
		// 	}, 500);

		// 	this.$featured.hide();
		// 	var searchModel = cat.Models.Filter;
		// 	searchModel.mediatypes.set({ id: 5, title: 'podcast', selected: true },{silent: true});

		// 	cat.Filter.mediaList = ['podcast'];

		// 	if (!cat.Views.RowViewPodcast) {
		// 		cat.Views.RowViewPodcast = new EntryPagedRowView({
		// 			collection: cat.Collections.entriesByPodcast,
		// 			rowtype: 'podcast',
		// 			filter: searchModel,
		// 			orderField: 'entry_date',
		// 			orderTitle: 'Catalyst Podcast',
		// 			orderDir: 'asc'
		// 		});
		// 	}

		// }

	});

});