// Filename: collections/Twitter.js

define([
	'jquery',
	'underscore',
	'backbone',
	'models/Social'
], function($, _, Backbone, Social){

	return Backbone.Collection.extend({

		model: Social,

		initialize: function(){
			//console.log('Entries initialized');
			// this.sortVar = 'entry_date';
		},

		parse: function(response) {
			return response;
		},

		url: '/social/youtube/'

		/*
		comparator: function( model ){
			var that = this;
			return( model.get( that.sortVar ) );
		}
		*/

	});

});