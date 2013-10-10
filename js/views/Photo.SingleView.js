// Filename: views/Photo.SingleView.js

// Photo Single View
// ---------------

define([
	'cat',
	'ev',
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/photo-single.html',
	'jquery.mobile',
	'jquery.imagesloaded'
], function(cat, ev, $, _, Backbone, Marionette, photoSingleTpl){

	return Marionette.ItemView.extend({

		tagName: 'figure',
		id: 'single_photo',

		template: _.template( photoSingleTpl ),

		initialize: function() {

		},

		events: {
			'click .close_btn': 'fade'
		},

		onRender: function() {
			this.$el.css('opacity', '0');

			var screenHeight = $(window).height() - 108;
			var windowOffset = -($(window).scrollTop());

			$('html, body').stop().dequeue().animate({
				scrollTop: 0
			}, 500);

			this.$el.imagesLoaded(function(){
				var photoHeight = this.find('img').height();

				this.transition({
					opacity: 100
				}, 400);

				$('#banner').transition({
					height: (screenHeight-120) + 'px'
				}, 400, 'easeInOutExpo');

				ev.vent.trigger('photo:remove');

			});
		},

		fade: function (vent){
			vent.preventDefault();
			var self = this;

			var returnHeight = $('#banner .swiper-slide-active').height();

			$('#banner').transition({
				height: returnHeight + 'px'
			}, 400, 'easeInOutExpo');

			this.$el.transition({
				opacity: 0
			}, 400, function(){
				self.close();
			});

		}

	});

});