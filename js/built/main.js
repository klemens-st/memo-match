/*! memo-match - v1.0.0 - 2018-03-20 */
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
const gameController = {
    // Set the number of matches required to win.
    goal: 8,
    // Track successful matches.
    matched: 0,
    // Deck element
    deck: document.querySelector('.deck'),
    // Array to track cards opened by the user
    openCards: [],

    init() {
        // Create the deck
        this.deckSetup();
        // Delegate events
        this.setEvents();
        // Set the move counter
        scoreController.resetScore();
        // Initialize the leaderboard
        leaderBoard.init();
        // Initialize the modal
        modal.init();
    },

    setEvents() {
        // Delegate events from deck to cards
        this.deck.addEventListener('click', e => {
            if (e.target.nodeName === 'DIV' &&
                    false === e.target.classList.contains('matched')) {
                gameController.openCard(e.target);
            }
        });
        // Set a reset event
        document.querySelector('.btn-reset').addEventListener('click', () => {
            // Don't do anything if the game hasn't started yet
            if (gameController.started) gameController.reset();
        });
    },

    start() {
        // Set a flag (helper for reset event)
        this.started = true;
        // Animate cards from scale 0 to full
        this.deck.classList.toggle('reveal');
        timer.start();
    },

    reset() {
        // Set match counter back to 0
        this.matched = 0
        this.deckSetup();
        scoreController.resetScore();
        timer.stop();
        timer.reset();
        timer.start();
    },

    deckSetup() {
        const symbols = ['☀', '☂', '☏', '☘', '☮', '♥', '♫', '☺'];
        const fragment = document.createDocumentFragment();
        let cards = [];

        // Create two cards for each symbol
        symbols.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.innerHTML = `<span>${symbol}</span>`;
            card.dataset.pairId = index;

            cards.push(card);
            // Deep clone to preserve child nodes
            cards.push(card.cloneNode(true));
        });

        cards = shuffle(cards);
        cards.forEach((card) => {
             fragment.appendChild(card);
        });

        this.deck.innerHTML = '';
        this.deck.appendChild(fragment);
    },

    openCard(card) {
        // Do nothing if the card is already open
        if (-1 !== this.openCards.indexOf(card)) return;

        this.openCards.push(card);
        card.classList.toggle('open');
        this.evaluate();
    },

    evaluate() {
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

    processMatch() {
        // Increment match counter
        this.matched += 1;

        this.openCards.forEach((card) => {
            // Wait for the open animation to finish before
            // adding the 'matched' class.
            setTimeout(() => {card.classList.toggle('matched');}, 500);
        });

        // Check if this was a winning move
        if (this.matched === this.goal) this.victory();
    },

    processMiss() {
        this.openCards.forEach((card) => {
            // Wait for the 'open' animation to finish and add 'wrong' class
            setTimeout(() => {card.classList.toggle('wrong');}, 500);
            // Wait for the 'wrong' animation to finish and remove both classes.
            setTimeout(() => {
                card.classList.toggle('open');
                card.classList.toggle('wrong');
            }, 1000);
        });
    },

    victory() {
        // Show modal and stop the timer
        timer.stop();
        // Wait for animations to finish
        setTimeout(() => {modal.open();}, 1000);
    }
};
const scoreController = {
    // Move counter element
    counter: document.querySelector('.counter'),
    // Star rating element
    stars: document.querySelector('.stars'),
    // Star symbols
    starSymbols: {filled: '★', empty: '☆'},

    resetScore() {
        // Move count
        this.moves = 0;
        // Player's current star rating
        this.rating = 3;
        // Star rating move count break points, from lowest to highest
        this.breakPoints = [20, 24, 30];
        this.counter.textContent = '0';
        this.renderStars();
    },

    incrementCounter() {
        this.moves += 1;
        this.counter.textContent = this.moves;
        this.assignStars();
    },

    assignStars() {
        // Check if the there are more moves than the lowest
        // remaining break point
        if (this.moves > this.breakPoints[0]) {
            // Decrease rating, remove used breakpoint and render stars
            this.rating -= 1;
            this.breakPoints.shift();
            this.renderStars();
        }
    },

    renderStars() {
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
    parse() {
        let hours = Math.floor(this.current / 3600);
        let minutes = Math.floor(this.current / 60 % 60);
        let seconds = this.current % 60;

        // Add leading '0' if the number is < 10
        if (hours < 10) hours = '0' + hours;
        if (minutes < 10) minutes = '0' + minutes;
        if (seconds < 10) seconds = '0' + seconds;

        // Format output string
        return `${hours}:${minutes}:${seconds}`;
    },

    // Start the timer and run it
    start() {
        this.interval = setInterval(() => {
            // Arrow function allows using 'this' here
            this.current += 1;
            this.el.textContent = timer.parse();
        }, 1000);
    },

    // Stop the timer
    stop() {
        clearInterval(this.interval);
    },

    // Set the timer back to zero
    reset() {
        this.current = 0;
        this.el.textContent = this.parse();
    }
};
const leaderBoard = {
    // Leaderboard element
    el: document.querySelector('.leaderboard'),
    // List element
    list: document.querySelector('.scores > tbody'),
    // Form used to save high scores
    form: document.querySelector('.modal form'),
    // Other objects will check this property before
    // interacting with the leaderboard
    available: false,
    // Is 'no scores' message displayed?
    noScores: true,

    init() {
        if (storageAvailable('localStorage')) {
            // Update availability
            this.available = true;
            // Get values from the storage or set a new array
            const storage = localStorage.getItem('leaderBoard');
            this.scores = (null !== storage) ? JSON.parse(storage) : [];
            // Render the list
            this.render();
            // Set an event listener on the form and clear button
            this.setEvents();

        } else {
            // Hide entire leaderboard if we cannot use local storage
            document.querySelector('.leaderboard').classList.toggle('disabled');
            this.form.classList.toggle('disabled');
        }
    },

    setEvents() {
        this.form.addEventListener('submit', e => {
                e.preventDefault();
                const name = document.querySelector('input').value;
                leaderBoard.insert(name);
            });
        // Click and hold clear event
        const clearBtn = document.querySelector('.clear-scores > button');
        clearBtn.addEventListener('pointerdown', () => {
            leaderBoard.timeout = setTimeout(() => {leaderBoard.clear();}, 5000);
        });
        clearBtn.addEventListener('pointerup', () => {clearInterval(leaderBoard.timeout);});

    },

    insert(name) {
        const time = new Date().toLocaleString();
        const score = scoreController.moves;
        const newEntry = {name, time, score};
        let inserted = false;

        if (0 < this.scores.length) {
            // Loop over the array and insert the new entry as
            // soon as an equal or higher score is found. This ensures
            // uniformity of the leaderboard. If we are trying to insert
            // a score higher than any other one, push it to the end
            for (const entry of this.scores) {
                if (entry.score >= newEntry.score) {
                    const position = this.scores.indexOf(entry);
                    this.scores.splice(position, 0, newEntry);
                    inserted = true;
                    break;
                }
            }
        }
        // First or lowest entry
        if (0 === this.scores.length || !inserted) {
            this.scores.push(newEntry);
        }
        // Save changes to local storage
        localStorage.setItem('leaderBoard', JSON.stringify(this.scores));
        // Hide the form to allow only one submission.
        this.form.classList.toggle('disabled');
        // Finally, render the new list
        this.render();
    },

    render() {
        this.toggleNoScores();
        // Do nothing if there are no entries
        if (0 === this.scores.length) return;

        const fragment = document.createDocumentFragment();

        let i = 1;
        this.scores.forEach((entry) => {
            const {name, time, score} = entry;
            const row = document.createElement('tr');
            row.innerHTML = `<td>${i}.</td><td>${name}</td><td>${score}</td><td>${time}</td>`;
            fragment.appendChild(row);
            i++;
        });
        this.list.classList.toggle('hidden');
        this.list.innerHTML = '';
        this.list.appendChild(fragment);
        this.list.classList.toggle('hidden');
    },

    // Controls the display of 'no scores' message and clear button
    toggleNoScores() {
        if (0 === this.scores.length && !this.noScores ||
            0 < this.scores.length && this.noScores) {
            this.noScores = !this.el.querySelector('.no-scores')
                            .classList.toggle('disabled');
            document.querySelector('.clear-scores').classList
                .toggle('disabled');
        }
    },

    clear() {
        this.scores = [];
        // Clear local storage
        localStorage.removeItem('leaderBoard');
        // Clear rendered list
        this.list.innerHTML = '';
        this.render();
    }
}
const modal = {
    // Modal element
    el: document.querySelector('.modal'),
    // Overlay containing the modal
    overlay: document.querySelector('.overlay'),

    init() {
        // Set a close event on play again button
        this.el.querySelector('.again').addEventListener('click', () => {
            modal.close();
            gameController.reset();
        });
    },

    open() {
        this.render();
        this.overlay.classList.toggle('disabled');
        this.toggleBlur();
    },

    close() {
        this.overlay.classList.toggle('disabled');
        // Make sure leaderboard form is enabled (if available)
        if (leaderBoard.available){
            leaderBoard.form.classList.remove('disabled');
        }
        this.toggleBlur();
    },

    render() {
        const moves = this.el.querySelector('.moves');
        const stars = this.el.querySelector('.stars');
        const timeElapsed = this.el.querySelector('.timer');

        moves.textContent = scoreController.moves;
        stars.textContent = scoreController.rating;
        timeElapsed.textContent = timer.parse();
    },

    // Apply blur effect behind the modal
    toggleBlur() {
        document.body.classList.toggle('blur');
    }
}
gameController.init();

document.querySelector('.btn-start').addEventListener('click', function() {
    gameController.start();
    this.classList.toggle('started');
    this.setAttribute('disabled', '');
});