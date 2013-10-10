// Filename: views/EventView.js

var $f = $f || {};

define([
	'cat',
	'ev',
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'models/Filter',
	'collections/Photos',
	'collections/Tweets',
	'views/Photo.RowView',
	'views/Event.TweetBlockView',
	'backbone.ajaxcommands',
	'jquery.stellar',
	'jquery.wufooapi',
	'jquery.isotope',
	'jquery.isotope.perfectmasonry',
	'froogaloop'

], function(cat, ev, $, _, Backbone, Marionette, Filter, Photos, Tweets, PhotoRowView, TweetBlockView, AjaxCommands){

	return Backbone.View.extend({

		//entryRowTpl: _.template(	),

		el: '#tweets',

		initialize: function() {

			var self = this;

			_.bindAll(this,'wufooComplete','favorite','retweet');

			this.model = new Filter();

			Backbone.AjaxCommands.register("knownForms", {
			  url: window.location.href,
			  type: "POST"
			});

			Backbone.AjaxCommands.register("retweetIT", {
			  url: window.location.protocol + '//' + window.location.hostname + '/?ACT=107',
			  type: "POST"
			});

			Backbone.AjaxCommands.register("favoriteIT", {
			  url: window.location.protocol + '//' + window.location.hostname + '/?ACT=108',
			  type: "POST"
			});

			Backbone.AjaxCommands.register("updateCount", {
			  url: window.location.protocol + '//' + window.location.hostname + '/?ACT=109',
			  type: "POST"
			});

			ev.vent.on('tweet:retweet',this.retweet,this);
			ev.vent.on('tweet:favorite',this.favorite,this);

			this.listenTo( this.model, 'change', this.tweetSearch, this );

			// fastclick.initFastButtons();

			this.$state1 = $('.state1');
			this.$state2 = $('.state2');
			this.$state3 = $('.state3');
			this.$state4 = $('.state4');
			this.$state5 = $('.state5');

			this.twitterUser = false;

			this.$state1Form = $('#state1');
			this.$state3Form = $('#state3');
			this.$state4Form = $('#state4');
			this.$tweetUpdateForm = $('#tweetUpdate');
			this.$unknown = $('.unknown');
			this.$refresh = $('#refresh_btn');
			this.$finishRefresh = $('#finish_refresh');

			this.$tweetGrid = $('#tweetGrid');

			this.$search = $('#search_input');
			this.$search.on('keyup',_.bind(this.searchQuery,this));

			this.ticker = 0;
			this.$refresh.on('click',function( ev ){
				ev.preventDefault();
				cat.Collections.Tweets.fetch({
					reset:true,
					data: { order: 'random', offset: self.ticker, limit: Math.floor(cat.Options.screenSize / 12) },
					type: 'POST'
				});
				self.ticker++;
			});

			this.$finishRefresh.on('click',function( ev ){
				ev.preventDefault();
				cat.Collections.Tweets.fetch({
					reset:true,
					data: { order: 'random', offset: self.ticker, limit: Math.floor(cat.Options.screenSize / 12) },
					type: 'POST'
				});
				self.ticker++;
			});

			// this.startState1();

			cat.Collections.Photos = new Photos();
			cat.Collections.Tweets = new Tweets();

			cat.Collections.Tweets.comparator = function(tweet) {
				return tweet.get("random");
			};

			this.listenTo(cat.Collections.Photos, 'reset', this.renderPhotoRow, this );
			this.listenTo(cat.Collections.Tweets, 'reset', this.renderGrid, this);
			this.listenTo(cat.Collections.Tweets, 'add', this.addOne, this);
			this.listenTo(cat.Collections.Tweets, 'refresh', this.refresh, this);
			this.listenTo(this.model, 'change', this.updateEntryRows, this );

			this.limit =  Math.floor(cat.Options.screenSize / 12);

			cat.Collections.Tweets.fetch({ reset:true, data: { limit: this.limit }, type: 'POST' });
			this.TweetViews = [];

			var iframe = $('#homeLoop')[0];
			if (iframe) {
				cat.Options.player = $f(iframe);

				// When the player is ready, add listeners for pause, finish, and playProgress
				cat.Options.player.addEvent('ready', function() {
	          cat.Options.player.api('setVolume', 0);
	          setTimeout(function() { cat.Options.player.api('setVolume', 0); },500);
	          setTimeout(function() { cat.Options.player.api('setVolume', 0); },1000);
				});
			}
		},

		events: {
			'click #twitterSSO': 'twitterSSO',
			'submit #state1': 'submitState1',
			'submit #state3': 'submitState3',
			'submit #state4': 'submitState4',
			'submit #tweetUpdate': 'submitTweet',
			'keyup #state1 #title': 'splitNames',
			'keyup #search_input': 'checkKey'
		},


		tweetSearch: function( searchModel ){
			var keyword = searchModel.get('keywords');
			cat.Collections.Tweets.fetch({ reset:true, data: {keywords: keyword, limit: this.limit}, type: 'POST' });
			// return this;
		},


		searchQuery: function ( ev ) {

			var self = this;

			var timeoutId = 0;
			if (ev.target.value.length > 0) {
				clearTimeout(timeoutId);
				// $('#form_search .clear_search').css('display', 'none');
				// $('#form_search .loader').css('display', 'block');
				timeoutId = setTimeout( function() { self.model.set({ keywords: ev.target.value }); }, 800 );
			} else {
				// $('#form_search .clear_search').css('display', 'none');
				clearTimeout(timeoutId);
				self.model.set({ keywords: '' });
			}

		},


		twitterSSO: function( ev ){
			ev.preventDefault();
			var emailVal = $('#state3 #member_email').val();
			var email = false;
			var emailFilter =  new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);

			if(emailFilter.test(emailVal)){
				email = true;
			}

			if(this.reTweet === true || this.favTweet === true){
				email = true;
			}

			var target = ev.currentTarget;
			var url = window.location.protocol+'//'+window.location.host+target.getAttribute('href');

			if (!$('#twitterSSO').hasClass('loading')){
				if(email){
					var w = window.open(url,'SocialLoginPopup','toolbar=0,statusbar=0,menubar=0,width=800,height=600');
					$('#twitterSSO').addClass('loading');
				} else {
					$('#state3 #member_email').addClass('error');
					setTimeout(function(){
						$('#state3 #member_email').removeClass('error');
					}, 500);
				}
			}

		},


		splitNames: function ( ev ){
			var str=ev.currentTarget.value;
			var n=str.split(" ");
			this.$state1Form.find('#member_firstname').val(n[0]);
			this.$state1Form.find('#member_lastname').val(n[1]);
			this.$state3Form.find('#member_firstname2').val(n[0]);
			this.$state3Form.find('#member_lastname2').val(n[1]);
			this.$state3Form.find('input[name=title]').val(str);
			this.$state4Form.find('input[name=title]').val(str);
			this.$unknown.find('h3').text(str);
		},


		refreshUser: function( member_id ) {
			// catch the twitter login, trigger the member profile update & wufoo
			this.twitterUser = true;

			if (this.favTweet !== true && this.reTweet !== true) {

				this.$state4Form.find('input[name=author_id]').val(member_id);
				this.$state4Form.find('input[name=logged_out_member_id]').remove();
				this.$state3Form.find('input[name=author_id]').val(member_id);
				//this.$state3Form.find('input[name=member_twitter_handle]').val(member_id);
				this.$tweetUpdateForm.find('input[name=author_id]').val(member_id);
				this.$tweetUpdateForm.find('input[name=logged_out_member_id]').remove();
				this.$state3Form.submit();

			}

			this.favTweet = false;
			this.reTweet = false;

			// potential to auto trigger the fav / retweet you clicked to get here.  Also, if a user interacts with the retweet / fav buttons, does the SSO, we need to alter the tweet process to account for already knowing some info and having them signed in.

		},


		submitState1: function( ev ) {
			var self = this;
			var formData = $(ev.currentTarget).serializeArray();
			ev.preventDefault();

			var knownState1 = Backbone.AjaxCommands.get("knownForms");
			knownState1.on("success", function(response){ self.startState3(response); });
			knownState1.on("error", function(response){ });

			if($('#state1 #title').val() !== '' && !$('#state1_btn').hasClass('loading')){
				$('#state1_btn').addClass('loading');
				knownState1.execute(formData);
			} else {
				$('#state1 #title').addClass('error');
				setTimeout(function(){
					$('#state1 #title').removeClass('error');
				}, 500);
			}
		},


		submitState3: function( ev ) {
			ev.preventDefault();
			var self = this;
			var formData = $(ev.currentTarget).serializeArray();
			var emailVal = $('#state3 #member_email').val();
			var phoneVal = $('#state3 #member_phone_number').val();
			var emailFilter =  new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
			// var phoneFilter = /^[0-9-+]+$/;
			// var phone = false;
			var email = false;

			// if(phoneFilter.test(phoneVal)){
			// 	phone = true;
			// }

			if(emailFilter.test(emailVal)){
				email = true;
			}

			$.wufooAPI.postEntries({
       "formHash"	:	'm7a2k1',
       "callback"	:	self.wufooComplete,
       "data"			:	formData
      });

			var knownState3 = Backbone.AjaxCommands.get("knownForms");

			if (this.twitterUser === false){
				knownState3.on("success", function(response){ self.startState2(); });
			} else {
				knownState3.on("success", function(response){ self.startState4( response ); });
			}
			knownState3.on("error", function(response){ });

			// if ($('#freestuff_btn').hasClass('loading'))

			if (!$('#twitterSSO').hasClass('loading') || !$('#freestuff_btn').hasClass('loading')) {

				if(email && !$('#twitterSSO').hasClass('loading')){
					$('#freestuff_btn').addClass('loading');
					knownState3.execute(formData);
				} else if ($('#twitterSSO').hasClass('loading') === true) {
					knownState3.execute(formData);
				} else {
					$('#state3 #member_email').addClass('error');
					setTimeout(function(){
						$('#state3 #member_email').removeClass('error');
					}, 500);
				}

			}

		},


		submitState4: function( ev ) {
			var self = this;
			var formData = $(ev.currentTarget).serializeArray();

			ev.preventDefault();

			var knownState4 = Backbone.AjaxCommands.get("knownForms");
			knownState4.on("success", function(response){
				// take the response from Twitter and add the "tweet" ID to our new channel entry
				// use twitter IDs for retweets / favorites - user MUST be logged in first via twitter
			  self.updateTweet( response );

			});
			knownState4.on("error", function(response){ });

			if(!$('#known_btn').hasClass('loading')){
				$('#known_btn').addClass('loading');
				knownState4.execute(formData);
			}
		},


		updateTweet: function( response ) {

			var entryID = response.entry_id;
			this.$tweetUpdateForm.find('input[name=entry_id]').val(entryID);

			if (response.response !== '') {

				var tweet_id = response.response.id_str;
				var tweet_screen_name = response.response.user.screen_name;
				var tweet_name = response.response.user.name;
				var retweet_count = response.response.retweet_count;
				var profile_image_url = response.response.user.profile_image_url;

				this.$tweetUpdateForm.find('input[name=tweet_id]').val(tweet_id);
				this.$tweetUpdateForm.find('input[name=tweet_screen_name]').val(tweet_screen_name);
				this.$tweetUpdateForm.find('input[name=tweet_name]').val(tweet_name);
				this.$tweetUpdateForm.find('input[name=retweet_count]').val(retweet_count);
				this.$tweetUpdateForm.find('input[name=profile_image_url]').val(profile_image_url);

			}

			this.$tweetUpdateForm.submit();

		},


		submitTweet: function( ev ) {
			var self = this;
			var formData = $(ev.currentTarget).serializeArray();

			ev.preventDefault();

			var tweetUpdate = Backbone.AjaxCommands.get("knownForms");
			tweetUpdate.on('success', function(response){
				self.startState5();
			});
			tweetUpdate.on('error', function(response){ });
			tweetUpdate.execute(formData);
		},


		wufooComplete: function( response ) {

		},


		startState1: function() {
			// no results - lets get started
			this.$state1.removeClass('hidden');
			this.$unknown.removeClass('hidden');
		},


		startState2: function() {
			// free stuff only success
			$('#freestuff_btn').removeClass('loading');
			this.$state3.addClass('hidden');
			this.$state2.removeClass('hidden');
		},


		startState3: function( response ) {
			// submit email and phone for free stuff / connect w/ twitter
			this.$state1.addClass('hidden');
			this.$state3.removeClass('hidden');
			$('#state1_btn').removeClass('loading');
			var entryID = response.entry_id;
			this.$state3Form.find('input[name=entry_id]').val(entryID);

			this.$('#twitterSSO').attr('href','/?ACT=101&provider=twitter&popup=y&entryid='+entryID+'&RET='+window.location.pathname);
		},


		startState4: function( response ) {
			// tweet it!
			this.$state3.addClass('hidden');
			this.$state4.removeClass('hidden');
			$('#twitterSSO').removeClass('loading');
			//var entryID = response.entry_id;
			//this.$state4Form.find('input[name=entry_id]').val(entryID);
		},


		startState5: function( response ) {
			// successful tweet
			$('#known_btn').removeClass('loading');
			this.$state4.addClass('hidden');
			this.$state5.removeClass('hidden');
		},


		clearState: function( response ) {
			this.$state1.addClass('hidden');
			this.$state2.addClass('hidden');
			this.$state3.addClass('hidden');
			this.$state4.addClass('hidden');
			this.$state5.addClass('hidden');
		},


		renderPhotoRow: function( photo ) {
			var photoRow = new PhotoRowView({ collection: photo });
			this.$photos.html( photoRow.render().el );

			$('#photo_feed').addClass('loaded');
		},


		renderGrid: function( models ) {

			var self = this;

			this.$unknown.addClass('hidden');

			if (models.length === 0) {
				this.startState1();
			} else {
				this.clearState();
			}

			_.each(this.TweetViews,function( view ){
				view.close();
				// view.remove();
			});

			this.TweetViews = [];

			var frag = document.createDocumentFragment();

			models.each(function( entry ) {
				var view = new TweetBlockView({ model: entry });
				self.TweetViews.push(view);
				frag.appendChild( view.render().el );
			}, this);

			//this.oldItems = this.$tweetGrid.find('.tweet');
			//this.$tweetGrid.html( frag.cloneNode(true) );
			this.$tweetGrid.html( frag );

			$('#tweetGrid').addClass('loaded');

			if(!this.$tweetGrid.hasClass('isotope')) {
				this.$tweetGrid.isotope({
					itemSelector : '.tweet',
				  layoutMode : 'perfectMasonry',
				  perfectMasonry: {
					  columnWidth: 100,
					  rowHeight: 100
			    }
				});
			} else {
				this.$tweetGrid.isotope('appended', this.$tweetGrid.find('.tweet'));
				this.$tweetGrid.isotope('reLayout');
			}
		},

		favorite: function(model) {
			if (this.twitterUser === false) {
				this.favTweet = true;
				$('#twitterSSO').trigger('click');
				return;
			}
			var self = this;
			var id = { 'id': model.get('tweet_id') };
			var favSubmit = Backbone.AjaxCommands.get("favoriteIT");
			favSubmit.on("success", function(response){ self.$el.find('#fav_btn').addClass('active'); });
			favSubmit.on("error", function(response){  });
			favSubmit.execute(id);
		},

		retweet: function(model) {
			if (this.twitterUser === false) {
				this.reTweet = true;
				$('#twitterSSO').trigger('click');
				return;
			}
			var self = this;
			var id = { 'id': model.get('tweet_id') };
			var entry_id = model.get('entry_id');
			var reTweetSubmit = Backbone.AjaxCommands.get("retweetIT");
			reTweetSubmit.on("error", function(response){ });
			reTweetSubmit.on("success", function(response){
				if (response.id_str) {
					self.$el.find('#retweet_btn').addClass('active');
					self.updateCount(response,entry_id);
				}
			});
			reTweetSubmit.execute(id);
		},

		updateCount: function(response,entry_id) {
			var count = response.retweet_count;
			var self = this;
			var data = { 'id': entry_id, 'count': count };
			var tweetCount = Backbone.AjaxCommands.get("updateCount");
			tweetCount.on("success", function(response){
				// console.log(response);
			});
			tweetCount.on("error", function(response){ });
			tweetCount.execute(data);
		}

	});

});