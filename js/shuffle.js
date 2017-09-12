function randomQuote(){

  quotes = ["I want to believe, but the government tells me not to, so I don't",
    "It isn't about right or wrong, it's about success",
    "Morality as simple as the flick of a switch",
    "The future no one expects is inevitable",
    "How do you fall asleep on a planet with no crickets?"];

  var mainQuote = document.getElementById('mainQuote');
  var quote = quotes[Math.floor(Math.random()*quotes.length)];

  mainQuote.innerHTML = quote;

  $('.quoteShuffle').shuffleLetters();

}

$(document).ready(function() {

  randomQuote();

});