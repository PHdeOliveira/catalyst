// Filename: models/Post.js

var App = App || {};

define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var Single = Backbone.Model.extend({
  
	  url: '/api/entry.json',
	  
		parse: function (response) {
			var entry = response.data[0];
			return entry;
		}

  });
  
  return Single;
});
