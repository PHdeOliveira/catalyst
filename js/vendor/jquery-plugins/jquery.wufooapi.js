define([
	'jquery',
	'underscore',
	'backbone',
	'backbone.ajaxcommands'
], function($, _, Backbone, AjaxCommands){

	$.wufooAPI = (function () {
		// Private
		
		var base_url = "api/v3/",
		
		prepare_options = function (options, callback) {
			// If only callback is passed
			if ($.isFunction(options)) {
				options = {callback: options};
			}
			
			options = $.extend({}, $.wufooAPI.defaultOptions, options);
			
			// If both options and callback are passed in
			if ($.isFunction(callback)) {
				options.callback = callback;
			}
			
			return options;
		},
		
		post = function (url, options) {
			
			// var params = parameters(options);
			
			url = base_url + url; // Add base prefix
/*
			if (params.length) {
				url = [url, params].join('?'); // Add parameters if present
			}
*/		
			Backbone.AjaxCommands.register("wufoo", {
				url: options.getterPath + 'getter.php',
				type: "POST"
			});
				
			var formData = {url: url, formHash: options.formHash, data: options.data};
			
			var wufooPost = Backbone.AjaxCommands.get("wufoo");
				 
			wufooPost.on("success", function(response){
				// console.log('made it to callback');
			});
			
			wufooPost.on("error", function(response){
				// console.log(response);
			});
			
			wufooPost.execute(formData);
			
/*
			$.ajax(options.getterPath + 'getter.php', {type: 'POST', dataType: 'json', data: {url: url, formHash: options.formHash, data: options.data} }, function (response) {
				if (!response) {
					// Wufoo will probably never do this to you
					options.callback(false, $.wufooAPI.errors.NoDataError);
					return;
				}
				
				try {
					options.callback(jQuery.parseJSON(response));
					console.log('made it to callback');
				} catch (e) {
					options.callback(false, new $.wufooAPI.errors.InvalidJSON(e));
				}
			});
*/
		};
		
		// Public
		
		return {
			defaultOptions: {
				formHash: "",										// Hash of form - Forms tab, Code button, API Information button
				reportHash: "",									// Hash of report (KIND OF HARD TO FIND)
				entryID: "",										// When using an API that needs to refernce a specific entry
				data: "",										 		// Form data
				callback: $.noop(),							// ALWAYS REQUIRED - function to process data object
				system: false,									// Return system information, e.g. IP addresses
				getterPath: "/fw/php/" 					// Path to file getter.php (relative to location of file calling this plugin)
			},
			
			errors: {
				NoDataError: { type: 'NoDataError', message: "No data was supplied to the callback. Something is wrong!"},
				InvalidJSON: function (data) {
					return {
						type: 'InvalidJSON',
						message: "The information in the config file is probably wrong. The request returned invalid JSON: \n" + data
					};
				}
			},
						
			postEntries: function (options, callback) {
				options = prepare_options(options, callback);
				
				var url = options.reportHash === "" ? 'forms/' + options.formHash : 'reports/' + options.reportHash;
				url = url + "/entries.json";
				
				post(url, options);
			}

		};
	}());
		
});