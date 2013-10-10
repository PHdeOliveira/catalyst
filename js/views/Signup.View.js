// Filename: views/Signup.View.js

// Signup View
// ------------------

define([
	'cat',
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'ev'

], function(cat, $, _, Backbone, Marionette, ev){

	return Marionette.ItemView.extend({

		events: {
			'click .someBtn': 'someMethod'
		},

		initialize: function(options) {

			this.options = options;
			this.template = options.template;

		},

		onRender: function(){

		},


		someMethod: function(ev) {
			// some signup logic...
			ev.preventDefault(); // prevent click event
			$target = $(ev.currentTarget); // clicked element
		}


	});

});