class GetTweets {
    static public function get_most_recent($screen_name, $count, $retweets)
    {
        //codebird is going to be doing the oauth lifting for us
        require_once('codebird.php');
     
        //These are your keys/tokens/secrets provided by Twitter
        $CONSUMER_KEY = 'yourconsumerkey';
        $CONSUMER_SECRET = 'yourconsumersecret';
        $ACCESS_TOKEN = 'accesstoken';
        $ACCESS_TOKEN_SECRET = 'accesstokensecret';
     
        //Get authenticated
        \Codebird\Codebird::setConsumerKey($CONSUMER_KEY, $CONSUMER_SECRET);
         
        $cb = \Codebird\Codebird::getInstance();
        $cb->setToken($ACCESS_TOKEN, $ACCESS_TOKEN_SECRET);
         
        //These are our params passed in for our request to twitter
        //The GET request is made by our codebird instance for us further down
        $params = array(
            'screen_name' => $screen_name,
            'count' => $count,
            'include_rts' => $retweets,
        );
         
        //tweets returned by Twitter in JSON object format
        $tweets = (array) $cb->statuses_userTimeline($params);
         
        //Let's encode it for our JS/jQuery and return it
        return json_encode($tweets);
    }
 
}