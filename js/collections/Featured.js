// Filename: collections/Featured.js

var App = App || {};

define([
	'jquery',
	'underscore',
	'backbone',
	'backbone.paginator',
	'models/Featured'
], function($, _, Backbone, Paginator, Featured){

	var FeaturedEntries = Paginator.clientPager.extend({

		model: Featured,

		initialize: function(){
						
			// this.perPage = App.Carousel.slidePerRowCount;

		},

		paginator_core: {
			// the type of the request (GET by default)
			type: 'POST',
			
			// the type of reply (jsonp by default)
			dataType: 'json',
		
			// the URL (or base URL) for the service
			url: '/api/featured.json'
			
		},
		
		paginator_ui: {
			// the lowest page index your API allows to be accessed
			firstPage: 1,
		
			// which page should the paginator start from 
			// (also, the actual page the paginator is on)
			currentPage: 1,
			
			// how many items per page should be shown		
			perPage: 1,

			// a default number of total pages to query in case the API or 
			// service you are using does not support providing the total 
			// number of pages for us.
			// 10 as a default in case your service doesn't return the total
			totalPages: 10,
			
			pagesInRange: 10

		},

		server_api: {
		

		},

		parse: function (response) {
			// Be sure to change this based on how your results
			// are structured (e.g d.results is Netflix specific)
			var entries = response.data;
			//Normally this.totalPages would equal response.d.__count
			//but as this particular NetFlix request only returns a
			//total count of items for the search, we divide.
			this.totalPages = Math.ceil(entries.length / this.perPage);

			this.totalRecords = entries.length;
			return entries;
		}

	});

	return FeaturedEntries;

});