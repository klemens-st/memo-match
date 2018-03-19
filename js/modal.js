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
        this.overlay.classList.toggle('show');
        this.toggleBlur();
    },

    close() {
        this.overlay.classList.toggle('show');
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