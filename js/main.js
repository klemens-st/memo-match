/* Global init code */
gameController.init();

document.querySelector('.btn-start').addEventListener('click', function() {
    // Do regular start if this is the first game
    if (!gameController.started) gameController.start();
    // Otherwise perform a reset
    else gameController.reset();

    this.classList.toggle('started');
    this.disabled = true;
});