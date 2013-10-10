// Filename: collections/Posts.js


define([
	'jquery',
	'underscore',
	'backbone',
	'models/Tweet'
], function($, _, Backbone, Tweet){

	return Backbone.Collection.extend({

		model: Tweet,

		initialize: function(){
			//console.log('Entries initialized');
			// this.sortVar = 'entry_date';
		},

		parse: function(response) {
			//total_items = response.total;
			//response.data.id = response.data.ID;
			return response.data;
		},

		url: '/api/tweets.json'

		/*
		comparator: function( model ){
			var that = this;
			return( model.get( that.sortVar ) );
		}
		*/

	});

});