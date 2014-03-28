// Scripts for New Post Event Site

//Masonry Initialize

var container = document.querySelector('.masonry');

var msnry = new Masonry(container, {
    // options...
    itemSelector: '.item',
    columnWidth: 280,
    gutter: 4
});



$('.twitter-container').hide();



function listTweets() {

    var twitterContainer = $('.twitter-container');
    var i = 0;

    $.getJSON('http://catalyst.playitbypixels.com/php/get-tweets.php', function(data) {
        var tweets = [];
        $.each(data, function(key, val) {
            tweets.push(val);

            twitterContainer.prepend('<p>' + val[key].text + '</p>');

            // console.log(val);




        });

        twitterContainer.each(function() {
            count++;



            // tweets.text.prepend(twitterContainer);
        })


    });

}

function twitterCall() {

    setTimeout(function() {


        var container = $('.twitter-container');
        container.show();
        var loader = $('.sm-twitter');
        var t = 0;
        var frame = $('#twitter-widget-0');
        var stream = frame.contents().find('.stream');;
        var feed = stream.children().first();
        var feedChildren = feed.children();
        var tweet;
        var tweetBody;
        var tweetResults = [];

        feedChildren.each(function() {
            loader.children('.the-icons').hide();
            tweet = $(this);

            tweet.children('.header').children('.h-card').hide();
            tweet.css({
                'height': '156px',
                'position': 'relative',
                'box-sizing': 'border-box'
            });

            tweet.children('.header').children().first().addClass('sm-date');

            tweet.children('.footer').hide();

            tweet.children('.e-entry-content').children().first().addClass('sm-text');
            tweet.children('.e-entry-content').children('.retweet-credit').css({
                'padding': '10px 30px 0'
            });

            tweet.removeClass('tweet');

            tweetResults.push(tweet);

        });

        container.each(function() {

            t++;
            $(this).children().replaceWith(tweetResults[t]);

        });


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
    listTweets();
    // twitterCall();
    // vimeoLoad();

}

window.onload = load;