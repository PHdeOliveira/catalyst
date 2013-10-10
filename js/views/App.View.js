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
	'text!templates/app.html'

], function(cat, $, _, Backbone, Marionette, ev, appTpl){

	return Marionette.Layout.extend({

		template: _.template( appTpl ),

		regions: {
			social: '#social'
		},

		events: {
			//'click #podcastSearch': 'podcastSearch',
		},

		initialize: function() {

			var self = this;

			// _.bindAll(this); //showPodcast

		},

		onRender: function(){
			var self = this;
		}



	});

});