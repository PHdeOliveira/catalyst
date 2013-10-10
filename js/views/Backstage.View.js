// Filename: views/Backstage.View.js

define([
  'cat',
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'ev',
  'models/Filter',
  'collections/Pager',
  'views/Entry.PagedRowView'

], function(cat, $, _, Backbone, Marionette, ev, Filter, Pager, EntryPagedRowView){

  return Marionette.Layout.extend({

    // template: _.template( backstageTpl ),

    className: 'backstage',

    initialize: function(options) {

      this.options = options;
      this.template = options.template;

      _.bindAll(this,'backstageRow');

      cat.Collections.entriesByBackstage = new Pager();

      ev.vent.on('ustream:pause',this.pauseUstream,this);

      // Need to set this so that the single page view knows which route to return to
      cat.Options.backstage = true;
    },

    regions: {
      backstage_entries: '#backstage_entries'
    },


    events: {
      'click .cat_backstage_toggle': 'backstageToggle'
    },

    onRender: function(){
      var self = this;
      _.delay( function(){
        var UstreamEmbed = window.UstreamEmbed;
        self.USviewer = new UstreamEmbed('UstreamEmbedLIVE');
      },1000);
      // cat.Models.Filter.fetch({ success: this.backstageRow });
      this.backstageRow();
      this.$el.addClass('active basic_page');
    },

    onClose: function(){
      ev.vent.off('ustream:pause',this.pauseUstream,this);
      cat.Filter.mediaList = [];
      $('#main').removeClass('basic_page');
      cat.Options.backstage = false;
    },

    backstageToggle: function(vent){
      vent.preventDefault();
      //make the collapse content to be shown or hide
      var toggle_switch = $(vent.currentTarget);

      this.$("#collapse1").toggle(function(){
        if ($(this).css('display') === 'none') {
          //change the button label to be 'Show'
          toggle_switch.html('<span>SCHEDULE</span> +');
        } else {
          //change the button label to be 'Hide'
          toggle_switch.html('<span>SCHEDULE</span> -');
        }
      });
    },

    backstageRow: function () {
      cat.Models.Filter = new Filter();
      cat.Models.Filter.get('mediatypes').set({ id: 5, title: 'backstage', selected: true },{silent: true});

      cat.Filter.mediaList = ['backstage'];

      this.backstage_entries.show( new EntryPagedRowView({
        collection: cat.Collections.entriesByBackstage,
        filter: cat.Models.Filter,
        model: new Backbone.Model({
          orderField: 'entry_date',
          orderTitle: 'Catalyst Backstage',
          orderDir: 'asc'
        }),
        className: 'Backstage entry-row'
      }));
    },

    pauseUstream: function(){
      this.USviewer.callMethod('pause');
    }

  });

});