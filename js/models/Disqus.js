// Filename: models/Post.js

var App = App || {};

define([
  'underscore',
  'backbone'
], function(_, Backbone) {

  App.Models.Disqus = Backbone.Model.extend({ });
  
  return App.Models.Disqus;
});