gameController.init();

document.querySelector('.btn-start').addEventListener('click', function() {
    gameController.start();
    this.classList.toggle('started');
    this.setAttribute('disabled', '');
});