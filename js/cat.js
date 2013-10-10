// Filename: cat.js


// Global App Object (AMD-style)
// ---------------------------

define([
	'jquery',
	'underscore',
	'backbone'

], function($, _, Backbone){

	var CAT = {
		Models: {},
		Collections: {},
		Options: {
			mobile: false,
			screenSize: '',
			screenType: '',
			currentPage: '',
      latArray: [],
      lngArray: [],
      eventArray: [],
      userLat: '',
      userLng: ''
		},
		Filter: {
			keywords: '',
			tagList: [],
			categoryList: [],
			authorList: [],
			mediaList: [],
			viewtimeList: [],
			essentialList: []
		},
		Router: {},
		Regions: {},
		Location: {},
		Events: {}
	};

	// var App = {};
	// _.extend(App,CAT);

	window.cat = CAT;

	return CAT;

});