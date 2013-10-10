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
	'jquery.imagesloaded'

], function(cat, ev, $, _, Backbone, Marionette){

	return Marionette.ItemView.extend({

		// template: _.template( featuredRowTpl ),

		initialize: function(options) {

			var self = this;

			this.options = options;
			this.template = options.template;

			_.bindAll(this,'resizeBanner');
		},

		events: {

		},

		onRender: function() {
			var self = this;

			_.delay(function(){

				self.resizeBanner();

			},500);
		},

		resizeBanner: function(){
			var height = $('#hero_slide_podcast').height();
			var topMargin = (cat.Options.phone) ? 0 : 100;
			$('#banner').height(height); //.css('margin-top', topMargin + 'px');
		}

	});

});











