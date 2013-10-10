// Filename: views/Entry.BlockView.js

// Entry Block View
// ---------------

define([
	'cat',
	'ev',
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'models/Entry',
	'text!templates/entry-block.html',
	'jquery.textfill',
	'jquery.imagesloaded'
], function(cat, ev, $, _, Backbone, Marionette, Entry, entryBlockTpl){

	return Marionette.ItemView.extend({

		tagName: 'article',
		className: 'swiper-slide cardflip',

		template: _.template( entryBlockTpl ),

		initialize: function(options) {
			this.options = options;
			// this.listenTo(this.model, 'change', this.render);
		},

		events: {
			'click .front': 'rollover',
			'click .back a': 'single',
			'click .back':	'single',
			'mouseenter': 'rollover',
			'mouseleave': 'rollout'
		},

		templateHelpers: {
			commentCount: function(){
				var count = parseInt(this.disqus_comments,10);
				if (!count) count = 0;
				return count;
			},
			socialCount: function(){
				var count = parseInt(this.disqus_comments,10)+parseInt(this.addthis_count,10);
				if (!count) count = 0;
				return count;
			}
		},

		onRender: function() {

			// add "read", etc class to view here

			var self = this;

			var classes = '';

			_.each(this.model.get('content_essentials'), function(essential){
				classes += essential.url_title+' ';
			});

			classes += this.model.get('content_media_type')+' ';
			classes += this.model.get('content_important')+' ';

			this.$el.addClass(classes).attr('ondragstart', 'return false');

			_.defer( function(){
				self.$('.textfill').textfill({ maxFontPixels: 60 });
				ev.vent.trigger('swiper:reinit');
			});

			// self.$el.imagesLoaded( function() {

			// });


		},

		single: function(vent) {

			if (vent) vent.preventDefault();

			if (this.model.get('content_media_type') == 'Video') {
				this.options.slug = '/watch';
			} else if (this.model.get('content_media_type') == 'Audio') {
				this.options.slug = '/listen';
			} else if (this.model.get('content_media_type') == 'Article') {
				this.options.slug = '/read';
			} else if (this.model.get('content_media_type') == 'Download') {
				this.options.slug = '/download';
			} else if (this.model.get('content_media_type') == 'Backstage') {
				this.options.slug = '/backstage';
			} else if (this.model.get('content_media_type') == 'Podcast') {
				this.options.slug = '/podcast';
			}

			cat.Models.activeEntry = this.model;
			cat.router.navigate(this.options.slug + '/' + this.model.get('url_title') + '/', { trigger: true });

		},

		rollover: function() {
			this.$el.addClass('flip');
			if (cat.Options.mobile) {
				this.$el.siblings().removeClass('flip');
			}
		},

		rollout: function() {
			this.$el.removeClass('flip');
		}

	});

});