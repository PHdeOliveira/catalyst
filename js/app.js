// Filename: app.js

define([
  'cat',
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'ev',
  'routes/AppRouter',
  'fastclick'
], function(cat, $, _, Backbone, Marionette, ev, AppRouter, FastClick){

	Marionette.TemplateCache.prototype.loadTemplate = function(templateId) {
		// Marionette expects 'templateId' to be the ID of a DOM element.
		// But with RequireJS, templateId is actually the full text of the template.
		var template = templateId;

		// Make sure we have a template before trying to compile it
		if (!template || template.length === 0){
			var msg = 'Could not find template: "' + templateId + '"';
			var err = new Error(msg);
			err.name = 'NoTemplateError';
			throw err;
		}

		return template;
	};

	var app = new Marionette.Application();

	// _.extend(App,CAT);

	app.addRegions({
		main: '#main',
    single: '#single',
		header: '#header',
		footer: '#footer'
	});

	app.addInitializer(function(options){

    cat.app = app;

		FastClick.attach(document.body);

		AppRouter.initialize();

	});

	return app;

});