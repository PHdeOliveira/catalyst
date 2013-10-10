// Filename: main.js

require.config({
	paths: {
		'jquery': 'vendor/jquery/jquery',
		'domReady': 'vendor/domready/domReady',
		'underscore': 'vendor/underscore/underscore',
		'backbone': 'vendor/backbone/backbone',
		'backbone.wreqr' : 'vendor/backbone.wreqr/lib/amd/backbone.wreqr',
		'backbone.babysitter' : 'vendor/backbone.babysitter/lib/amd/backbone.babysitter',
		'backbone.paginator' : 'vendor/backbone.paginator/lib/backbone.paginator',
		//'backbone.collectionsubset' : 'vendor/backbone.collectionsubset/backbone.collectionsubset',
		'marionette' : 'vendor/marionette/lib/core/amd/backbone.marionette',
		'fastclick' : 'vendor/fastclick/fastclick',
		'text': 'vendor/text/text',
		'backbone.analytics': 'vendor/backbone.analytics/google-analytics-repo',
		'backbone.associations': 'vendor/backbone.associations/backbone.associations',
		'backbone.ajaxcommands': 'vendor/backbone.ajaxcommands/backbone.ajaxcommands',
		'froogaloop': 'vendor/froogaloop/froogaloop.min',
		'prefix.free': 'vendor/prefix.free/prefix.free.min',
		'tweenmax': 'vendor/tweenmax/TweenMax.min',
		'jwplayer': 'vendor/jwplayer/jwplayer',
		'jwplayer.html5': 'vendor/jwplayer/jwplayer.html5',
		'iscroll': 'vendor/iscroll/iscroll',
		'swiper': 'vendor/swiper/idangerous.swiper-2.2',
		'jquery.easing': 'vendor/jquery-plugins/jquery.easing.1.3.min',
		'jquery.ui': 'vendor/jquery-plugins/jquery-ui-1.10.2.custom',
		'jquery.imagesloaded': 'vendor/jquery-plugins/jquery.imagesloaded.min',
		'jquery.mobile': 'vendor/jquery-plugins/jquery.mobile.custom.min',
		'jquery.masonry': 'vendor/jquery-plugins/jquery.masonry.min',
		'jquery.transit': 'vendor/jquery-plugins/jquery.transit.min',
		'jquery.chosen': 'vendor/jquery-plugins/jquery.chosen.min',
		'jquery.hammer': 'vendor/jquery-plugins/jquery.hammer',
		'jquery.superscrollorama': 'vendor/jquery-plugins/jquery.superscrollorama.min',
		'jquery.textfill': 'vendor/jquery-plugins/jquery.textfill.min',
		'jquery.stellar': 'vendor/jquery-plugins/jquery.stellar.min',
		'jquery.wufooapi': 'vendor/jquery-plugins/jquery.wufooapi',
		'jquery.socialist': 'vendor/jquery-plugins/jquery.socialist',
		'jquery.isotope': 'vendor/jquery-plugins/jquery.isotope',
		'jquery.isotope.perfectmasonry': 'vendor/jquery-plugins/jquery.isotope.perfectmasonry',
		'ustream': 'vendor/ustream/ustream-embedapi.min'
	},
	shim: {
		'jquery' : {
      exports : 'jQuery'
    },
    'underscore' : {
      exports : '_'
    },
    'backbone' : {
      deps : ['jquery', 'underscore'],
      exports : 'Backbone'
    },
		'marionette': ['jquery'],
		'backbone.ajaxcommands': ['backbone','underscore','jquery'],
		'backbone.associations': ['backbone','underscore'],
		'jquery.easing': ['jquery'],
		'jquery.ui': ['jquery'],
		'jquery.imagesloaded': ['jquery'],
		'jquery.mobile': ['jquery'],
		'jquery.masonry': ['jquery'],
		'jquery.transit': ['jquery'],
		'jquery.chosen': ['jquery'],
		'jquery.hammer': ['jquery'],
		'jquery.superscrollorama': ['jquery'],
		'jquery.textfill': ['jquery'],
		'jquery.stellar': ['jquery'],
		'jquery.wufooapi': ['jquery'],
		'jquery.socialist': ['jquery'],
		'jquery.isotope': ['jquery'],
		'jquery.isotope.perfectmasonry': ['jquery','jquery.isotope']

	}
});

(function() {

	require(['app'], function(App) {
		App.start();
	});

})();