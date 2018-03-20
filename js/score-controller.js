/* Object handling move count and star rating */
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
        ];

        this.stars.textContent = strings[this.rating];
    }
};