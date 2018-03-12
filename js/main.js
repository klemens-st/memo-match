const symbols = ['☀', '☂', '☏', '☘', '☮', '♥', '♫', '☺'];

const gameController = {
    // Set the number of matches required to win.
    goal: 8,
    // Track successful matches.
    matched: 0,
    // Array of card elements
    deck: [],
    // Array to track cards opened by the user
    openCards: [],

    init: function() {
        const deck = $('.deck');
        let cards = [];

        symbols.forEach(function(symbol, index) {
            const card = $(`<div>${symbol}</div>`);
            card.data('pairId', index);
            cards.push(card);
            cards.push(card.clone(true));
        });

        cards = shuffle(cards);
        cards.forEach(function(card) {
             card.appendTo(deck);
        });
    },
};

gameController.init();


// from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}