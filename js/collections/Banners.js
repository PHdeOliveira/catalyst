// Filename: collections/Posts.js

var App = App || {};

define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){

	var Banner = Backbone.Model.extend();
  
  var Banners = Backbone.Collection.extend({
    
    model: Banner,
    
    initialize: function(){
      
    },
    
	  parse: function(response) {
			return response.data;
		},
		
		url: '/api/banners.json'
		
	});
	 
  return Banners;
  
});