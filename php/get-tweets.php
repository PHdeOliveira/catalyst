
<?php

require_once("twitteroauth-master/twitteroauth/twitteroauth.php"); //Path to twitteroauth library
 
$twitteruser = "CatalystLeader";
$notweets = 8;
$consumerkey = "bPvvSHs35JWI9SlvUJ84Q";
$consumersecret = "d65u2W8nwSvmkOkkFQKmNGSFWWHEiOV2aalOW7s31M";
$accesstoken = "17952072-faR3g4EjzboyR1XllgrxnFMKQDxzFYCVyxhVinliw";
$accesstokensecret = "yHCPqCIfVuZrdv7hvBjb5PZmCflr1dPU2jIARJ2nWIw";
 
function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
  $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
  return $connection;
}
  
$connection = getConnectionWithAccessToken($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);
 
$tweets = $connection->get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=".$twitteruser."&count=".$notweets."&callback=listTweets");
 
echo json_encode($tweets);
?>
