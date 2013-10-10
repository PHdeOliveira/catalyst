// Filename: collections/Pager.js

define([
	'cat',
	'jquery',
	'underscore',
	'backbone',
	'backbone.paginator',
	'models/Entry'
], function(cat, $, _, Backbone, Paginator, Entry){

	return Paginator.clientPager.extend({

		model: Entry,

		initialize: function(){

			this.perPage = Math.round($(window).width() / 250) - 1;
			if (this.perPage < 1) this.perPage = 1;

		},

		paginator_core: {
			// the type of the request (GET by default)
			type: 'POST',

			// the type of reply (jsonp by default)
			dataType: 'json',

			// the URL (or base URL) for the service
			url: '/api/content.json'

		},

		paginator_ui: {
			// the lowest page index your API allows to be accessed
			firstPage: 1,

			// which page should the paginator start from
			// (also, the actual page the paginator is on)
			currentPage: 1,

			// how many items per page should be shown
			perPage: this.perPage,

			// a default number of total pages to query in case the API or
			// service you are using does not support providing the total
			// number of pages for us.
			// 10 as a default in case your service doesn't return the total
			totalPages: 10,

			// The total number of pages to be shown as a pagination
			// list is calculated by (pagesInRange * 2) + 1.
			pagesInRange: 20,

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
			var entries = response.data;
			this.totalPages = Math.ceil(response.search_total / this.perPage);
			this.totalRecords = response.search_total;
			return entries;
		}

	});

});