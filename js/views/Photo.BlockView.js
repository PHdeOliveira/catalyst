// Filename: views/Photo.BlockView.js

// Photo Block View
// ---------------

define([
	'ev',
	'cat',
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'models/Photo',
	'views/Photo.SingleView',
	'text!templates/photo-block.html',
	'jquery.imagesloaded'
], function(ev, cat, $, _, Backbone, Marionette, Photo, PhotoSingleView, photoBlockTpl){

	return Marionette.ItemView.extend({

		className: 'swiper-slide',
		template: _.template( photoBlockTpl ),

		initialize: function() {

			this.$container = $('#banner');

		},

		events: {
			'click a': 'showSingle'
		},

		onRender: function() {

			var self = this;

			this.$el.imagesLoaded( function() {
			  self.$el.addClass('loaded');
			});

		},

		showSingle: function(vent) {
			vent.preventDefault();

			ev.vent.trigger('photo:show',this.model);

		}

	});

});