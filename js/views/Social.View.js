// Filename: views/Social.View.js

// Social View
// ---------------

define([
	'cat',
	'ev',
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'views/Social.BlockView',
	'collections/Twitter',
	'collections/Instagram',
	'collections/Facebook',
	'collections/YouTube',
	'swiper'

], function(cat, ev, $, _, Backbone, Marionette, SocialBlockView, Twitter, Instagram, Facebook, YouTube){

	return Marionette.CompositeView.extend({

		// template: _.template( featuredRowTpl ),

		itemView: SocialBlockView,
		itemViewContainer: '.swiper-wrapper',

		initialize: function(options) {

			var self = this;

			_.bindAll(this,'mergeCollection','filterTweets','filterFacebook');

			this.options = options;
			this.template = options.template;

			var SocialCollection = Backbone.Collection.extend();
			this.collection = new SocialCollection();

			this.collection.comparator = function(group) {
				var twitterTime = group.get('created_at');
				if (twitterTime) {
					twitterTime = new Date(Date.parse(twitterTime.replace(/( \+)/, ' UTC$1')));
				}
				var time = parseInt(group.get('created_time'),10) || twitterTime.getTime()/1000;
			  return -1*time;
			};

			var count = (cat.Options.phone) ? 2 : 20;

			var twitterFeed = new Twitter({ count: count });
			var instagramFeed = new Instagram({ count: count });
			var facebookFeed = new Facebook({ count: count });
			// var youtubeFeed = new YouTube();

			twitterFeed.fetch({ success: this.filterTweets });
			instagramFeed.fetch({ success: this.mergeCollection });
			facebookFeed.fetch({ success: this.filterFacebook });
			// youtubeFeed.fetch({ success: this.mergeCollection });

			this.refresh = _.debounce(this.render,1000);
		},

		events: {
			'click #social_list a': 'filterList'
		},

		onRender: function() {
			var self = this;

			_.defer(function(){

			  // if (self.socialSwiper) self.socialSwiper.destroy();

			  // self.socialSwiper = self.$('.swiper-container').swiper({
			  //   mode:'vertical',
			  //   //calculateHeight: true,
			  //   //resizeReInit: true,
			  //   freeMode: true,
			  //   freeModeFluid: true,
			  //   //slidesPerView: 'auto',
			  //   //offsetPxBefore: 60,
			  //   // autoplay: 1,
			  //   // loop: true,
			  //   // autoplay: '5500',
			  //   onInit: function(swiper){
			  //     $('#social_feed').addClass('loaded');
			  //     // self.resizeBanner(swiper);
			  //   },
			  //   onSlideChangeStart: function(swiper){
			  //     // self.resizeBanner(swiper);
			  //   },
			  //   onSlideChangeEnd: function(swiper){
			  //     // self.resizeBanner();
			  //   }

			  // });

			});
		},

		mergeCollection: function(collection) {
			var models = collection.models || collection;
			models = _.first(models,10);
			this.collection.add(models);
			// this.collection.sort();
			this.refresh();
		},

		filterTweets: function(collection) {
			var filteredTweets = collection.filter(function(tweet){
				return tweet.get('in_reply_to_screen_name') === null;
			});
			this.mergeCollection(filteredTweets);
		},

		filterFacebook: function(collection) {
			var filteredFacebook = collection.filter(function(status){
				return status.get('attachment').media;
			});
			this.mergeCollection(filteredFacebook);
		},

		filterList: function(ev){
			ev.preventDefault();
			var $target = $(ev.currentTarget);
			var type = $target.data('target');
			this.$('.swiper-slide').each(function(){
				if ($( this ).hasClass(type)) {
					$( this ).show();
				} else {
					$( this ).hide();
				}
			});

		}

	});

});











