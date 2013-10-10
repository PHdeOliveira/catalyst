// Filename: views/Entry.PagedRowView.js

var Modernizr = Modernizr || {};
// var Hammer = Hammer || {};

// Paged Row View
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
	'swiper'

], function(cat, $, _, Backbone, Marionette, ev, Entry, Filter, EntryBlockView, entryRowTpl){

	return Marionette.CompositeView.extend({

		// id: 'entryRow',
		className: 'entry-row',

		template: _.template( entryRowTpl ),

		itemView: EntryBlockView,
		itemViewContainer: '.swiper-wrapper',

		initialize: function(options) {

			this.options = options;

			_.bindAll(this,'filter','reinit','showNav','hideNav');

			var self = this;

			this.reinitDelay = _.debounce( self.reinit, 500);

			this.collection.setSort(this.model.get('orderField'), this.model.get('orderDir'));

			this.listenTo(this.collection,'updateRow',this.checkResults,this);

			if (this.options.filter) {
				ev.vent.on('filter', this.filter, this);
				this.filter(this.options.filter);
				return;
			}

			ev.vent.on('swiper:reinit',this.reinitDelay,this);
			this.collection.fetcher();

		},

		collectionEvents: {
			'add': 'reinitDelay'
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

		onRender: function() {

			var self = this;

			_.defer(function(){

				var groupCount = Math.round($(window).width() / 250) - 1;

				if (groupCount < 1) groupCount = 1;

				if (self.rowSwiper) self.rowSwiper.destroy();

				var offsetPxBefore = 100;
				var offsetPxAfter = 100;

				if (cat.Options.screenType === 'phone') {
					offsetPxBefore = 35;
					offsetPxAfter = 35;
					groupCount = 1;
				}

				self.rowSwiper = self.$('.swiper-container').swiper({
					mode:'horizontal',
					slidesPerView: 'auto',
					slidesPerGroup: groupCount,
					resizeReInit: true,
					offsetPxBefore: offsetPxBefore,
					offsetPxAfter: offsetPxAfter,
					onInit: function(){
						// if (self.collection.length === 0) {
						// 	self.$el.addClass('no-results');
						// } else {
						// 	self.$el.removeClass('no-results');
						// }
					},
					onSlideChangeEnd: function(swiper){
						// console.log('activeIndex: '+swiper.activeIndex);
						// console.log('collection length: '+self.collection.length);
						// console.log('group count: '+(groupCount*4));
						if (swiper.activeIndex > self.collection.length-(groupCount*4) && self.collection.length < self.collection.totalRecords) {
							self.collection.fetcher();
						}
						self.$('.slider_nav').removeClass('inactive');

						if (swiper.activeIndex+1 === swiper.slides.length) {
							self.$('.slider_nav_right').addClass('inactive');
						}

						if (swiper.activeIndex+1 === 1) {
							self.$('.slider_nav_left').addClass('inactive');
						}
					}
					// pagination: '#carousel_nav',
					// autoplay: '5500'
				});

				self.$el.mouseenter(function(ev){
					self.showNav();
				});

				self.$el.mouseleave(function(ev){
					self.hideNav();
				});

			});

			_.delay( this.hideNav, 2000);

		},

		checkResults: function(){
			if (this.collection.length === 0) {
				this.$el.addClass('loaded no-results');
			} else {
				this.$el.removeClass('no-results');
			}
		},

		reinit: function(){
			if (!this.rowSwiper) return;
			this.$el.addClass('loaded');
			this.rowSwiper.reInit();
			ev.vent.off('swiper:reinit',this.reinitDelay,this);
		},

		onClose: function(){
			if (this.rowSwiper) this.rowSwiper.destroy();
			ev.vent.off('swiper:reinit',this.reinitDelay,this);
			ev.vent.off('filter', this.filter, this);
		},


		showNav: function(){
			this.$('.slider_nav').stop().dequeue().transition({
			  opacity: 100
			}, 400);
		},

		hideNav: function(){
			this.$('.slider_nav').stop().dequeue().transition({
			  opacity: 0
			}, 400);
		},


		nextPage: function (e) {
			e.preventDefault();
			// this.collection.nextPage();
			this.rowSwiper.swipeNext();
		},

		prevPage: function (e) {
			e.preventDefault();
			// this.collection.prevPage();
			this.rowSwiper.swipePrev();
		},

		filter: function ( searchModel ) {
			var self = this;

			// hack way of telling if the filter has changed...
			cat.Options.filterChange = true;

			if (cat.Options.podcast) cat.Filter.mediaList = ['podcast'];

			this.$el.removeClass('loaded no-results');

			ev.vent.on('swiper:reinit',this.reinitDelay,this);

			this.collection.setArrayFilter(searchModel);
			// this.render();
			// this.refreshRow();
			//this.preserveFilterField(fields);
			//this.preserveArrayFilterValue(filter);
		}


	});

});