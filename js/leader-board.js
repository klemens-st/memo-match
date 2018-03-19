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
            // Set an event listener on the form
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

    // Controls the display of 'no scores' message
    toggleNoScores() {
        if (0 === this.scores.length && !this.noScores ||
            0 < this.scores.length && this.noScores) {
            this.noScores = !this.el.querySelector('.no-scores')
                            .classList.toggle('disabled');
        }
    },

    clear() {
        this.scores = [];
        // Clear local storage
        localStorage.removeItem('leaderBoard');
        // Clear rendered list
        this.list.innerHTML = ''
        this.render();
    }
}