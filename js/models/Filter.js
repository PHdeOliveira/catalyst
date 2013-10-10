// Filename: models/Post.js

define([
	'cat',
	'underscore',
	'backbone',
	'backbone.associations'
], function(cat, _, Backbone) {

	var Author = Backbone.AssociatedModel.extend({
		defaults: {
			count: 1,
			title: "Catalyst",
			url_title: "catalyst",
			selected: false
		}
	});

	var Essential = Backbone.AssociatedModel.extend({
		defaults: {
			count: 1,
			title: "",
			url_title: "",
			selected: false
		}
	});

	var Tag = Backbone.AssociatedModel.extend({
		defaults: {
			count: 1,
			title: "",
			url_title: "",
			selected: false
		}
	});

	var Media = Backbone.AssociatedModel.extend({
		defaults: {
			count: 1,
			title: "",
			url_title: "",
			selected: false
		}
	});

	var ViewTime = Backbone.AssociatedModel.extend({
		defaults: {
			count: 1,
			title: "",
			url_title: "",
			selected: false
		}
	});

	var Category = Backbone.AssociatedModel.extend({
		defaults: {
			count: 1,
			title: "",
			url_title: "",
			selected: false
		}
	});

	var TagsCollection = Backbone.Collection.extend({ model: Tag });
	var AuthorsCollection = Backbone.Collection.extend({ model: Author });
	var EssentialsCollection = Backbone.Collection.extend({ model: Essential });
	var CategoriesCollection = Backbone.Collection.extend({ model: Category });
	var MediaCollection = Backbone.Collection.extend({ model: Media });
	var TimeCollection = Backbone.Collection.extend({ model: ViewTime });


	return Backbone.AssociatedModel.extend({

		relations: [
		  {
		    relatedModel: Tag,
		    type: Backbone.Many,
		    key: 'tags',
		    collectionType: TagsCollection
		  },
		  {
		    relatedModel: Author,
		    type: Backbone.Many,
		    key: 'authors',
		    collectionType: AuthorsCollection
		  },
		  {
		    relatedModel: Essential,
		    type: Backbone.Many,
		    key: 'essentials',
		    collectionType: EssentialsCollection
		  },
		  {
		    relatedModel: Category,
		    type: Backbone.Many,
		    key: 'categories',
		    collectionType: CategoriesCollection
		  },
		  {
		    relatedModel: Media,
		    type: Backbone.Many,
		    key: 'mediatypes',
		    collectionType: MediaCollection
		  },
		  {
		    relatedModel: ViewTime,
		    type: Backbone.Many,
		    key: 'viewtime',
		    collectionType: TimeCollection
		  }

		],

		defaults: {
			keywords: "",
			security: "",
			categories: [],
			tags: [],
			authors: [],
			essentials: [],
			mediatypes: [],
			viewtime: []
		},

		initialize: function() {
			this.set({
				keywords: "",
				security: "",

			});
		},

		parse: function(response) {

			this.get('tags').set(response.data.tags);
			this.get('authors').set(response.data.authors);
			this.get('categories').set(response.data.categories);
			this.get('essentials').set(response.data.essentials);
			this.get('viewtime').set(response.data.viewtime);
			this.get('mediatypes').set([{ id: 1, title: 'article' },{ id: 2, title: 'video' },{ id: 3, title: 'audio' },{ id: 4, title: 'download' },{ id: 5, title: 'podcast'},{id: 6, title: 'backstage'}]);

		},

		url: '/api/filters.json'

	});

});
