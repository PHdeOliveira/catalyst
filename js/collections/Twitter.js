// Filename: collections/Twitter.js

define([
	'jquery',
	'underscore',
	'backbone',
	'models/Social'
], function($, _, Backbone, Social){

	return Backbone.Collection.extend({

		model: Social,

		initialize: function(options){
			this.options = options || {};
			this.options.count = this.options.count || 10;
		},

		parse: function(response) {
			return response;
		},

		url: function(){
			return '/social/twitter/'+this.options.count;
		}

		/*
		comparator: function( model ){
			var that = this;
			return( model.get( that.sortVar ) );
		}
		*/

	});

});