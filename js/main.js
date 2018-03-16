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
            card.innerHTML = `<span>${symbol}</span>`;
            card.dataset.pairId = index;

            cards.push(card);
            cards.push(card.cloneNode(true));
        });

        cards = shuffle(cards);
        cards.forEach(function(card) {
             fragment.appendChild(card);
        });

        deck.innerHTML = '';
        deck.appendChild(fragment);

        // Set the move counter
        scoreController.resetScore();
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

        // Increment move counter
        scoreController.incrementCounter();

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
            // Wait for the open animation to finish before
            // adding the 'matched' class.
            setTimeout(() => {card.classList.toggle('matched');}, 1000);
        });

        // Check if this was a winning move
        if (this.matched === this.goal) this.victory();
    },

    processMiss: function() {
        this.openCards.forEach(function(card) {
            // Wait for the 'open' animation to finish and add 'wrong' class
            setTimeout(() => {card.classList.toggle('wrong');}, 1000);
            // Wait for the 'wrong' animation to finish and remove both classes.
            setTimeout(() => {
                card.classList.toggle('open');
                card.classList.toggle('wrong');
            }, 2000);
        });
    },

    victory: function() {
        alert('Congrats!!!');
        document.querySelector('.overlay').classList.toggle('show');
    }
};

const scoreController = {
    // Move counter element
    counter: document.querySelector('.counter'),
    // Star rating element
    stars: document.querySelector('.stars'),
    // Star symbols
    starSymbols: {filled: '★', empty: '☆'},

    resetScore: function() {
        // Move count
        this.moves = 0;
        // Player's current star rating
        this.rating = 3;
        // Star rating move count break points, from lowest to highest
        this.breakPoints = [4, 24, 30];
        this.counter.textContent = '0';
        this.renderStars();
    },

    incrementCounter: function() {
        this.moves += 1;
        this.counter.textContent = this.moves;
        this.assignStars();
    },

    assignStars: function() {
        // Check if the there are more moves than the lowest
        // remaining break point
        if (this.moves > this.breakPoints[0]) {
            // Decrease rating, remove used breakpoint and render stars
            this.rating -= 1;
            this.breakPoints.shift();
            this.renderStars();
        }
    },

    renderStars: function() {
        const filled = this.starSymbols.filled;
        const empty = this.starSymbols.empty;

        // In this array, indexes of strings correspond
        // to the 'rating' property
        const strings = [
            `${empty} ${empty} ${empty}`,
            `${filled} ${empty} ${empty}`,
            `${filled} ${filled} ${empty}`,
            `${filled} ${filled} ${filled}`
        ]

        this.stars.textContent = strings[this.rating];
    }
};

const timer = {
    // Current timer count in seconds
    current: 0,
    // Timer element in the DOM
    el: document.querySelector('.timer'),

    // Parse raw time and return display string
    parse: function() {
        let minutes = Math.floor(this.current / 60);
        let seconds = this.current % 60;

        // Add leading '0' if the number is < 10
        if (minutes < 10) minutes = '0' + minutes;
        if (seconds < 10) seconds = '0' + seconds;

        // Format output string
        return `${minutes}:${seconds}`;
    },

    // Start the timer and run it
    start: function() {
        this.interval = setInterval(function() {
            timer.current += 1;
            timer.el.textContent = timer.parse();
        }, 1000);
    },

    // Stop the timer
    stop: function() {
        clearInterval(this.interval);
    },

    // Set the timer back to zero
    reset: function() {
        this.current = 0;
        this.el.textContent = this.parse();
    }
};

const leaderBoard = {
    // List element
    list: document.querySelector('.scores'),
    // Form used to save high scores
    form: document.querySelector('.modal form'),

    init: function() {
        if (storageAvailable('localStorage')) {
            // Get values from the storage or set a new array
            const storage = localStorage.getItem('leaderBoard');
            this.scores = (null !== storage) ? JSON.parse(storage) : [];
            // Render the list
            if ([] !== this.scores) this.render();
            // Set an event listener on the form
            this.setEvents();

        } else {
            // Hide entire leaderboard if we cannot use local storage
            document.querySelector('.leaderBoard').classList.toggle('disabled');
        }
    },

    setEvents: function() {
        this.form.addEventListener('submit', function(e) {
                e.preventDefault();
                const name = document.querySelector('input').value;
                leaderBoard.insert(name);
            });
    },

    insert: function(name) {
        const time = new Date().toLocaleString();
        const score = scoreController.moves;
        const newEntry = {name, time, score};

        if (0 === this.scores.length) {
            this.scores.push(newEntry);
        } else {
            // Loop over the array and insert the new entry as
            // soon as an equal or higher score is found. This ensures
            // uniformity of the leaderboard. If we are trying to insert
            // a score higher than any other one, push it to the end
            let inserted = false;
            for (const entry of this.scores) {
                if (entry.score >= newEntry.score) {
                    const position = this.scores.indexOf(entry);
                    this.scores.splice(position, 0, newEntry);
                    inserted = true;
                    break;
                }
            }
            if (!inserted) this.scores.push(newEntry);
            // Save changes to local storage
            localStorage.setItem('leaderBoard', JSON.stringify(this.scores));
        }
        // Finally, render the new list
        this.render();
    },

    render: function() {
        const fragment = document.createDocumentFragment();

        this.scores.forEach(function(entry) {
            const {name, time, score} = entry;
            const newLi = document.createElement('li');
            newLi.textContent = `${name}, score: ${score}, ${time}`;
            fragment.appendChild(newLi);
        });
        this.list.classList.toggle('hidden');
        this.list.innerHTML = '';
        this.list.appendChild(fragment);
        this.list.classList.toggle('hidden');
    },

    clear: function() {
        this.scores = [];
        // Clear local storage
        localStorage.removeItem('leaderBoard');
        // Clear rendered list
        this.list.innerHTML = '';
    }
}

gameController.init();
leaderBoard.init();

function bindCardEvents() {
    document.querySelectorAll('.deck div').forEach(function(card) {
        card.addEventListener('click', cardClicked);
    });
}

function cardClicked(e) {
    if (true === e.currentTarget.classList.contains('matched')) return;
    gameController.openCard(e.currentTarget);
}

document.querySelector('.btn-start').addEventListener('click', function() {
    bindCardEvents();
    bindResetEvent();
    timer.start();
    this.classList.toggle('started');
    this.setAttribute('disabled', '');
});

function bindResetEvent() {
    document.querySelector('.btn-reset').addEventListener('click', function() {
        gameController.init();
        bindCardEvents();
        timer.stop();
        timer.reset();
        timer.start();
    });
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


// from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}
// TODO: Disable leaderboard submission when no local storage