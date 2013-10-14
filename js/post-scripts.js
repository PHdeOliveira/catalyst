//Beta Branch


// Scripts for New Post Event Site

//Masonry Initialize

var container = document.querySelector('.masonry');

var msnry = new Masonry( container, {
  // options...
  itemSelector: '.item',
  columnWidth: 280,
  gutter: 4
});

$.ajax({
	type: 'POST',
	url: '/php/twitterAuth.php',
	datatype: 'jsonp',
	data: data,
	success: function(data) {
		console.log(data);
	}


});


document.querySelector('.twitter-container').hidden = true;

function twitterCall() {

 setTimeout(function(){

 	document.querySelector('.twitter-container').hidden = false;

 	var loader = document.getElementsByClassName('sm-twitter');
	var frame = document.getElementById('twitter-widget-0');
	var stream = frame.contentDocument.firstChild.children[1].children[0].children[2];
	var feed = stream.firstElementChild;
	var feedChildren = feed.children;
	var tweet;
	var tweetBody;

	var container = document.getElementsByClassName('twitter-container');
	var tweetResults = [];

	

	for (var i = 0; i < feedChildren.length; i++) {

		loader[i].firstElementChild.style.display = 'none';
		tweet = feedChildren[i];
		tweetBody = tweet.children[2];

		tweet.children[1].hidden = true;
		tweet.children[3].hidden = true;

		tweet.style.height = 156 + 'px';
		tweet.style.position = 'relative';
		tweet.style.boxSizing = 'border-box';
		tweet.firstElementChild.style.position = 'absolute';
		tweet.firstElementChild.style.right = 30 + 'px';
		tweet.firstElementChild.style.bottom = 20 + 'px';
		tweet.firstElementChild.setAttribute('class' , 'sm-date');

		tweetBody.style.padding = '25px 30px 26px';

		tweetBody.firstElementChild.style.color = '#fcfbf4';
		tweetBody.firstElementChild.style.fontSize = 11 +'px';
		tweetBody.firstElementChild.style.lineHeight = 13 + 'px';
		tweetBody.firstElementChild.style.fontFamily = 'Avenir, helvetica, arial, sans-serif';
		tweetBody.firstElementChild.style.fontWeight = 500;
		tweetBody.firstElementChild.style.margin = 0;

		// console.dir(tweetBody);

		tweetResults.push(tweet);
	
	}

	// console.log(container);

	for (var t = 0; t < container.length; t++) {

		tweetResults[t].setAttribute('class', 'h-entry with-expansion  customisable-border');
		
		container[t].replaceChild(tweetResults[t],container[t].firstElementChild);
	}

}, 700)

clearTimeout();

}

function vimeoLoad() {
	var vimeo = document.getElementById('vimeo-container');
	var vimeoFrame = document.createElement('iframe');

	vimeoFrame.src = '//player.vimeo.com/video/65696417';
	vimeoFrame.width = 564;
	vimeoFrame.height = 312;
	vimeoFrame.frameborder = 0;
	vimeoFrame.webkitallowfullscreen = true;
	vimeoFrame.mozallowfullscreen = true;
	vimeoFrame.allowfullscreen = true;

	// console.dir(vimeo);
	vimeo.appendChild(vimeoFrame);
}


function load() {
	twitterCall();
	vimeoLoad();
}

window.onload = load;








