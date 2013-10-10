// Filename: views/PostView.js

var Modernizr = Modernizr || {};
var Hammer = Hammer || {};

// Post Entry View
// ---------------

define([
	'cat',
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'ev',
	'models/Entry',
	'models/Filter',
	'views/Entry.BlockView',
	'text!templates/entry-row.html',
	'jquery.hammer'
], function(cat, $, _, Backbone, Marionette, ev, Entry, Filter, EntryBlockView, entryRowTpl){

	return Marionette.CompositeView.extend({

		id: 'entryRow',

		template: _.template( entryRowTpl ),

		itemView: EntryBlockView,
		itemViewContainer: '.slide_item',

		initialize: function() {

			var self = this;
			this.el.className = this.options.orderTitle;
			var entries = this.collection;

			var filter = '';
			var rowtype = '';

			if (this.options.filter) filter = this.options.filter;
			if (this.options.rowtype) rowtype = this.options.rowtype;

			this.$entryRow = this.$el.find('.slide_item');

			this.listenTo(entries, 'reset', this.addAll, this);
			this.listenTo(entries, 'add', this.addOne, this);
			this.listenTo(entries, 'updateRow', this.refreshRow, this);
			//this.listenTo(this.collection, 'change', this.render, this);
			//vent.on("filter", this.filter( searchModel ) );

			ev.vent.on("filter", function( searchModel ) {

				// this should first filter the existing collection (per row)
				// then it should know how many are visible (per row / per order)
				// if the filtered collection count is < our limit (30) fetch more per row to fill in
				// fetch per row sends offset equal to number visible

				// 1) Filter has to be exact match client side / server side
				// 2) Need to prevent additional fetches until the first is complete

				if (filter) this.filter( searchModel );

			}, this);

			// initial data set

			// entries.pager({ reset: false, success: function(){ entries.pager({ remove: false, silent: true }); } });

			entries.setSort(this.options.orderField, this.options.orderDir);
			entries.fetcher();

			this.$el.html( this.template(this.options) );

			var entryRow = '';

			if (rowtype == 'podcast') {
				entryRow = $('#podcast_entries').append(this.el);
				$('#podcast_entries').show().removeClass('hidden');
			} else if (rowtype == 'backstage') {
				entryRow = $('#backstage_entries').append(this.el);
				$('#backstage_entries').show().removeClass('hidden');
			} else if (rowtype == 'search') {
				entryRow = $('#search_entries').append(this.el);
				$('#search_entries').show().removeClass('hidden');
			} else  {
				entryRow = $('#entries').append(this.el);
			}
		},


		events: {
			'click .slider_nav_right' : 'nextPage',
			'click .slider_nav_left' : 'prevPage'
/*
			'click a.orderUpdate': 'updateSortBy',
			'click a.serverlast': 'gotoLast',
			'click a.page': 'gotoPage',
			'click a.serverfirst': 'gotoFirst',
			'click a.serverpage': 'gotoPage',
			'click .serverhowmany a': 'changeCount'
*/
		},

		refreshRow: function () {

			var self = this;

			// some dummy info for the initial fetch - before information is set on the collection
			var info = { startRecord: 1, totalRecords: 1, perPage: 1 };

			if (self.collection.information) info = self.collection.information;

			// console.log(info.startRecord);

			// this is set because the paginator limit is set to pagePer*5
			if ( info.startRecord <= 1 || ( (info.startRecord+(info.perPage*3)) > (info.totalRecords)-(info.perPage*5) && (info.startRecord+(info.perPage*3)-1) <= (info.totalRecords)-(info.perPage*5) ) ) {

				// console.log('refresh');

				self.$el.find('.textfill').textfill({
					maxFontPixels: 60
				});

				self.resizeEntries(self.options);

				// needs to be reinit each time to set Slider dimensions

				if (self.$carousel) {
					self.$carousel.init( self );
					self.$carousel.showSlideItem(self.collection.currentPage-1, false);
				}

			}

			if (self.collection.currentPage == 1) {

				// init the carousel for this row

				self.$carousel = new self.Carousel(self);
				self.$carousel.init( self );

				self.on('next',function(){
					self.$carousel.next();
				});

				self.on('prev',function(){
					self.$carousel.prev();
				});

				$('#entries').addClass('loaded');
			}
		},

		addAll : function () {

			this.$el.empty();
			this.$el.html( this.template(this.options) );

			this.collection.each(this.addOne,this);

			this.refreshRow();
			//this.collection.setSort('entry_date','desc');

			// $('#entries').addClass('loaded');

			//var frag = document.createDocumentFragment();
/*
			this.collection.each(function(entry) {
				var view = new EntryBlockView({ model: entry });
				this.$el.find('.slide_item').append( view.render().el );
			}, this);

			return this;
*/
		},

		addOne : function ( entry ) {

			var view = new EntryBlockView({ model: entry });
			var rendered = view.render().el;
			this.$el.find('.slide_item:last').append( rendered );

/*
			if (entry.get('content_important') == 'important') {
				this.$el.find('.slide_item').append( rendered );
			}
*/

		},

		nextPage: function (e) {
			e.preventDefault();
			this.collection.nextPage();
			this.trigger('next');
		},

		prevPage: function (e) {
			e.preventDefault();
			this.collection.prevPage();
			this.trigger('prev');
		},

		filter: function ( searchModel ) {

			// hack way of telling if the filter has changed...
			cat.Options.filterChange = true;

			this.collection.setArrayFilter(searchModel);
			//this.preserveFilterField(fields);
			//this.preserveArrayFilterValue(filter);
		},

		onRender: function() {



		},


		// Add a single post item to the container by creating a view for it, and
		// appending its element to the `<div>`.
		renderEntryBlock: function( entry ) {},


		show: function(slug) {

			var entry = this.collection.findWhere({url_title: slug});
			// console.log('show post:' + slug);
			this.$el.append( this.render(entry).el );

		},

		resizeEntries: function( options ) {

			var $slideArray = this.$el.find('.slide');
			var results = [];

			this.$el.find('.slide').unwrap();

			$.map($slideArray, function(i, n){
				if(n%cat.Carousel.slidePerRowCount === 0){
					results.push(n);
				}
			});

			$.each(results, function(i, v){
				$slideArray.slice(v, v + cat.Carousel.slidePerRowCount).wrapAll('<div class="slide_item" />');
			});

			if(cat.Options.screenType != 'phone' && cat.Options.screenType != 'desktop-small'){
				$('.slide_window', this.$el).width(cat.Carousel.slideItemSize + 'px');
				$('.slide_item', this.$el).width(cat.Carousel.slideItemSize + 'px');
			} else {
				$('.slide_window', this.$el).attr('style', '');
				$('.slide_item', this.$el).width(cat.Options.screenSize + 'px');
			}

		},

		/* Hammer.js Swiping for Carousels */

		Carousel: function( context ){

			var self = this;
			var view = context;

			//var row = view.$el.find('.entry_slider');
			var container = view.$el.find('.slide_wrapper');
			var slideItemSize = 0;
			var slideItemPercent = 0;
			var slideItemCount = context.collection.information.renderedPages;
			this.currentSlideItem = context.collection.currentPage-1;

			/**
			 * initial
			 */
			self.init = function( context ) {

				// number of slide_item 'panels' on the DOM
				slideItemCount = context.collection.information.renderedPages;
				setPaneDimensions();

				// $(window).on('load resize orientationchange', function() {
				//		 setPaneDimensions();
				//		 // updateOffset();
				// })
			};

			/**
			 * show pane by index
			 * @param	 {Number}		index
			 */
			self.showSlideItem = function( index, animate ) {

					slideItemCount = context.collection.information.renderedPages;
					this.currentSlideItem = context.collection.currentPage-1;

					// between the bounds
					index = Math.max(0, Math.min(index, slideItemCount-1));

					this.currentSlideItem = index;

					var offset = -((100/slideItemCount)*this.currentSlideItem);
					setContainerOffset(offset, animate);

			};

			self.next = function() {
				return self.showSlideItem(this.currentSlideItem + 1, true);
			};

			self.prev = function() {
				return self.showSlideItem(this.currentSlideItem - 1, true);
			};

			/**
			 * set the pane dimensions and scale the container
			 */

			function setPaneDimensions() {
					slideItemPercent = Math.floor((cat.Options.screenSize / cat.Carousel.slideItemSize) * 100);
					container.width(cat.Carousel.slideItemSize*slideItemCount);
			}

			function setContainerOffset(percent, animate) {
					container.removeClass("animate");

					if(animate) {
							container.addClass("animate");
					}

					if(Modernizr.csstransforms3d) {
							container.css("transform", "translate3d("+ percent +"%,0,0) scale3d(1,1,1)");
					}
					else if(Modernizr.csstransforms) {
							container.css("transform", "translate("+ percent +"%,0)");
					}
					else {
							var px = ((cat.Carousel.slideItemSize*slideItemCount) / 100) * percent;
							container.css("left", px+"px");
					}
			}

			function handleHammer(ev) {
				// disable browser scrolling
				// ev.gesture.preventDefault();

				switch(ev.type) {
					case 'dragright':
					case 'dragleft':
						// stick to the finger
						var pane_offset = -(100/slideItemCount)*this.currentSlideItem;
						var drag_offset = ((100/cat.Carousel.slideItemSize)*ev.gesture.deltaX) / slideItemCount;

						// slow down at the first and last pane
						if((this.currentSlideItem === 0 && ev.gesture.direction === Hammer.DIRECTION_RIGHT) ||
								 (this.currentSlideItem === slideItemCount-1 && ev.gesture.direction === Hammer.DIRECTION_LEFT)) {
							drag_offset *= 0.4;

						}

						setContainerOffset(drag_offset + pane_offset);
						break;

					case 'swipeleft':
						view.nextPage( ev );
						ev.gesture.stopDetect();
						break;

					case 'swiperight':
						view.prevPage( ev );
						ev.gesture.stopDetect();
						break;

					case 'release':
						// more then 50% moved, navigate
						if(Math.abs(ev.gesture.deltaX) > cat.Carousel.slideItemSize/2) {
								if(ev.gesture.direction === 'right') {
										view.prevPage( ev );
								} else {
										view.nextPage( ev );
								}
						}
						else {
								self.showSlideItem(this.currentSlideItem, true);
						}
						break;
				}
			}


			container.hammer({
				drag_lock_to_axis: true
			}).on("release dragleft dragright swipeleft swiperight", _.bind(handleHammer,self) );

		}

	});


});