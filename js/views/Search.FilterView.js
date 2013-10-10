// Filename: views/Search.FilterView.js

// Search Filter View
// ---------------

define([
	'cat',
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'ev',
	'models/Filter',
	// 'text!templates/search-filter-simple.html',
	'jquery.chosen'
], function(cat, $, _, Backbone, Marionette, ev, Filter, searchFilterTpl){

	return Marionette.ItemView.extend({

		// template: _.template( searchFilterTpl ),

		initialize: function(options) {

			this.options = options;
			this.template = options.template;

			_.bindAll(this,'initChosen','updateEntryRows');

			this.updateSearch = _.debounce(this.updateEntryRows, 500);

			this.listenTo( this.model, 'change', this.updateSearch, this );
			this.listenTo( this.model, 'change:categories[*].selected', this.updateSearch, this );
			this.listenTo( this.model, 'change:mediatypes[*].selected', this.updateSearch, this );
			this.listenTo( this.model, 'change:essentials[*].selected', this.updateSearch, this );
			this.listenTo( this.model, 'change:authors[*].selected', this.updateSearch, this );
			this.listenTo( this.model, 'change:tags[*].selected', this.updateSearch, this );
			this.listenTo( this.model, 'change:viewtime[*].selected', this.updateSearch, this );

			ev.vent.on('resized',this.updateChosen,this);
		},

		events: {
			'focus #search_query': 'searchFocus',
			'keyup #search_query': 'searchQuery',
			'keyup': 'checkKey',
			'click #advanced_filter_btn': 'advancedFilter',
			'click #featured_search_btn' : 'featuredSearches',
			'change .chzn-select': 'filterUpdate',
			'click .search-choice-close': 'filterUpdate',
			'click #featured_searches_set ul li a': 'featuredSearch',
			'click .clear_search': 'clearSearch'
		},

		onRender: function() {
			var self = this;
			_.defer( self.initChosen );
		},

		featuredSearch: function( vent ) {
			vent.preventDefault();
			$('#search_query').val(vent.currentTarget.outerText);
			$('#search_query').trigger('keyup');
			$('#search_query').focus();
		},

		filterUpdate: function( vent ){

			var collectionName = vent.target.id;

			_.each(vent.target, function( opt ){
				if (opt.selected) {
					this.model.get(collectionName).at(opt.index).set({ selected: true });
				} else {
					this.model.get(collectionName).at(opt.index).set({ selected: false });
				}
			}, this);

			var chosenString = "";
			var chosenCount = $(vent.target).parent().find('.chzn-container .search-choice').size();
			var chosenID = '#' + collectionName + '_chzn';

			// Add 'and'

			if($(chosenID + ' .search-choice').size() > 1){
				$(chosenID + ' .and').remove();
				$(chosenID + ' .search-choice:last').prepend('<span class="and"> and </span>');
			}

			// Add ,

			if($(chosenID + ' .search-choice').size() > 2){
				$(chosenID + ' .comma').remove();
				$(chosenID + ' .search-choice').slice(0, -2).append('<span class="comma">, </span>');
			}

			if(chosenCount > 0){
				$('.chzn-choices .search-choice').each(function(){
					chosenString += '<span class="filter_tag">' + $('span:not(".and, .comma")', this).text() + '<a href="javascript:void(0)" class="search-choice-close close_btn" rel="0"></a></span>';
				});
				$('#tag_container').html(chosenString);
			} else {
				chosenString = "";
				$('#tag_container').html('');
			}

		},

		updateEntryRows: function() {
			// iterate through search model to create search query post vars

			var searchModel = this.model;

			var selectedFilters = 0;

			function mapFilterArray( collection ) {
				var selectedSet = searchModel.get(collection).where({ selected: true });
				var newArray = _.map(selectedSet,function( tag ){ return tag.get('title'); });
				selectedFilters += newArray.length;
				return newArray;
			}

			cat.Filter.tagList = mapFilterArray('tags');
			cat.Filter.categoryList = mapFilterArray('categories');
			cat.Filter.authorList = mapFilterArray('authors');
			cat.Filter.essentialList = mapFilterArray('essentials');
			cat.Filter.mediaList = mapFilterArray('mediatypes');
			cat.Filter.viewtimeList = mapFilterArray('viewtime');
			cat.Filter.keywords = searchModel.get('keywords');

			if (selectedFilters === 0 && this.model.get('keywords') === '') {
				this.clearSearch();
				return;
			}

			ev.vent.trigger('filter', searchModel);

			$('#form_search .loader').css('display', 'none');
			$('#form_search .clear_search').css('display', 'block');

		},

		checkKey: function (vent) {
			if(vent.keyCode == 13) {
        vent.preventDefault();
        return false;
      } else {
	      this.pageScrollTo('#content_filter',100);
	      $('#search_query').focus();
      }
		},

		searchFocus: function ( target ) {
			var offset = (cat.Options.phone) ? 0 : 100;
			this.pageScrollTo('#content_filter',offset);
			$('#featured_searches').stop().dequeue().transition({
				height:  '100px'
			}, 200, 'easeOutExpo', function(){
				$(this).css('overflow', 'visible');
			});
		},


		clearSearch: function ( vent ) {
			if (vent) vent.preventDefault();

			this.model.set({ keywords: '' },{silent: true});
			cat.Filter.keywords = this.model.get('keywords');
			ev.vent.trigger('filter:remove', this.model);
			$('#form_search .clear_search').css('display', 'none');
			$('#form_search .loader').css('display', 'none');
			$('#form_search input').val('');
			this.updateSearch(this.model);
		},


		searchQuery: function ( vent ) {
			var self = this;
			if (vent.target.value.length > 0) {
				$('#form_search .clear_search').css('display', 'none');
				$('#form_search .loader').css('display', 'block');
				this.model.set({ keywords: vent.target.value });
			} else {
				this.clearSearch();
			}

		},


		pageScrollTo: function( target, offset ) {
			var scrollTo = $(target).offset().top - offset;

			$('html, body').stop().dequeue().animate({
				scrollTop: scrollTo
			}, 500);
		},


		featuredSearches: function() {

			if(cat.Options.screenType == 'phone' || cat.Options.screenType == 'desktop-small'){
				var resultsHeight = $('#featured_searches_set ul').outerHeight();

				if($('#featured_search_btn').hasClass('active')) {
					$('#featured_search_btn').removeClass('active');
					$('#featured_searches_set, #featured_searches').stop().dequeue().transition({
						height: 0
					}, 200, 'easeOutExpo');
				} else {
					$('#featured_search_btn').addClass('active');
					$('#featured_searches_set, #featured_searches').stop().dequeue().transition({
						height: resultsHeight + 'px'
					}, 200, 'easeOutExpo');
				}

			}

			return false;
		},

		advancedFilter: function() {

			if(!cat.Options.searchActive){
				cat.Options.searchActive = true;
			} else {
				cat.Options.searchActive = false;
			}

			if (cat.Options.searchActive) {
				this.openFilters();
			} else {
				this.closeFilters();
			}

			// this.checkSelectedTags();

			return false;
		},

		openFilters: function() {

			// $('#advanced_filter_btn').text('Advanced Filters –');

			$('#advanced_filter_btn').addClass('active');

			this.pageScrollTo('#content_filter', -34);
			this.filtersHeight();
		},

		closeFilters: function() {
			// $('#advanced_filter_btn').text('Advanced Filters +');
			$('#advanced_filter_btn').removeClass('active');
			$('#filters').css('overflow', 'hidden');
			$('#filters').stop().dequeue().transition({
				height: 0
			}, 200, 'easeOutExpo');
			this.searchFocus();
		},

		filtersHeight: function(){
			var filtersHeight = $('#filters .container').outerHeight();
			$('#filters').stop().dequeue().transition({
				height: filtersHeight+30 + 'px'
			}, 200, 'easeOutExpo', function(){
				$(this).css('overflow', 'visible');
			});
		},


		checkSelectedTags: function() {
			var resultsHeight = $('#filter_tags .search_wrapper').outerHeight();

			if($('#filter_tags .filter_tag').size() > 0){
				$('#filter_tags').stop().dequeue().transition({
					height: resultsHeight + 'px'
				}, 200, 'easeOutExpo', function(){
					$(this).css('overflow', 'visible');
				});
			} else {
				$('#filter_tags').css('overflow', 'hidden');
				$('#filter_tags').stop().dequeue().transition({
					height: 0
				}, 200, 'easeOutExpo');
			}
		},


		initChosen: function() {

			$('.dropdown_set .chzn-container').each(function (index) {
					$(this).css({
						'min-width': '100%',
						'max-width': '100%'
					});
			});

			$('.chzn-select').chosen().removeClass('hide');

		},

		updateChosen: function(){
		  $('.dropdown_set .chzn-container').each(function (index) {
		      $(this).css({
		        'min-width': '100%',
		        'max-width': '100%'
		      });
		  });
		},

		createResults: function(){
		  var allChoices = '';
		  var allChoicesTotal = 0;
		  var currentSearch = $('#search_query').val();
		  var results = '';

		  $('.chzn-choices').each(function(){
		    var i = 0;
		    var choices = '';
		    var totalResults = $('.search-choice', this).size();
		    $('.search-choice', this).each(function(){
		      i++;
		      choices += $('span', this).text();

		      if(i < totalResults){
		        choices += ' & ';
		      }
		    });

		    allChoicesTotal++;

		    if(totalResults > 0 && allChoicesTotal > 1){
		      if(allChoices !== '') allChoices += ', ';
		    }

		    allChoices += choices;
		  });

		  if (allChoices === '' && currentSearch === ''){

		    results = 'No results.';

		    $('#featured_entries').collapse('show');
		    $('#filter_results').collapse('hide');

		    $('.search_title').each(function(){
		      $(this).addClass('hide');
		    });

		  } else {

		    if (currentSearch !== '') currentSearch = '"' + currentSearch + '"';

		    results = '123 Results ';
		    if (currentSearch !== '') results += 'for ';
		    results += currentSearch;
		    if (allChoices !== '') results += ' in ';
		    results += allChoices;

		    // $('#filter_results span').text(results);

		    if ($('#featured_entries').hasClass('in')) {
		      $('#featured_entries').collapse('hide');
		    }

		    if (!$('#filter_results').hasClass('in')) {
		      $('#filter_results').collapse('show');
		    }

		    $('.search_title').each(function(){
		      $(this).removeClass('hide');
		    });
		  }

		  this.filtersHeight();
		}



	});

});