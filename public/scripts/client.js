/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {

  //Appends each tweet article to to tweet <section id="tweet-container">
  const renderTweets = function(tweets) {
    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $('#tweets-container').prepend($tweet);
    }

    //time stamp of when tweet was posted
    timeago.render(document.querySelectorAll('.dynamic-time'));
  };

  // takes in tweet obj and returns tweet <article> element containing entire HTML structure of the tweet
  const createTweetElement = function(tweetData) {
    const $article = $('<article>').addClass('tweet');
    const $tweetText = $('<p>').text(tweetData.content.text);
    
    const $header = createHeader(tweetData.user.avatars, tweetData.user.name, tweetData.user.handle);
    const $footer = createFooter(tweetData.created_at).addClass('article-content');
    
    const $tweet = $article.append($header, $tweetText, $footer);
  
    return $tweet;
  };

  // form submission handler (send tweets to server)
  const $form = $('#tweet-form');
  $form.submit(function(e) {
   
    e.preventDefault();
    // required to send data to server
    const serializedData = $(e.target).serialize();
    
    //make post request to /tweets endpoint with serialized data (only if tweet is valid)
    if (validateTweet()) {
      $.post('/tweets', serializedData)
      .then(() => {  //then make a GET request to get all the posts in db and return a promise
        return $.get('/tweets');
    })
    .then((tweets) => { // then get the most recent tweet (last tweet) and render it 
      const newestTweet = tweets[tweets.length - 1];
      renderTweets([newestTweet]);
      // trigger a reset event on the form (to clear text from text area after tweeting)
      $form.trigger('reset');
    });
  }
});


  // HELPER FUNCTIONS

  // Creates a header for each tweet
  const createHeader = function(avatars, name, username){
    const $header = $('<header>').addClass('article-content');
    const $avatar = $('<img>').attr('src', avatars);
    const $name = $('<span>').text(name);
    const $span = $('<span>').attr('id', 'name');
    const $username = $('<span>').attr('id', 'username').text(username);

    $span.append($avatar, $name);
    $header.append($span, $username);

    return $header;
  }

  // creates a footer for each tweet
  const createFooter = function(created_at){
    const $footer = $('<footer>').addClass('article-content');
    const $timeStamp = $('<span>').addClass('dynamic-time').attr('datetime', created_at);
    const $span = $('<span>').addClass('icons');

    //icons
    const $flag = $('<i>').addClass('fa-solid fa-flag')
    const $retweet = $('<i>').addClass('fa-solid fa-retweet')
    const $heart = $('<i>').addClass('fa-solid fa-heart')

    $span.append($flag, $retweet, $heart);
    $footer.append($timeStamp, $span);

    return $footer;
  };

  // validates whether tweet text is empty or exceeds char limit
  const validateTweet = function() {
    const $tweetSize = $('#tweet-text').val();
    if ($tweetSize.length > 140) {
      $(alert('⛔️ Exceeded the tweet limit. Please chill out! 😎'));
      return false;
    } else if (!$tweetSize) {
      $(alert('⛔️ Tweet field is empty, Try typing something next time 🙄'));
      return false;
    }
    return true;
  };

  // Loads all tweets in the db
  const loadTweets = function() {
    $.get('/tweets')
    .then( (tweets) => {
      renderTweets(tweets);
    });
  };

  loadTweets(); // load all tweets available in the mock db
});

  





