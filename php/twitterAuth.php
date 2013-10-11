<?php
//We use already made Twitter OAuth library
//https://github.com/mynetx/codebird-php
require_once ('codebird.php');

//Twitter OAuth Settings
$CONSUMER_KEY = '0boIP4GDjUT0QqwT5e4w';
$CONSUMER_SECRET = 'yGSUyxq7COPuTJyzS5pmdLF3fvHbixGQt0pS0Xi0';
$ACCESS_TOKEN = '17952072-u3Ix12de1Y6rS1Xp2NXKOI04PSODvp3N13BfZllDK';
$ACCESS_TOKEN_SECRET = 'mAEiPjuTF2dPo5RviTzhvtDhAZ2eXQHVSpIFqnH2Bc';

//Get authenticated
\Codebird\Codebird::setConsumerKey($CONSUMER_KEY, $CONSUMER_SECRET);
$cb = \Codebird\Codebird::getInstance();
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