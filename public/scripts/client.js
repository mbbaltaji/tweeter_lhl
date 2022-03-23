/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Fake data taken from initial-tweets.json
const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png"
      ,
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  }
];


$(document).ready(function() {

  //Appends each tweet article to to tweet <section id="tweet-container">
  const renderTweets = function(tweets) {
    for (const tweet of tweets) {
      console.log(tweet);
      let $tweet = createTweetElement(tweet);
      $('#tweets-container').append($tweet);
    }
  };

  // takes in tweet obj and returns tweet <article> element containing entire HTML structure of the tweet
  const createTweetElement = function(tweetData) {
    let $tweet =
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
  renderTweets(data);
});

  





