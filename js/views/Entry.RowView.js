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
	'models/Entry',
	'collections/Entries',
	'views/Entry.BlockView',
	'text!templates/entry-row.html',
	'jquery.hammer'
], function(cat, $, _, Backbone, Marionette, Entry, Entries, EntryBlockView, entryRowTpl){

	return Marionette.CompositeView.extend({

		id: 'entryRow',
		template: _.template( entryRowTpl ),

		itemView: EntryBlockView,
		itemViewContainer: '.slide_item',

		initialize: function() {

			this.$entryRow = this.$el.find('.slide_item');
			//this.$carousel = new this.Carousel(this.options.filterOptions);

			// this.listenTo(this.options.filterCollection, 'add', this.renderEntryBlock, this);
		},


		events: {
			"click .slider_nav_right" : "slideRight",
			"click .slider_nav_left" : "slideLeft"
		},


		slideRight: function(e) {
			// this.$carousel = new this.Carousel(this.options.filterOptions);
			this.trigger('next');
			//this.$carousel.next();
			return false;
		},

		slideLeft: function(e) {
			// this.$carousel = new this.Carousel(this.options.filterOptions);
			// this.$carousel.prev();
			this.trigger('prev');
			return false;
		},

		onRender: function() {

			// add "read", etc class to view here

			//console.log(this.options.filterOptions.media_type);

			// if ($.isEmptyObject(this.options.filterOptions)) this.options.filterOptions = { order: 'date' };
			// this.$el.html( this.template(this.options.filterOptions) );

			//var frag = document.createDocumentFragment();

			//var filteredCollection = new Entries(this.options.filterArray);

			// this.resizeEntries();








			// var limitedEntries = this.options.filterCollection.slice(0, 10);

			// _.each(limitedEntries, function(entry) {
			// 	var view = new EntryBlockView({ model: entry });
			// 	this.$el.find('.slide_item').append( view.render().el );

			// }, this);












			// $('#recent_posts .row .span2').remove();

			// _.each(frame.newJSON.related_post,function(post){
				//$('#recent_posts .row').append(_.template($('#related_template').html())(post));
			//});

			// ('#panel'+frame.currentPage).append(frame.newHTML);

			//var posts = new Posts();
			// var appListView = new catListView({ collection: apps});
			// appListView.render();

		},


		// Add a single post item to the container by creating a view for it, and
		// appending its element to the `<div>`.
		renderEntryBlock: function( entry ) {

			// if route '/' then show posts[0]
			// if route '/slug' then show posts[slug]
/*
			var view = new EntryBlockView({ model: entry });
			this.$el.find('.slide_item').append( view.render().el );
			console.log('block');
*/


		},


		show: function(slug) {

			var entry = this.collection.findWhere({url_title: slug});
			console.log('show post:' + slug);
			this.$el.append( this.render(entry).el );

		},

		resizeEntries: function( options ) {

			var resized = false;

			// var $row = $('#'+options.order);
			// var carousel = '#'+options.order;

			var $slideArray = this.$el.find('.slide');
			var $firstElement = this.$el.find('.slide:first');
			var itemSize = $firstElement.width()+10;
			var itemLimit = '';
			var results = [];

			if(cat.Options.screenType != 'phone' && cat.Options.screenType != 'desktop-small'){
				itemLimit = Math.floor((cat.Options.screenSize - 100) / itemSize);
			} else {
				itemLimit = Math.floor(cat.Options.screenSize / itemSize);
			}

			var setSize = itemSize * itemLimit;
			var slideOffset = (cat.Options.screenSize - setSize) / 2;

			this.$el.find('.slide').unwrap();

			$.map($slideArray, function(i, n){
				if(n%itemLimit === 0){
					results.push(n);
				}
			});

			$.each(results, function(i, v){
				$slideArray.slice(v, v + itemLimit).wrapAll('<div class="slide_item" />');
			});

			if(cat.Options.screenType != 'phone' && cat.Options.screenType != 'desktop-small'){
				$('.slide_window', this.$el).width(setSize + 'px');
				$('.slide_item', this.$el).width(setSize + 'px');
			} else {
				$('.slide_window', this.$el).attr('style', '');
				$('.slide_item', this.$el).width(cat.Options.screenSize + 'px');
			}

			resized = true;

			return resized;

		},

		/* Hammer.js Swiping for Carousels */

		Carousel: function( options, context ){

			var self = this;
			var view = context;

			var row = view.$el.find('.entry_slider');
			var container = row.find('.slide_wrapper');
			var panes = row.find('.slide_item');
			var pane_width = 0;
			var pane_width_percent = 0;
			var pane_count = panes.length;
			var current_pane = 0;

			/**
			 * initial
			 */
			self.init = function() {
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
			self.showPane = function( index ) {

					// between the bounds
					index = Math.max(0, Math.min(index, pane_count-1));
					//onsole.log(pane_count);
					//console.log(index);
					current_pane = index;

					var offset = -((100/pane_count)*current_pane);
					setContainerOffset(offset, true);

			};


			self.next = function() {
				return self.showPane(current_pane + 1, true);
			};

			self.prev = function() {
				return self.showPane(current_pane - 1, true);
			};

			/**
			 * set the pane dimensions and scale the container
			 */

			function setPaneDimensions() {
					pane_width = container.find('.slide_item:first').width();
					pane_width_percent = Math.floor((cat.Options.screenSize / pane_width) * 100);
					panes.each(function() {
							// $(this).width(pane_width);
					});
					container.width(pane_width*pane_count);
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
							var px = ((pane_width*pane_count) / 100) * percent;
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
						var pane_offset = -(100/pane_count)*current_pane;
						var drag_offset = ((100/pane_width)*ev.gesture.deltaX) / pane_count;

						// slow down at the first and last pane
						if((current_pane === 0 && ev.gesture.direction === Hammer.DIRECTION_RIGHT) ||
								 (current_pane === pane_count-1 && ev.gesture.direction === Hammer.DIRECTION_LEFT)) {
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
						if(Math.abs(ev.gesture.deltaX) > pane_width/2) {
								if(ev.gesture.direction === 'right') {
										self.prev();
								} else {
										self.next();
								}
						}
						else {
								self.showPane(current_pane, true);
						}
						break;
				}
			}

			row.hammer({
				drag_lock_to_axis: true
			}).on("release dragleft dragright swipeleft swiperight", handleHammer);
		}

	});

});