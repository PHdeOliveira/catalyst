// Filename: models/Post.js

var App = App || {};

define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var Filter = Backbone.Model.extend({ 
	  
	  initialize: function(){
      //console.log('Filters initialized');
    },
    
	  parse: function(response) {
			//total_items = response.total;
			//response.data.id = response.data.ID;
			console.log(response);
			return response;
		},
		
		url: '/api/filters.json'
	  
  });
  
  App.Models.Filter = Filter;
  
  return Filter;
});
