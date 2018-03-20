/* Main controller object, handles the deck
 * and contains hooks to other relevant objects
 */
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
        // Exclude spans with symbols and the deck element itself
        this.deck.addEventListener('click', e => {
            if (e.target.nodeName === 'DIV' &&
                    false === e.target.classList.contains('open') &&
                    e.target !== e.currentTarget) {
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