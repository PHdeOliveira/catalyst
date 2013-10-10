// Filename: views/Event.TweetBlockView.js

// Tweet Block View
// ---------------

define([
	'cat',
	'jquery',
	'ev',
	'underscore',
	'backbone',
	'marionette',
	'models/Tweet',
	'text!templates/tweet-block.html',
	'backbone.ajaxcommands'
], function(cat, $, ev, _, Backbone, Marionette, Tweet, tweetBlockTpl, AjaxCommands){

	var TweetBlock = Marionette.ItemView.extend({

		className: 'tweet',
		template: _.template( tweetBlockTpl ),

		initialize: function() {

		},

		events: {
			'click #fav_btn': 'favorite',
			'click #retweet_btn':	'retweet',
			'click #read_btn':	'read',
			'click header':	'read'
		},

		onRender: function() {

			var classes = '';
			classes += this.model.get('tweet_type')+' ';

			var rank = this.model.get('ranking');

				if (rank <= 5 && rank > 0) {
					classes += 'large ';
				} else if (rank > 5) {
					classes += 'med ';
				} else {
					classes += 'small ';
				}

			this.$el.addClass(classes); //.html( this.template( this.model.toJSON() ));

		},


		favorite: function(ev) {
			ev.preventDefault();
			ev.vent.trigger('tweet:favorite',this.model);
		},

		retweet: function(vent) {
			vent.preventDefault();
			ev.vent.trigger('tweet:retweet',this.model);
		},

		read: function(ev) {
			ev.preventDefault();
			var self = this;
			var id = this.model.get('tweet_id');
			var handle = this.model.get('tweet_screen_name');
			var url = 'https://twitter.com/'+handle+'/status/'+id;
			var win=window.open(url, '_blank');
			win.focus();
		}

	});

	return TweetBlock;
});