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
      $('.counter').text(140); // reset char count (innerHTML element) after submitting tweet
    });
  }
});

  /** HELPER FUNCTIONS **/

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
    const $flag = $('<i>').addClass('fa-solid fa-flag');
    const $retweet = $('<i>').addClass('fa-solid fa-retweet');
    const $heart = $('<i>').addClass('fa-solid fa-heart');

    $span.append($flag, $retweet, $heart);
    $footer.append($timeStamp, $span);

    return $footer;
  };

  // Creates custom div to display errors
  const createErrorDiv = function() {
    const $errorDiv = $('<div>').attr('id', 'error-message');
    const $errorIcon = $('<i id="error-icon" class="fa-solid fa-triangle-exclamation"></i>')
    $errorDiv.append($errorIcon);
    return $errorDiv;
  };

    // event handler to dynamically change char count as user is typing
    $('#tweet-text').on('input', function(e){
      let charCount = 140;
      let count = charCount - $(this).val().length; //$(this).val stores the string val in the textarea el
      let output = $(this).next().children()[1];
  
      //.next gets the next sibling of an element
      // .children returns an array pf children
      output.innerHTML = count;
      if (count < 0) {
        $(output).css('color', 'red');
      } else {
        $(output).css('color', 'grey');
      }
      validateTweet(true);
    });
  
    // validates whether tweet text is empty or exceeds char limit
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
      } 
      else if (!$tweetText && !autoValidate) {
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

  //STRETCH
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
   if (scrollTop >= 475) {
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
});