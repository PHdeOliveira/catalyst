//Tweets


function getTweets() {

	var url = "https://api.twitter.com/1.1/statuses/user_timeline.json";
	var data = "count=2&screen_name=twitterapi";

	$.ajax({
		type: 'GET',
		url: url,
		data: data,
		success: function(feed) {
			document.write(feed);
		},

		datatype: 'jsonp'

		});


}

console.log(getTweets());