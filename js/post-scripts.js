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

$(function() {

    $.getJSON('http://catalyst.playitbypixels.com/php/get-tweets.php', function(data) {
        var tweets = [];
        var twitterContainer = [];
        $.each(data, function(key, val) {
            tweets.push(val);
        });

        $('.twitter-container').each(function() {
            twitterContainer.push($(this));
        });
        for (var i = 0; i < tweets.length; i++) {
            var text = tweets[i].text;
            var date = tweets[i].created_at;
            //Parse URLs 
            text = text.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(u) {
                var url = u.link(u);
                return url;
            });
            //Parse @mentions
            text = text.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
                var item = u.replace('@', '')
                var mentions = u.link('https://twitter.com/' + item);
                return mentions;
            });
            //Parse #hashtags
            text = text.replace(/[#]+[A-Za-z0-9-_]+/g, function(u) {
                var item = u.replace('#', '')
                var hashtags = u.link('https://twitter.com/search?q=%23' + item + '&src=hash');
                return hashtags;
            });

            //Parse Date

            var date_split = date.split(' ');
            date = date_split[1] + " " + date_split[2] + ", " + date_split[5] + " " + date_split[3];

            var parsed_date = Date.parse(date);

            var relative_to = (parsed_date.length > 1) ? parsed_date[1] : new Date();

            console.log(relative_to);

            var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);

            console.log(delta);

            delta = delta + (relative_to.getTimezoneOffset() * 60);

            var r = '';
            if (delta < 60) {
                r = 'a minute ago';
            } else if (delta < 120) {
                r = 'couple of minutes ago';
            } else if (delta < (45 * 60)) {
                r = (parseInt(delta / 60)).toString() + ' minutes ago';
            } else if (delta < (90 * 60)) {
                r = 'an hour ago';
            } else if (delta < (24 * 60 * 60)) {
                r = '' + (parseInt(delta / 3600)).toString() + ' hours ago';
            } else if (delta < (48 * 60 * 60)) {
                r = '1 day ago';
            } else {
                r = (parseInt(delta / 86400)).toString() + ' days ago';
            }

            return r;

            twitterContainer[i].prepend('<p class="sm-text">' + text + '</p><span>' + date + '</span>');
        }
    }).done(function() {
        $('.the-icons').hide();
        $('.twitter-container').show();

    });

    vimeoLoad();


});

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


// function load() {
//     listTweets();
//     // twitterCall();
//     // vimeoLoad();

// }

// window.onload = load;