<?php
//We use already made Twitter OAuth library
//https://github.com/mynetx/codebird-php
require_once ('codebird.php');

//Twitter OAuth Settings
$CONSUMER_KEY = 'bPvvSHs35JWI9SlvUJ84Q';
$CONSUMER_SECRET = 'd65u2W8nwSvmkOkkFQKmNGSFWWHEiOV2aalOW7s31M';
$ACCESS_TOKEN = '17952072-faR3g4EjzboyR1XllgrxnFMKQDxzFYCVyxhVinliw';
$ACCESS_TOKEN_SECRET = 'yHCPqCIfVuZrdv7hvBjb5PZmCflr1dPU2jIARJ2nWIw';

//Get authenticated
Codebird\Codebird::setConsumerKey($CONSUMER_KEY, $CONSUMER_SECRET);
$cb = Codebird\Codebird::getInstance();
$cb->setToken($ACCESS_TOKEN, $ACCESS_TOKEN_SECRET);

//retrieve posts
$q = $_POST['q'];
$count = $_POST['count'];
$api = $_POST['api'];

//https://dev.twitter.com/docs/api/1.1/get/statuses/user_timeline
//https://dev.twitter.com/docs/api/1.1/get/search/tweets
$params = array(
'screen_name' => $q,
'q' => $q,
'count' => $count
);

//Make the REST call
$data = (array) $cb->$api($params);

//Output result in JSON, getting it ready for jQuery to process
echo json_encode($data);

?>