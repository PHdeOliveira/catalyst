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

			ev.vent.on('photo:show', this.showPhoto, this);
			ev.vent.on('photo:remove', this.removePhoto, this);

			_.bindAll(this,'resizeBanner');
		},

		events: {

		},

		onRender: function() {
			var self = this;

			_.defer(function(){

				self.resizeBanner();

			});
		},

		resizeBanner: function(){
			var height = $('#hero_slide_events').height();
			var topMargin = (cat.Options.phone) ? 0 : 100;
			$('#banner').height(height); //.css('margin-top', topMargin + 'px');
		},

		showPhoto: function(model){
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











