/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

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
        <p>${tweetData.content.text}</p>
        <footer class="article-content">
        <span>${tweetData.created_at}</span>
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
  //renderTweets(data);

  const $form = $('#tweet-form');

  // form submission handler (send tweets to server)
  $form.submit( function(e)  {
    e.preventDefault();
    // required to send data to server
    const serializedData = $(e.target).serialize();
    
    //make post request to /tweets endpoint with serialized data
    $.post('/tweets', serializedData)
    .then( () => {
      return $.get('/tweets');
    })
    .then((tweets) => {
      const result = tweets[tweets.length - 1];
      renderTweets([result]);
      $form.trigger('reset');
    });
  });

  // Loads all tweets in the db
  const loadTweets = function () {
    $.get('/tweets')
    .then( (tweets) =>{
      renderTweets(tweets);
    });
  };
  loadTweets();
});

  





