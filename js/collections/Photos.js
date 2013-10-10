// Filename: collections/Photos.js

define([
  'jquery',
  'underscore',
  'backbone',
  'models/Photo'
], function($, _, Backbone, Photo){

  var Photos = Backbone.Collection.extend({

    model: Photo,

    initialize: function(){

    },

	  parse: function(response) {
			return response.data;
		},

		url: '/api/photos.json'

	});

  return Photos;

});