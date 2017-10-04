function randomQuote(){

  quotes = ["I want to believe, but the government tells me not to, so I don't",
    "Morality as simple as the flick of a switch"];

  var mainQuote = document.getElementById('mainQuote');
  var quote = quotes[Math.floor(Math.random()*quotes.length)];

  mainQuote.innerHTML = quote;

  $('.quoteShuffle').shuffleLetters();

}

$(document).ready(function() {

  randomQuote();

});