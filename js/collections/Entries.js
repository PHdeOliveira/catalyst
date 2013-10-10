// Filename: collections/Entries.js

define([
	'jquery',
	'underscore',
	'backbone',
	'models/Entry'
], function($, _, Backbone, Entry){

	return Backbone.Collection.extend({

		model: Entry,

		initialize: function(){

		},

		parse: function(response) {

			return response.data;
		},

		url: '/api/content.json',

		comparator: function( model ){
			var self = this;
			return( model.get( self.sortVar ) );
		}

	});

});