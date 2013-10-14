<?php

function buildBaseString($baseURI, $method, $params) {
    $r = array();
    ksort($params);
    foreach($params as $key=>$value){
        $r[] = "$key=" . rawurlencode($value);
    }
    return $method."&" . rawurlencode($baseURI) . '&' . rawurlencode(implode('&', $r));
}

function buildAuthorizationHeader($oauth) {
    $r = 'Authorization: OAuth ';
    $values = array();
    foreach($oauth as $key=>$value)
        $values[] = "$key=\"" . rawurlencode($value) . "\"";
    $r .= implode(', ', $values);
    return $r;
}

$url = "https://api.twitter.com/1.1/statuses/user_timeline.json";

$oauth_access_token = "17952072-iJVdfsOa3d9WDqPfDCEB60JwWcd8GU2xKF1E1f676";
$oauth_access_token_secret = "SpzXpqz3k8uiyaD6MiqyB7YSU7tvumoxHTeFaENv1w";
$consumer_key = "0boIP4GDjUT0QqwT5e4w";
$consumer_secret = "yGSUyxq7COPuTJyzS5pmdLF3fvHbixGQt0pS0Xi0";


?>
