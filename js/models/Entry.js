// Filename: models/Post.js

var App = App || {};

define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var Entry = Backbone.Model.extend({
/*
		parse: function (response) {
			var entry = response.data;
			return entry;
		}
*/
  });
  
  return Entry;
});
