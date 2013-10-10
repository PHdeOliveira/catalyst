// Filename: routes/AppRouter.js

var Modernizr = Modernizr || {};

define([
	'cat',
	'jquery',
	'underscore',
	'backbone',
	'ev',
	'views/Home.View',
	'views/Backstage.View',
	'views/Events.View',
	'views/Podcast.View',
	'views/Atlanta.View',
	'views/Account.View',
	'views/Signup.View',
	'views/Entry.SingleView',
	'backbone.analytics'
], function(cat, $, _, Backbone, ev, HomeView, BackstageView, EventsView, PodcastView, AtlantaView, AccountView, SignupView, EntrySingleView) {

	var AppRouter = Backbone.Router.extend({

		routes: {
			'(/)': 'home',
			'search(/)': 'search',
			'read/:slug(/)': 'single',
			'watch/:slug(/)': 'single',
			'listen/:slug(/)': 'single',
			'podcast/:slug(/)': 'single',
			'backstage/:slug(/)': 'single',
			'backstage(/)': 'backstage',
			'events(/)': 'events',
			'podcast(/)': 'podcast',
			'resources(/)': 'resources', 'store(/)': 'resources',
			'atlanta(/)': 'atlanta', 'atlanta/*path': 'atlanta',
			'westcoast(/)': 'events', 'westcoast/*path': 'events',
			'dallas(/)': 'events', 'dallas/*path': 'events',
			'one-day(/)': 'oneday', 'one-day/*path': 'oneday',

			// Account / Filter / Signup
			'account(/)': 'account',
			'signup(/)': 'signup',

			':slug(/)': 'home'
			// ':slug(/)' : 'hero',
		},

		home: function() {
			cat.app.main.show( new HomeView() );
		},

		backstage: function() {
			require(['text!../../../backbone/backstage'],
				function( backstageTpl ) {
					cat.app.main.show( new BackstageView({ template: _.template(backstageTpl) }) );
				}
			);
		},

		events: function(){
			cat.app.main.show( new EventsView() );
		},

		podcast: function(){
			cat.app.main.show( new PodcastView() );
		},

		atlanta: function(path) {
			require(['event-scripts'],
				function() {
					if (path) cat.Options.eventPath = path;
					cat.Options.eventSite = true;
					var atlantaView = new AtlantaView(); // not using Marionette
				}
			);
		},

		oneday: function(path) {
			require(['cod-scripts'],
				function() {
					if (path) cat.Options.eventPath = path;
					cat.Options.eventSite = true;
				}
			);
		},

		single: function(slug) {
			var entrySingle = new EntrySingleView({ slug : slug });

			// After Single View Inits and loads EE template / model data, it will call the single:show event
			ev.vent.on('single:show',function(){
				$('#main').removeClass('active');
				cat.app.single.show( entrySingle );
			});

			// cat.Options.CurrentSlug = slug;
			// cat.app.app.show( new AppView() );
		},

		account: function(){
			require(['text!../../../backbone/account'],
				function( accountTpl ) {
					cat.app.main.show( new AccountView({ template: _.template(accountTpl) }) );
				}
			);
		},


		signup: function(){
			require(['text!../../../backbone/signup'],
				function( signupTpl ) {
					cat.app.main.show( new SignupView({ template: _.template(signupTpl) }) );
				}
			);
		},

		resources: function(){
			window.location = 'http://store.catalystconference.com';
		},

		// hero: function( slug ) {

		// 	if ($('body').attr('id') == 'home') {
		// 		slug = slug.replace(/\//g,'');
		// 		$('a[data-slug='+slug+']').trigger('click');
		// 		cat.Views.App = new AppView();
		// 	}
		// 	$('#spacer').remove();

		// },

		_trackPageview: function() {
			var url;
			url = Backbone.history.getFragment();
			//console.log(url);
			window._gaq.push(['_trackPageview', "/" + url]);
		},

		initialize: function() {
			var routesHit = 0;
			//keep count of number of routes handled by your application
			Backbone.history.on('route', function() { this.routesHit++; }, this);

			window._gaq = window._gaq || [];
			window._gaq.push(['_setAccount', 'UA-2886311-11']);
			window._gaq.push(['_setDomainName', 'catalystconference.com']);
			return this.bind('all', this._trackPageview);

		},

		back: function() {
	    if(this.routesHit > 1) {
	      //more than one route hit -> user did not land to current page directly
	      window.history.back();
	    } else {
	      //otherwise go to the home page. Use replaceState if available so
	      //the navigation doesn't create an extra history entry
	      this.navigate('/', {trigger:true, replace:true});
	    }
	  }

	});

	var initialize = function(){

		var router = new AppRouter();

		cat.router = router;

		$(function () {

			if(!Modernizr.history) {
				setTimeout(function(){
					Backbone.history.start({ pushState: false, root: "/" });
					var rootLength = Backbone.history.options.root.length;
					var fragment = window.location.pathname.substr(rootLength);
					//Backbone.history.navigate("#", { trigger: true });
				}, 2000);
			} else {
				Backbone.history.start({ pushState: true, silent: true });
				Backbone.history.loadUrl(Backbone.history.getFragment());
			}

			ev.reqres.setHandler("getLocation", function(){
		    return window.location.protocol + '//' + window.location.host + '/' + Backbone.history.options.root + Backbone.history.getFragment();
		  });

	  });

	};


	return {
	  initialize: initialize
	};

});