window.onload = function () {
    let flash = document.querySelector('.flash');
    if (flash) {
        flash.classList.add('show');
        setTimeout(function () {
            flash.classList.remove('show');
        }, 3000)
    }
};