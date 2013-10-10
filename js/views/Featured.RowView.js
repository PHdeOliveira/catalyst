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
	'views/Featured.BlockView',
	'text!templates/featured-row.html',
	'jquery.hammer'
], function(cat, $, _, Backbone, Marionette, FeaturedBlockView, featuredRowTpl){

	return Marionette.CompositeView.extend({

		id: 'featuredRow',

		template: _.template( featuredRowTpl ),

		itemView: FeaturedBlockView,
		itemViewContainer: '.slide_item',

		initialize: function() {

			var self = this;
			var entries = this.collection;

			this.$featuredRow = this.$el.find('.slide_item');

			this.listenTo(entries, 'reset', this.addAll, this);
			this.listenTo(entries, 'add', this.addOne, this);
			this.listenTo(entries, 'updateRow', this.refreshRow, this);

			entries.fetcher();

			this.$el.html( this.template() );
			var featuredRow = $('#featured_entries').append(this.el);
		},


		events: {
			'click .slider_nav_right' : 'nextPage',
			'click .slider_nav_left' : 'prevPage'
		},

		refreshRow: function () {

			var self = this;

			// some dummy info for the initial fetch - before information is set on the collection
			var info = { startRecord: 1, totalRecords: 1, perPage: 1 };

			if (self.collection.information) info = self.collection.information;

			// this is set because the paginator limit is set to pagePer*5

/*
				self.$el.find('.textfill').textfill({
					maxFontPixels: 60
				});

				self.resizeEntries(self.options);

				// needs to be reinit each time to set Slider dimensions

				if (self.$carousel) {
					self.$carousel.init( self );
					self.$carousel.showSlideItem(self.collection.currentPage-1, false);
				}
*/
				// init the carousel for this row
				self.resizeEntries();
				self.$carousel = new self.Carousel(self);
				self.$carousel.init( self );

				self.on('next',function(){
					self.$carousel.next();
				});

				self.on('prev',function(){
					self.$carousel.prev();
				});


				$('#featured_entries').addClass('loaded');
		},

		addAll : function () {

			this.$el.empty();
			this.$el.html( this.template(this.options) );

		},

		addOne : function ( entry ) {
			var view = new FeaturedBlockView({ model: entry });
			this.$el.find('.slide_item:last').append( view.render().el );
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

		onRender: function() {


		},

		// Add a single post item to the container by creating a view for it, and
		// appending its element to the `<div>`.
		renderEntryBlock: function( entry ) {},

		show: function(slug) {

			var entry = this.collection.findWhere({url_title: slug});
			this.$el.append( this.render(entry).el );

		},

		resizeEntries: function( options ) {

			var $slideArray = this.$el.find('.slide');
			var results = [];

			this.$el.find('.slide').unwrap();

			$.map($slideArray, function(i, n){
				if(n%1 === 0){
					results.push(n);
				}
			});

			$.each(results, function(i, v){
				$slideArray.slice(v, v + 1).wrapAll('<div class="slide_item" />');
			});

			$('.slide_window', this.$el).width(cat.Options.screenSize + 'px');
			$('.slide_item', this.$el).width(cat.Options.screenSize + 'px');

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
			var currentSlideItem = context.collection.currentPage-1;

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
					currentSlideItem = context.collection.currentPage-1;

					// between the bounds
					index = Math.max(0, Math.min(index, slideItemCount-1));

					currentSlideItem = index;

					var offset = -((100/slideItemCount)*currentSlideItem);
					setContainerOffset(offset, animate);

			};

			self.next = function() {
				return self.showSlideItem(currentSlideItem + 1, true);
			};

			self.prev = function() {
				return self.showSlideItem(currentSlideItem - 1, true);
			};

			/**
			 * set the pane dimensions and scale the container
			 */

			function setPaneDimensions() {
					slideItemPercent = 100;
					container.width(cat.Options.screenSize*slideItemCount);
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
							var px = ((cat.Options.screenSize*slideItemCount) / 100) * percent;
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
						var pane_offset = -(100/slideItemCount)*currentSlideItem;
						var drag_offset = ((100/cat.Options.screenSize)*ev.gesture.deltaX) / slideItemCount;

						// slow down at the first and last pane
						if((currentSlideItem === 0 && ev.gesture.direction === Hammer.DIRECTION_RIGHT) ||
								 (currentSlideItem === slideItemCount-1 && ev.gesture.direction === Hammer.DIRECTION_LEFT)) {
							drag_offset *= 0.4;
						}

						setContainerOffset(drag_offset + pane_offset);
						break;

					case 'swipeleft':
						view.slideRight();
						ev.gesture.stopDetect();
						break;

					case 'swiperight':
						view.slideLeft();
						ev.gesture.stopDetect();
						break;

					case 'release':
						// more then 50% moved, navigate
						if(Math.abs(ev.gesture.deltaX) > cat.Options.screenSize/2) {
								if(ev.gesture.direction === 'right') {
										self.prev();
								} else {
										self.next();
								}
						}
						else {
								self.showSlideItem(currentSlideItem, true);
						}
						break;
				}
			}

			container.hammer({
				drag_lock_to_axis: true
			}).on("release dragleft dragright swipeleft swiperight", handleHammer);
		}

	});

});