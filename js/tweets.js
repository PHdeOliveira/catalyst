//Tweets

$.ajax({
	type: 'POST',
	url: 'https://api.twitter.com/1.1/statuses/user_timeline.json',
	datatype: 'jsonp',
	jsonpCallback: 'getTweets',
	success: function(data) {
		console.log(data);
	}


});

