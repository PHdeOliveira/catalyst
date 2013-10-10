// Filename: models/Tweet.js

var App = App || {};

define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var Tweet = Backbone.Model.extend({
/*
		parse: function (response) {
			var entry = response.data;
			return entry;
		}
*/
  });
  
  return Tweet;
});
