// Filename: cod-scripts.js

var Modernizr = Modernizr || {};


// General Functions
// ------------------

define([
	'cat',
	'ev',
	'jquery',
	'backbone',
	'underscore',
	'jquery.transit',
	'jquery.chosen',
	'jquery.stellar',
	'jquery.imagesloaded'
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
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	var mobile = false;
	var screenSize = '';
	var screenType = '';
	var currentPage = '';


	/* Ready */

	$(function(){

			cat.Options.pagePos = $(window).scrollTop();
			cat.Options.screenSize = $(window).width();

			codResponsive();

			// Parallax

			if(!cat.Options.mobile && cat.Options.screenType != 'desktop-small'){
				$.stellar({
					verticalOffset: 0,
					responsive: true
				});
			}

			$(window).resize(function(){
				cat.Options.screenSize = $(window).width();
				codResponsive();
			});

			// Photos

			$('.photo_slider').each(function(){
				var itemWidth = $('li:first', this).width();
				var itemCount = $('li', this).size();
				var wrapperWidth = itemWidth * itemCount;
				var displayCount = Math.floor(($(window).width() - 40) / itemWidth);
				var sliderWidth = displayCount * itemWidth;

				if(itemCount <= displayCount){
					$('.slider_nav').addClass('inactive');
					$('.slider', this).css('width', wrapperWidth + 'px');
				} else {
					$('.slider', this).css('width', sliderWidth + 'px');
				}

				$('ul', this).css('width', wrapperWidth + 'px');

			});

			$('.photo_slider li a').on('click', function(){
				var targetPhoto = $(this).attr('data-image');
				var targetContainer = $(this).closest('.photo_slider').prev('.photo_holder');
				openPhoto(targetPhoto, targetContainer);
				return false;
			});

			$('.photo_holder .close_btn').on('click', function(){
				var targetContainer = $(this).closest('.photo_holder');
				closePhoto(targetContainer);
				return false;
			});

			$('.photo_slider .slider_nav').on('click', function(){
				var targetContainer = $(this).closest('.photo_slider');

				if($(this).hasClass('slider_right')){
					slidePhotos(targetContainer, 'next');
				} else {
					slidePhotos(targetContainer, 'prev');
				}
				return false;
			});

			plotCodMap();

			$('.map_pin').on('mouseenter', function(){
				var targetItem = '#' + $(this).attr('data-target');

				$(targetItem).css({
					display: 'block'
				}).stop().dequeue().transition({
					opacity: 100
				}, 300);
			});

			$('.map_popup').on('mouseleave', function(){

				$(this).stop().dequeue().transition({
					opacity: 0
				}, 300, function(){
					$(this).css({
						display: 'none'
					});
				});
			});

			// Phone Nav

			$('#phone_nav').on('click', function(){
				var navHeight = $('#site_nav ul').outerHeight();

				if($('#site_nav').hasClass('active')){
					$('#site_nav').removeClass('active');
					$('#site_nav').stop().dequeue().transition({
						height: 0
					}, 300, 'easeInOutQuad');
				} else {
					$('#site_nav').addClass('active');
					$('#site_nav').stop().dequeue().transition({
						height: navHeight + 'px'
					}, 300, 'easeInOutQuad');
				}
			});

			if ($('body').attr('id') == 'cod_home') {

				$('.scroll_link_alt').on('click', function(){
					var scrollTarget = $(this).attr('data-target');
					var offset = $('#header').height()+1;

					pageScrollTo(scrollTarget, offset);
					return false;
				});
			}
	});

	/* Responsive Breakpoints */

	function codResponsive(){

		// Desktop Large
		if(cat.Options.screenSize >= 1200 && !cat.Options.mobile){
			if(cat.Options.screenType != 'desktop-large'){
				cat.Options.screenType = 'desktop-large';
				$('body').removeClass('desktop-medium desktop-medium-small desktop-small tablet phone').addClass(cat.Options.screenType);
				plotCodMap();
			}
		// Desktop Medium
		} else if(cat.Options.screenSize > 979 && cat.Options.screenSize < 1200 && !cat.Options.mobile){
			if(cat.Options.screenType != 'desktop-medium'){
				cat.Options.screenType = 'desktop-medium';
				$('body').removeClass('desktop-large desktop-medium-small desktop-small tablet phone').addClass(cat.Options.screenType);
				plotCodMap();
			}
		// Desktop Medium Small
		} else if(cat.Options.screenSize >= 768 && cat.Options.screenSize <= 979 && !cat.Options.mobile){
			if(cat.Options.screenType != 'desktop-medium-small'){
				cat.Options.screenType = 'desktop-medium-small';
				$('body').removeClass('desktop-large desktop-medium desktop-small tablet phone').addClass(cat.Options.screenType);
				plotCodMap();
			}
		// Desktop Small
		} else if(cat.Options.screenSize < 768 && !cat.Options.mobile){
			if(cat.Options.screenType != 'desktop-small'){
				cat.Options.screenType = 'desktop-small';
				$('body').removeClass('desktop-large desktop-medium desktop-medium-small tablet phone').addClass(cat.Options.screenType);
				plotCodMap();
			}
		// Tablet Size
		} else if(cat.Options.screenSize >= 768 && cat.Options.screenSize <= 1024 && cat.Options.mobile){
			if(cat.Options.screenType != 'tablet'){
				cat.Options.screenType = 'tablet';
				$('body').removeClass('desktop-large desktop-medium desktop-medium-small desktop-small phone').addClass(cat.Options.screenType);
				plotCodMap();
			}
		// Phone
		} else if (cat.Options.screenSize < 768 && cat.Options.mobile) {
			if (cat.Options.screenType != 'phone'){
				cat.Options.screenType = 'phone';
				$('body').removeClass('desktop-large desktop-medium desktop-medium-small desktop-small tablet').addClass(cat.Options.screenType);
				plotCodMap();
			}
		}
	}

	// Equal Heights for Columns

	var currentTallest = 0,
     currentRowStart = 0,
     rowDivs = [],
     $el,
     topPosition = 0;

	$('.block').each(function() {

		var i = 0,
				j = 0;

	  $el = $(this);
	  topPosition = $el.position().top;

	  if (currentRowStart != topPosition) {

	    // we just came to a new row.  Set all the heights on the completed row
	    for (i; i < rowDivs.length; i++) {
	      rowDivs[i].outerHeight(currentTallest);
	    }

	    // set the variables for the new row
	    rowDivs.length = 0; // empty the array
	    currentRowStart = topPosition;
	    currentTallest = $el.outerHeight();
	    rowDivs.push($el);

	  } else {

	    // another div on the current row.  Add it to the list and check if it's taller
	    rowDivs.push($el);
	    currentTallest = (currentTallest < $el.outerHeight()) ? ($el.outerHeight()) : (currentTallest);

	  }

	  // do the last row
	  for (j; j < rowDivs.length; j++) {
	    rowDivs[j].outerHeight(currentTallest);
	  }

	});

	function openPhoto(targetPhoto, targetContainer){
		var headerSize = $('#header').height();
		var sliderSize = $('.photo_slider').outerHeight();
		var photoSize = '';

		if(cat.Options.screenType == 'phone'){
			photoSize = $(window).height() + 60 - sliderSize;
			pageScrollTo(targetContainer, 0);
		} else {
			photoSize = $(window).height() - headerSize - sliderSize;
			pageScrollTo(targetContainer, headerSize);
		}

		if($(targetContainer).hasClass('active')){
			$('.photo_loader', targetContainer).removeClass('loaded');

			setTimeout(function(){
				$('.photo_loader', targetContainer).html('<img src="' + targetPhoto + '">');
				$('.photo_loader', targetContainer).imagesLoaded(function(){
					$('.photo_loader', targetContainer).addClass('loaded');
				});
			}, 500);

		} else {

			$(targetContainer).addClass('active').stop().transition({
				height: photoSize + 'px'
			}, 400, 'easeInOutQuad', function(){
				$('.photo_loader', targetContainer).html('<img src="' + targetPhoto + '">');
				$('.photo_loader', targetContainer).imagesLoaded(function(){
					$(this).addClass('loaded');
				});
			});
		}
	}

	function closePhoto(targetContainer){
		$(targetContainer).stop().transition({
			height:0 + 'px'
		}, 400, 'easeInOutQuad', function(){
			$('.photo_loader', targetContainer).html('');
			$('.photo_loader', targetContainer).removeClass('loaded');
			$(targetContainer).removeClass('active');
		});
	}

	function slidePhotos(targetContainer, direction){
		var currentPos = parseInt($('ul', targetContainer).css('left'),10);
		var itemWidth = $('li:first', targetContainer).width();
		var itemCount = $('li', targetContainer).size();
		var currentIndex = -1 * (parseInt($('ul', targetContainer).css('left'),10) / itemWidth);
		var offset = Math.floor(($(window).width() - 40) / itemWidth);

		// if(cat.Options.screenType == 'desktop-medium'){
		// 	offset = 4;
		// } else if(cat.Options.screenType == 'desktop-large'){
		// 	offset = 5;
		// } else {
		// 	offset = 3;
		// }

		if(direction == 'next' && currentIndex < (itemCount - offset)){
			currentIndex++;
			$('ul', targetContainer).transition({
				left: currentIndex * -(itemWidth) + 'px'
			}, 300, 'easeInOutQuad');
		}

		if(direction == 'prev' && currentIndex > 0){
			currentIndex--;
			$('ul', targetContainer).transition({
				left: currentIndex * -(itemWidth) + 'px'
			}, 300, 'easeInOutQuad');
		}

	}

	function pageScrollTo(target, offset) {
		var scrollTo = $(target).offset().top - offset;

		$('html, body').stop().dequeue().animate({
			scrollTop: scrollTo
		}, 500);
	}


	function plotCodMap(){

		$('#map').addClass('loaded');

		$('#map .map_pin').each(function(i){
			var lat = $(this).attr('data-latitude');
			var lng = $(this).attr('data-longitude');
			var $mapPin = $(this);
			var pinTarget = '#' + $(this).attr('data-target');
			var pinLabel = '#' + $(this).attr('data-label');
			var popupSize = $('.map_popup:first').outerWidth();
			var offsetX = parseFloat($(this).attr('data-offset-x'));
			var offsetY = parseFloat($(this).attr('data-offset-y'));

			cat.Options.latArray.push($(this).attr('data-latitude'));
			cat.Options.lngArray.push($(this).attr('data-longitude'));
			cat.Options.eventArray.push($(this).attr('id'));

			var pinTop = yLatToPixel(lat, $('#map img'));
			var pinLeft = xLngToPixel(lng, $('#map img'));

			if(lng < -100){
				$(pinTarget).addClass('flip');

				$(pinTarget).css({
					left: pinLeft + offsetX + 30 + 'px'
				});
			} else {
				$(pinTarget).css({
					left: pinLeft + offsetX - popupSize - 30 + 'px'
				});
			}

			if(lat < 33){
				$(pinTarget).addClass('flop');

				$(pinTarget).css({
					top: pinTop + offsetY - 127 + 'px',
				});
			} else {
				$(pinTarget).css({
					top: pinTop + offsetY - 27 + 'px',
				});
			}

			$(pinLabel).css({
				top: pinTop + offsetY + 'px',
				left: pinLeft + offsetX + 'px'
			});

			$mapPin.css({
				top: pinTop + offsetY + 'px',
				left: pinLeft + offsetX + 'px'
			});

			$mapPin.delay(200 * i).transition({
				opacity: 100,
				y: '20px'
			}, 200, 'easeInQuad');

			$(pinLabel).delay(200 * i).transition({
				opacity: 100
			}, 200, 'easeInQuad');

		});

	}

	function yLatToPixel( lat, elem ){
		var containerHeight = $(elem).height();
		var calculatedHeight = (((parseInt(lat,10) - 24 )	* containerHeight) / 24);
		return $(elem).height() - calculatedHeight;
	}

	function xLngToPixel( lng, elem ){
		var containerWidth = ($(elem).width());
		var offset = ( (parseInt(lng,10) + 65) * -containerWidth) / 60;
		return $(elem).width() - offset;
	}

});



