//Tweets


var url = "https://api.twitter.com/1.1/statuses/user_timeline.json";
var data = "?count=2&screen_name=twitterapi";

$.ajax({
	type: 'GET',
	url: url + data,
	datatype: 'jsonp'
	jsonpCallback: 'getTweets'


});

function getTweets(r) {

	console.log(r);
}
