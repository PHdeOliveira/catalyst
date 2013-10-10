// Filename: collections/Posts.js

define([
	'cat',
	'jquery',
	'underscore',
	'backbone',
	'backbone.paginator',
	'models/Entry'
], function(cat, $, _, Backbone, Paginator, Entry){

	var PagedEntries = Paginator.clientPager.extend({

		model: Entry,

		initialize: function(){

			if(cat.Options.screenType != 'phone' && cat.Options.screenType != 'desktop-small'){
				cat.Carousel.slideSize = 250;
				cat.Carousel.slidePerRowCount = Math.floor((cat.Options.screenSize - 100) / cat.Carousel.slideSize);
			} else {
				cat.Carousel.slideSize = 240;
				cat.Carousel.slidePerRowCount = Math.floor(cat.Options.screenSize / cat.Carousel.slideSize);
			}

			cat.Carousel.slideItemSize = cat.Carousel.slideSize * cat.Carousel.slidePerRowCount;

/*
			console.log('slidesize: ' + cat.Carousel.slideSize);
			console.log('screensize: ' + cat.Options.screenSize);
			console.log('slideperrow: ' + cat.Carousel.slidePerRowCount);

*/
			this.perPage = cat.Carousel.slidePerRowCount;
			//this.sortOrder = this.sortColumn;

			//console.log('Entries initialized');
			// this.sortVar = 'entry_date';
		},

		paginator_core: {
			// the type of the request (GET by default)
			type: 'POST',

			// the type of reply (jsonp by default)
			dataType: 'json',

			// the URL (or base URL) for the service
			url: '/api/backstage.json'

		},

		paginator_ui: {
			// the lowest page index your API allows to be accessed
			firstPage: 1,

			// which page should the paginator start from
			// (also, the actual page the paginator is on)
			currentPage: 1,

			// how many items per page should be shown
			perPage: cat.Carousel.slidePerRowCount,

			// a default number of total pages to query in case the API or
			// service you are using does not support providing the total
			// number of pages for us.
			// 10 as a default in case your service doesn't return the total
			totalPages: 10,

			pagesInRange: 2,

			search: cat.Filter.keywords,
			tags: cat.Filter.tagList,
			categories: cat.Filter.categoryList,
			authors: cat.Filter.authorList,
			media: cat.Filter.mediaList,
			viewtime: cat.Filter.viewtimeList,
			essentials: cat.Filter.essentialList
		},

		server_api: {

			// the query field in the request
			'search': function() { return cat.Filter.keywords; },
			'tags': function() { return cat.Filter.tagList; },
			'categories': function() { return cat.Filter.categoryList; },
			'authors': function() { return cat.Filter.authorList; },
			'media': function() { return cat.Filter.mediaList; },
			'viewtime': function() { return cat.Filter.viewtimeList; },
			'essentials': function() { return cat.Filter.essentialList; },

			// number of items to return per request/page
			// should we move limit logic out of paginator and into here?
			'limit': function() { return this.perPage * 1; },

			// how many results the request should skip ahead to
			// customize as needed. For the Netflix API, skipping ahead based on
			// page * number of results per page was necessary.
			'offset': function() { return this.models.length; },

			'order': function() {
				if(this.sortColumn === undefined)
					return 'date';
				return this.sortColumn;
			}
/*
			'orderdir': function() {
				if(this.sortDirection === undefined)
					return 'asc';
				return this.sortDirection;
			},
*/
		},

		parse: function (response) {
			// Be sure to change this based on how your results
			// are structured (e.g d.results is Netflix specific)
			var entries = response.data;
			//Normally this.totalPages would equal response.d.__count
			//but as this particular NetFlix request only returns a
			//total count of items for the search, we divide.
			this.totalPages = Math.ceil(response.total / this.perPage);

			this.totalRecords = response.total;
			return entries;
		}

	});

	return PagedEntries;

});