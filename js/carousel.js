/* ==========================================================
 * Hammer.js Carousel
 * ========================================================== */

(function($) {

  var methods = {

    init: function( options ) {

      return this.each(function(){

        methods.setPaneDimensions;
        $(window).bind('load resize orientationchange', methods.setPaneDimensions);

      });

    },

    next: function() {

      return this.showPane(this.$element.current_pane + 1, true);

    },

    prev: function() {

      return this.showPane(this.$element.current_pane - 1, true);

    },

    setPaneDimensions: function() {

      this.pane_width = $('.slide_item:first', this).width();
      this.pane_width_percent = Math.floor((this.screenSize / this.pane_width) * 100);
      this.container.width(this.pane_width * this.pane_count);

    },

    showPane: function( index ) {

      index = Math.max(0, Math.min(index, this.pane_count - 1));
      this.current_pane = index;

      var offset = -((100 / this.pane_count) * this.current_pane);
      this.setContainerOffset(this.offset, true);

    },

    setContainerOffset: function( percent, animate ) {

      this.container.removeClass('animate');

      if(animate) {
          this.container.addClass('animate');
      }

      if(Modernizr.csstransforms3d) {
          this.container.css('transform', 'translate3d(' + percent + '%,0,0) scale3d(1,1,1)');
      } else if(Modernizr.csstransforms) {
          this.container.css('transform', 'translate(' + percent + '%,0)');
      } else {
          var px = ((this.pane_width * this.pane_count) / 100) * this.percent;
          this.container.css('left', px + 'px');
      }

    },

    handleHammer: function(ev) {
      // disable browser scrolling
      ev.gesture.preventDefault();

      switch(ev.type) {

        case 'dragright':
        case 'dragleft':
          // stick to the finger
          var pane_offset = -(100 / this.pane_count) * this.current_pane;
          var drag_offset = ((100 / this.pane_width) * ev.gesture.deltaX) / this.pane_count;

          // slow down at the first and last pane
          if((this.current_pane == 0 && ev.gesture.direction == Hammer.DIRECTION_RIGHT) ||
            (this.current_pane == this.pane_count - 1 && ev.gesture.direction == Hammer.DIRECTION_LEFT)) {
            drag_offset *= .4;
          }

          this.setContainerOffset(drag_offset + this.pane_offset);
          break;

        case 'swipeleft':

          this.next;
          ev.gesture.stopDetect();
          break;

        case 'swiperight':

          this.prev;
          ev.gesture.stopDetect();
          break;

        case 'release':

          // more then 50% moved, navigate
          if(Math.abs(ev.gesture.deltaX) > this.pane_width / 2) {
            if(ev.gesture.direction == 'right') {
                this.prev;
            } else {
                this.next;
            }
          } else {
            this.showPane(this.current_pane, true);
          }
          break;
      }
    }

  };

  $.fn.hammerCarousel = function( method ) {

    // Defaults

    var settings = $.extend( {

        'container': '.slide_wrapper',
        'panes': '.slide_item',
        'pane_width': 0,
        'pane_width_percent': 0,
        'pane_count': this.panes.length,
        'current_pane':  0,
        'screenSize': $(window).width()

    }, options);

    return this.hammer({
      drag_lock_to_axis: true
    }).bind('release dragleft dragright swipeleft swiperight', handleHammer);

  };

})(window.jQuery);