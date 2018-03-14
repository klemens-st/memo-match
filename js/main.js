const symbols = ['☀', '☂', '☏', '☘', '☮', '♥', '♫', '☺'];

const gameController = {
    // Set the number of matches required to win.
    goal: 8,
    // Track successful matches.
    matched: 0,
    // Array of matched card elements
    matchedCards: [],
    // Array to track cards opened by the user
    openCards: [],

    init: function() {
        const deck = document.querySelector('.deck');
        const fragment = document.createDocumentFragment();
        let cards = [];

        symbols.forEach(function(symbol, index) {
            const card = document.createElement('div');
            card.textContent = symbol;
            card.dataset.pairId = index;

            cards.push(card);
            cards.push(card.cloneNode(true));
        });

        cards = shuffle(cards);
        cards.forEach(function(card) {
             fragment.appendChild(card);
        });
        deck.appendChild(fragment);
    },

    openCard: function(card) {
        // Do nothing if the card is already open
        if (-1 !== this.openCards.indexOf(card)) return;

        this.openCards.push(card);
        card.classList.toggle('open');
        this.evaluate();
    },

    evaluate: function() {
        // Proceed only if there are 2 open cards
        if (2 !== this.openCards.length) return;

        const card1 = this.openCards[0];
        const card2 = this.openCards[1];

        // Check if open cards match
        if (card1.dataset.pairId === card2.dataset.pairId) {
            this.processMatch();
        } else {
            this.processMiss();
        }
        // Regardless of the result, flush openCards array
        this.openCards = [];
    },

    processMatch: function() {
        // Increment match counter
        this.matched += 1;

        this.openCards.forEach(function(card) {
            card.classList.toggle('matched');
        });

        // Check if this was a winning move
        if (this.matched === this.goal) this.victory();
    },

    processMiss: function() {
        // Remove the open CSS class
        this.openCards.forEach(function(card) {
            card.classList.toggle('open');
        });
    },

    victory: function() {
        alert('Congrats!!!');
    }
};

gameController.init();

document.querySelectorAll('div').forEach(function(card) {
    card.addEventListener('click', cardClicked);
});

function cardClicked(e) {
    if (true === e.target.classList.contains('matched')) return;
    gameController.openCard(e.target);
}

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