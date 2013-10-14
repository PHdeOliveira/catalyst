//Tweets


function getTweets() {

	var url = "https://api.twitter.com/1.1/statuses/user_timeline.json";
	var data = "?count=2&screen_name=twitterapi";

	$.ajax({
		type: 'GET',
		url: url + data,
		success: function(data, textStatus, xhr) {
			document.write(data, textStatus, xhr);
		},

		datatype: 'jsonp'

		});


}

console.log(getTweets());