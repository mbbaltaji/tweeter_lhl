/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {

  /**
   * Appends each new tweet at the top of page
   * @param {Object} tweets 
   */
  const renderTweets = function(tweets) {
    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $('#tweets-container').prepend($tweet);
    }
    //time stamp of when tweet was posted
    timeago.render(document.querySelectorAll('.dynamic-time'));
  };

  /**
   * Returns html <article> element containing all the content of a tweet
   * @param {Object} tweetData -
   * @returns {Object} $tweet - html article element with appended child children
   */
  const createTweetElement = function(tweetData) {
    const $article = $('<article>').addClass('tweet');
    const $tweetText = $('<p>').text(tweetData.content.text);
    
    //create the header and footer
    const $header = createHeader(tweetData.user.avatars, tweetData.user.name, tweetData.user.handle);
    const $footer = createFooter(tweetData.created_at).addClass('article-content');
    
    const $tweet = $article.append($header, $tweetText, $footer);
    return $tweet;
  };
    
  const $form = $('#tweet-form'); 
  // form submission handler (send tweets to server)
  $form.submit(function(e) {
    e.preventDefault();

    const serializedData = $(e.target).serialize();
    
    //validate tweet and make POST request to /tweets endpoint with serialized data
    if (validateTweet()) {
      $.post('/tweets', serializedData)
      .then(() => {  
        return $.get('/tweets'); // return a promise
    })
    .then((tweets) => { 
      const newestTweet = tweets[tweets.length - 1];  // newest tweet
      renderTweets([newestTweet]);
      $form.trigger('reset');
      $('.counter').text(140);  // reset char count 
    });
  };
});

// event handler to dynamically change char count as user is typing a tweet
  $('#tweet-text').on('input', function(e){
    const charCount = 140;
    const count = charCount - $(this).val().length;
    const output = $(this).next().children()[1]; // first child of the next element

    output.innerHTML = count;
    if (count < 0) {
      $(output).css('color', 'red');
    } else {
      $(output).css('color', 'grey');
    }
    validateTweet(true);
  });

  /** STRETCH **/

  // Slides tweet composer in and out of view using the arrow down button (top right)
  $('#arrow-down-btn').on('click', function(){
    $('.new-tweet').slideUp('slow');
    if ($('.new-tweet').is(':hidden')) {
      $('.new-tweet').slideDown('slow');
      $('#tweet-text').focus();
    }
  });

  // Shows back to top button when user scrolls down the page
  $(window).scroll((e) => {
    //e.preventDefault();
    const scrollTop = $(this).scrollTop();
    console.log(scrollTop);

    if (scrollTop >= 420) {
      $('nav').hide();
      $('#back-to-top').show();
    }else {
      $('nav').show();
      $('#back-to-top').hide();
    }
  });

  // navigates to top of the viewport and slides down new tweet textarea
  $('#back-to-top-btn').on('click', function (e){
    e.preventDefault();
    $(window).scrollTop(0);
    $('#tweet-text').focus();

    if ($('.new-tweet').is(':hidden')) {
      $('.new-tweet').slideDown('slow');
      $('#tweet-text').focus();
    }
  });

  /** HELPER FUNCTIONS **/

  /**
   * Creates a header for each tweet
   * @param {Object} avatars - avatar of each user
   * @param {String} name - name of user
   * @param {String} username - username of user
   * @returns {Object} $header - HTML <header> with appended child elements
   */
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

  /**
   * Creates a footer for each tweet
   * @param {Number} created_at - Unix Epoch time
   * @returns {Object} $footer - html <footer> with appended children 
   */
  const createFooter = function(created_at){
    const $footer = $('<footer>').addClass('article-content');
    const $timeStamp = $('<span>').addClass('dynamic-time').attr('datetime', created_at);
    const $span = $('<span>').addClass('icons');

    //icons
    const $flag = $('<i>').addClass('fa-solid fa-flag');
    const $retweet = $('<i>').addClass('fa-solid fa-retweet');
    const $heart = $('<i>').addClass('fa-solid fa-heart');

    $span.append($flag, $retweet, $heart);
    $footer.append($timeStamp, $span);

    return $footer;
  };

  // Creates custom div to display errors
  /**
   * Creates custom div to display errors
   * @returns {Object} $errorDiv - div that contains an error msg
   */
  const createErrorDiv = function() {
    const $errorDiv = $('<div>').attr('id', 'error-message');
    const $errorIcon = $('<i id="error-icon" class="fa-solid fa-triangle-exclamation"></i>')
    $errorDiv.append($errorIcon);
    return $errorDiv;
  };

  /**
   * Validates whether tweet text is empty or exceeds char limit
   * @param {Boolean} autoValidate 
   * @returns {Boolean} - True if tweet is valid false if not
   */
  const validateTweet = function(autoValidate = false) {
    const $tweetText = $('#tweet-text').val().trim();
    const $error = createErrorDiv();
    const $div = $('.new-tweet');
      
    $div.children('div').slideUp(1, function() {
      $(this).remove();
    });
  
    if ($tweetText.length > 140) {
      $error.text('⚠️ Exceeded the tweet limit. Please chill out! 😎');
      $div.prepend($error).slideDown('slow');
      return false;
    } else if (!$tweetText && !autoValidate) {
        $error.text('⚠️ Tweet field is empty, Try typing something next time 🙄');
        $div.prepend($error).slideDown('slow');
        return false;
      }
      return true;
    };
    
  // Loads all tweets already available in the db
  const loadTweets = function() {
    $.get('/tweets')
    .then( (tweets) => {
      renderTweets(tweets);
    });
  };
  
  loadTweets(); // load all tweets available in the mock db 
});