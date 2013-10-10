// Filename: event-scripts.js

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
	'jquery.chosen',
	'jquery.socialist',
	'jquery.imagesloaded'
], function(cat, ev, $, Backbone, _){

	var screenSize = '';
	var screenType = '';
	var currentPage = '';

	/* Ready */

	$(function(){

		// Parallax Scrolling

		if(!cat.Options.mobile && cat.Options.screenType != 'desktop-small'){
			$.stellar({
				responsive: true
			});
		}


		$('#snapshot_content .snapshot_tab_btn').on('click',function( ev ){ switchSnapshot( ev ); });

		// Photos

		$('.event_photos, #photo_gallery').each(function(){
			var itemWidth = $('.event_photo:first', this).width();
			var itemCount = $('.event_photo', this).size();
			var wrapperWidth = itemWidth * itemCount;

			$('.event_photos_wrapper, .gallery_wrapper', this).css('width', wrapperWidth + 'px');
		});

		$('.photo_link').on('click', function(){
			var targetPhoto = $(this).attr('data-image');
			var targetContainer = $(this).closest('.event_photos').prev('.photo_holder');
			openPhoto(targetPhoto, targetContainer);
			return false;
		});

		$('.photo_holder .close_btn').on('click', function(){
			var targetContainer = $(this).closest('.photo_holder');
			closePhoto(targetContainer);
			return false;
		});

		$('.event_photos .slider_nav').on('click', function(){
			var targetContainer = $(this).closest('.event_photos');

			if($(this).hasClass('slider_nav_right')){
				slidePhotos(targetContainer, 'next');
			} else {
				slidePhotos(targetContainer, 'prev');
			}
			return false;
		});

		$('#photo_gallery .gallery_nav_btn').on('click', function(){
			if($(this).hasClass('gallery_nav_right')){
				slideGallery('next');
			} else {
				slideGallery('prev');
			}
			return false;
		});

		// Event Video

		$('#event_video_btn').on('click', function(){
			var targetVideo = $(this).attr('data-video');
			openVideo(targetVideo);
			return false;
		});

		$('#event_video_container .close_btn').on('click', function(){
			closeVideo();
			return false;
		});

		// Speaker Twitter

		// var currentHandle = $('#twitter_bubble').attr('data-twitter');

		// $('#twitter_content').socialist({
		// 	networks: [
		// 		//{name:'facebook',id:'CatalystLeader'},
		// 		{name:'twitter', id: currentHandle}
		// 	 ],
		// 	isotope:false,
		// 	random:false,
		// 	maxResults: 1,
		// 	fields:['text','date']
		// });

		// Speaker Sort Links

		$('.scroll_link').on('click', function(){
			var scrollTarget = $(this).attr('href');
			var offset = $('#header').height() - 1;

			pageScrollTo(scrollTarget, offset);
			return false;
		});

		// Show Header Social Links

		// $('.twitter-share-button').removeClass('hide');

		// Twitter Dropdown

		$('#event_dropdown span').on('click', function(){
			if($('#event_dropdown').hasClass('active')){
				$('#event_dropdown').removeClass('active');
				$('#event_dropdown .dropdown_list').css('display', 'none');
			} else {
				$('#event_dropdown').addClass('active');
				$('#event_dropdown .dropdown_list').css('display', 'block');
			}
		});

		$('#event_dropdown li').on('click', function(){
			var newText = $(this).text();
			var newClass = $(this).attr('class');

			$('#event_dropdown .selected').text(newText);
			$('#event_dropdown').removeClass().addClass(newClass);
			$('#event_dropdown .dropdown_list').css('display', 'none');

			$('#state4 select option').each(function(){
				if($(this).text() == newText){
					$(this).attr('selected', 'selected').siblings().removeAttr('selected');
					$('#state4 select').val($(this).val());
				}
			});

		});

		// Responsive Navigation

		$('#event_page #phone_nav').on('click', function(){
			var navHeight = $('#events_nav nav div').outerHeight();

			if($('#events_nav nav').hasClass('active')){
				$('#events_nav nav').removeClass('active');
				$('#events_nav nav').stop().dequeue().transition({
					height: 0
				}, 300, 'easeInOutQuad');
			} else {
				$('#events_nav nav').addClass('active');
				$('#events_nav nav').stop().dequeue().transition({
					height: navHeight + 'px'
				}, 300, 'easeInOutQuad');
			}
		});

	});

	function switchSnapshot( ev ) {
		ev.preventDefault();
		var clickTarget = $(ev.target).attr('data-target');
		$(ev.target).siblings().removeClass('active');
		$(ev.target).addClass('active');

		$(clickTarget).siblings().addClass('hidden');
		$(clickTarget).removeClass('hidden');
	}

	function pageScrollTo(target, offset) {
		var scrollTo = $(target).offset().top - offset;

		$('html, body').stop().dequeue().animate({
			scrollTop: scrollTo
		}, 500);
	}


	function openVideo(targetVideo){
		var headerSize = $('#header').height();
		var videoSize = $(window).width() * 0.5625;
		// var videoSize = $('#event_video_container .video_loader').height();
		var $container = $('#event_video_container');

		if(cat.Options.screenType == 'phone'){
			pageScrollTo('#event_video_container', 0);
		} else {
			pageScrollTo('#event_video_container', headerSize);
		}

		if(!$container.hasClass('active')){
			$container.addClass('active').stop().transition({
				height: videoSize + 'px'
			}, 400, 'easeInOutQuad', function(){

				$('.video_loader', $container).html('<iframe src="http://player.vimeo.com/video/' + targetVideo + '" width="320" height="240" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
				$('.video_loader', $container).addClass('loaded');
				$container.removeAttr('style');
			});
		}
	}

	function closeVideo(){
		var $container = $('#event_video_container');
		var videoSize = $container.height();

		$container.css('height', videoSize + 'px');

		$container.stop().transition({
			height: 0 + 'px'
		}, 400, 'easeInOutQuad', function(){
			$('.video_loader', $container).html('');
			$('.video_loader', $container).removeClass('loaded');
			$container.removeClass('active');
		});
	}

	function openPhoto(targetPhoto, targetContainer){
		var headerSize = $('#header').height();
		var sliderSize = $('.event_photos:first').height();
		var photoSize = '';

		if(cat.Options.screenType == 'phone'){
			photoSize = $(window).height() - sliderSize;
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

	var galleryIndex = 0;
	var photoIndex1 = 0;
	var photoIndex2 = 0;

	function slidePhotos(targetContainer, direction){
		var currentPos = parseInt($('.event_photos_wrapper', targetContainer).css('left'),10);
		var itemWidth = $('.event_photo:first', targetContainer).width();
		var itemCount = $('.event_photo', targetContainer).size();
		var currentIndex = '';
		var offset = 0;

		if(cat.Options.screenType == 'desktop-medium'){
			offset = 4;
		} else if(cat.Options.screenType == 'desktop-large'){
			offset = 5;
		} else {
			offset = 3;
		}

		if($(targetContainer).attr('id') == 'event_photos1'){
			currentIndex = photoIndex1;
		} else {
			currentIndex = photoIndex2;
		}

		if(direction == 'next' && currentIndex < (itemCount - offset)){
			currentIndex++;
			$('.event_photos_wrapper', targetContainer).transition({
				left: currentIndex * -(itemWidth) + 'px'
			}, 300, 'easeInOutQuad');
		}

		if(direction == 'prev' && currentIndex > 0){
			currentIndex--;
			$('.event_photos_wrapper', targetContainer).transition({
				left: currentIndex * -(itemWidth) + 'px'
			}, 300, 'easeInOutQuad');
		}

		if($(targetContainer).attr('id') == 'event_photos1'){
			photoIndex1 = currentIndex ;
		} else {
			photoIndex2 = currentIndex;
		}

	}

	function slideGallery(direction){
		var currentPos = parseInt($('#photo_gallery .gallery_wrapper').css('left'),10);
		var itemWidth = $('#photo_gallery .event_photo:first').width();
		var itemCount = $('#photo_gallery .event_photo').size();
		// var currentIndex = Math.abs(currentPos / itemWidth);

		if(direction == 'next' && galleryIndex < itemCount){
			galleryIndex++;
			$('#photo_gallery .gallery_wrapper').transition({
				left: galleryIndex * -(itemWidth) + 'px'
			}, 300, 'easeInOutQuad');
		}

		if(direction == 'prev' && galleryIndex > 0){
			galleryIndex--;
			$('#photo_gallery .gallery_wrapper').transition({
				left: galleryIndex * -(itemWidth) + 'px'
			}, 300, 'easeInOutQuad');
		}
	}

	// Facebook Like Button

	(function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0];
	  if (d.getElementById(id)) return;
	  js = d.createElement(s); js.id = id;
	  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
	  fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

	// Twitter Share Button

	(function(d,s,id){
		var js, fjs=d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js=d.createElement(s);
		js.id=id;
		js.src='//platform.twitter.com/widgets.js';
		fjs.parentNode.insertBefore(js,fjs);
	}(document, 'script', 'twitter-wjs'));

});



