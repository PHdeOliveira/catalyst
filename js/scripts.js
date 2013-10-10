// Filename: scripts.js

var Modernizr = Modernizr || {};

// General Functions
// ------------------

define([
  'cat',
  'ev',
  'jquery',
  'backbone',
  'underscore',
  'jquery.textfill',
  'jquery.transit',
  'jquery.chosen'
], function(cat, ev, $, Backbone, _){

  /* Detect Device */

  var isMobile = {
    Android: function() {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
      return navigator.userAgent.match(/IEcat.Options.mobile/i);
    },
    any: function() {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
  };


  /* Ready */

  $(function(){

    // First Functions
    cat.Options.currentPage = $('body').attr('id');

    if(isMobile.any()){
      cat.Options.mobile = true;
      $('html').addClass('mobile');
    }

    if(cat.Options.mobile && $(window).width() < 768){
      cat.Options.phone = true;
      $('html').addClass('phone');
    }

    if(cat.Options.mobile && $(window).width() >= 768){
      cat.Options.tablet = true;
      $('html').addClass('tablet');
    }

    cat.Options.pagePos = $(window).scrollTop();
    cat.Options.screenSize = $(window).width();

    responsive();

    // Window Resize

    $(window).resize(function(){
      cat.Options.screenSize = $(window).width();
      responsive();
      ev.vent.trigger('resized');
    });


    // Scrolling

    var updatePosition = function(){
      cat.Options.pagePos = $(window).scrollTop();
      ev.vent.trigger('scroll',cat.Options.pagePos);
    };

    var scrollBuffer = _.throttle(updatePosition, 16);

    $(window).scroll(scrollBuffer);



    // Navigation

    var routeCheck = function(href,routes) {
      if (!href || !routes) return;
      // takes a href and does a lookup on a router object
      href = href.replace(/\/$/, "");
      var segment = href.substr(href.lastIndexOf('/') + 1);
      var pattern = new RegExp(segment,'i');
      var route = _.find(routes,function(val,key){
        if (val === 'atlanta' || val === 'dallas' || val === 'westcoast') return;
        return pattern.test(key);
      });
      return route;
    };



    $('#header_logo').on('click', function(vent){
      vent.preventDefault();

      var path = routeCheck(window.location.pathname,cat.router.routes);

      if (cat.Options.phone) $('#phone_nav').trigger('click');

      if (cat.app.single.currentView) {
        cat.app.single.currentView.slideDown();
      } else if (window.location.pathname !== '/' && path) {
        cat.router.navigate('/', { trigger: true });
      } else if (window.location.pathname !== '/' && !path) {
        window.location = '/';
      } else {
        pageScrollTo('#home', 108);
      }
    });


    $('.main_nav_btn a').on('click', function(vent){
      vent.preventDefault();
      var target = $(vent.currentTarget);
      var href = $(vent.currentTarget).attr('href');

      // Check to make sure our route actually exist in backbone
      var route = routeCheck(href,cat.router.routes);

      // Check our current path to see if we're in an existing Backbone
      // route or a Standard EE page.  In order to trigger a new BB route
      // - we need to already "be in" the app
      var path = routeCheck(window.location.pathname,cat.router.routes);

      if (route && path) {
        $('body').scrollTop(0);
        $('#header').trigger('click');
        if (cat.Options.phone) $('#phone_nav').trigger('click');
        cat.router.navigate( href, { trigger: true } );
      } else {
        window.location = href;
      }

    });


    // Dropdown Subnav

    if(cat.Options.mobile){

      if(cat.Options.tablet){
        $('#tablet_menu').on('click', function(vent){
          $('#header').toggleClass('active');
          vent.stopPropagation();
        });
        $('#main_nav ul, #main_nav li a').on('click',function(vent){
          vent.stopPropagation();
        });
        $('#header').on('click', function(){
          $(this).toggleClass('active');
        });
      }

      if(cat.Options.phone){

        // Responsive Navigation
        $('#phone_nav').on('click', function(){
          var navHeight = $('#main_nav #navwrap').outerHeight() + 30;

          if($('#main_nav').hasClass('active')){
            $('#main_nav').removeClass('active');
            $('#main_nav').stop().dequeue().transition({
              height: 0
            }, 300, 'easeInOutQuad');
          } else {
            $('#main_nav').addClass('active');
            $('#main_nav').stop().dequeue().transition({
              height: navHeight + 'px'
            }, 300, 'easeInOutQuad');
          }
        });

        $('.show-sub-btn').on('click', function( vent ){
          vent.preventDefault();
          $(this).siblings('ul').toggleClass('active');
          $(this).parents('li').siblings().find('ul').removeClass('active');
          $(this).parents('li').siblings().find('.show-sub-btn').text('+');

          if($(this).text() == '+'){
            $(this).text('–');
          } else {
            $(this).text('+');
          }
        });
      }

    } else {

      var t;
      // var menuHeight = $('#main_nav ul li ul').height() + 120;

      $('#header').on('mouseenter', function(){
        var self = this;
        t = setTimeout(function(){ $(self).addClass('active'); },280);
      });

      $('#header').on('mouseleave', function(){
        clearTimeout(t);
        $(this).removeClass('active');
      });

      $('#main_nav ul, #main_nav li a').on('click',function(vent){
        vent.stopPropagation();
      });

      $('#header').on('click', function(){
        $(this).toggleClass('active');
      });
    }





    $('#login_btn a').on('click', function(){
      var btnWidth = $(this).outerWidth();
      var arrowWidth = $('.nav_arrow').width();
      var offset = (arrowWidth / 2) - (btnWidth / 2);
      var newArrowPos = $(this).position().left - offset;

      if($(this).parent().hasClass('logged_in')){
        pageScrollTo('#home', 108);
        // bannerScroll('#account');

        $(this).parent().siblings().removeClass('active');
        $('.nav_arrow').css('display', 'block').stop().dequeue().transition({
          x: newArrowPos + 'px'
        }, 200, 'easeInOutQuad');
      } else {
        openLogin();
      }
      return false;
    });


    // Bios

    $('.team_entry').on('click', function(){
      var bioHTML = $('.team_detail', this).html();
      var $targetContainer = $(this).closest('.row').find('.bio_container');

      if(!$targetContainer.hasClass('active')){
        $('.bio_container').each(function(){
          $(this).stop().dequeue().transition({
            height: 0 + 'px'
          }, 300, 'easeInOutQuad', function(){
            $(this).removeClass('active');
          });
        });
        $targetContainer.addClass('active');
      }

      $targetContainer.html(bioHTML);

      var bioHeight = $targetContainer.find('.span8').outerHeight();

      $targetContainer.stop().dequeue().transition({
        height: bioHeight + 'px'
      }, 300, 'easeInOutQuad');
    });


  });

  /* Responsive Breakpoints */

  function responsive(){

    // Desktop Large
    if(cat.Options.screenSize >= 1200 && !cat.Options.mobile){
      if(cat.Options.screenType != 'desktop-large'){
        cat.Options.screenType = 'desktop-large';
        $('body').removeClass('desktop-medium desktop-medium-small desktop-small tablet phone').addClass(cat.Options.screenType);
      }
    // Desktop Medium
    } else if(cat.Options.screenSize > 979 && cat.Options.screenSize < 1200 && !cat.Options.mobile){
      if(cat.Options.screenType != 'desktop-medium'){
        cat.Options.screenType = 'desktop-medium';
        $('body').removeClass('desktop-large desktop-medium-small desktop-small tablet phone').addClass(cat.Options.screenType);
      }
    // Desktop Medium Small
    } else if(cat.Options.screenSize >= 768 && cat.Options.screenSize <= 979 && !cat.Options.mobile){
      if(cat.Options.screenType != 'desktop-medium-small'){
        cat.Options.screenType = 'desktop-medium-small';
        $('body').removeClass('desktop-large desktop-medium desktop-small tablet phone').addClass(cat.Options.screenType);
      }
    // Desktop Small
    } else if(cat.Options.screenSize < 768 && !cat.Options.mobile){
      if(cat.Options.screenType != 'desktop-small'){
        cat.Options.screenType = 'desktop-small';
        $('body').removeClass('desktop-large desktop-medium desktop-medium-small tablet phone').addClass(cat.Options.screenType);
      }
    // Tablet Size
    } else if(cat.Options.screenSize >= 768 && cat.Options.screenSize <= 1024 && cat.Options.mobile){
      if(cat.Options.screenType != 'tablet'){
        cat.Options.screenType = 'tablet';
        $('body').removeClass('desktop-large desktop-medium desktop-medium-small desktop-small phone').addClass(cat.Options.screenType);
      }
    // Phone
    } else if (cat.Options.screenSize < 768 && cat.Options.mobile) {
      if (cat.Options.screenType != 'phone'){
        cat.Options.screenType = 'phone';
        $('body').removeClass('desktop-large desktop-medium desktop-medium-small desktop-small tablet').addClass(cat.Options.screenType);
      }
    }

  }



  function pageScrollTo(target, offset) {
    if (!target) { return; }

    var scrollTo = $(target).offset().top - offset;

    $('html, body').stop().dequeue().animate({
      scrollTop: scrollTo
    }, 500);
  }


  function openLogin(){
    // var loginHeight = $('#login_form .container').height();
    if($('#login_form').hasClass('active')){
      $('#login_form').stop().dequeue().transition({
        opacity: 0
      }, 200, 'easeOutExpo', function(){
        $(this).removeClass('active');
      });
      if(!cat.Options.phone){
        $('#main_nav ul ul').css('display', 'block').stop().dequeue().transition({
          opacity: 100
        }, 200);
      }
    } else {
      $('#login_form').addClass('active').stop().dequeue().transition({
        opacity: 100
      }, 200);
      if(!cat.Options.phone){
        $('#main_nav ul ul').stop().dequeue().transition({
          opacity: 0
        }, 200, function(){
          $('#main_nav ul ul').css('display', 'none');
        });
      }
    }
  }


  String.prototype.parseHashtag = function() {
    return this.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
      var tag = t.replace("#","%23");
      return t.link("http://search.twitter.com/search?q="+tag);
    });
  };

  String.prototype.parseUsername = function() {
    return this.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
      var username = u.replace("@","");
      return u.link("http://twitter.com/"+username);
    });
  };

  String.prototype.parseURL = function() {
    return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
      return url.link(url);
    });
  };

});