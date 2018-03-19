const timer = {
    // Current timer count in seconds
    current: 0,
    // Timer element in the DOM
    el: document.querySelector('.timer'),

    // Parse raw time and return display string
    parse() {
        let minutes = Math.floor(this.current / 60);
        let seconds = this.current % 60;

        // Add leading '0' if the number is < 10
        if (minutes < 10) minutes = '0' + minutes;
        if (seconds < 10) seconds = '0' + seconds;

        // Format output string
        return `${minutes}:${seconds}`;
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