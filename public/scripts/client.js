/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

$(document).ready(function() {
  
  //Appends each tweet article to to tweet <section id="tweet-container">
  const renderTweets = function(tweets) {
    for (const tweet of tweets) {
      console.log(tweet);
      const $tweet = createTweetElement(tweet);
      $('#tweets-container').prepend($tweet);
    }
  };

  // takes in tweet obj and returns tweet <article> element containing entire HTML structure of the tweet
  const createTweetElement = function(tweetData) {
    
    const $tweet =
      `
      <article class="tweet">
        <header class="article-content">
          <span id="name">
          <img src="${tweetData.user.avatars}">
          <span> ${tweetData.user.name}</span>
          </span>
          <span id="username">${tweetData.user.handle}</span>
        </header>
        <p>${escape(tweetData.content.text)}</p>
        <footer class="article-content">
        <span>${timeago.format(new Date())}</span>
          <span class="icons">
            <i class="fa-solid fa-flag"></i>
            <i class="fa-solid fa-retweet"></i>
            <i class="fa-solid fa-heart"></i>
          </span>
        </footer>
      </article>
      `;
    return $tweet;
  };

  

  const $form = $('#tweet-form');

  // form submission handler (send tweets to server)
  $form.submit( function(e)  {
    
    e.preventDefault();
  
    // required to send data to server
    const serializedData = $(e.target).serialize();
    
    //make post request to /tweets endpoint with serialized data (only if tweet is valid)
    if (validateTweet()) {
    $.post('/tweets', serializedData)
    .then( () => {  //then make a GET request to get all the posts in db and return a promise
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

  // Loads all tweets in the db
  const loadTweets = function () {
    $.get('/tweets')
    .then( (tweets) =>{
      renderTweets(tweets);
    });
  };
  // load all tweets available in the mock db
  loadTweets();

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
  }
  

  

});

  





