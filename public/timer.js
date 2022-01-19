document.addEventListener('DOMContentLoaded', function () {
    let red = document.querySelector('.error');
    let green = document.querySelector('.passed');

    if (red.innerHTML !== '' || green) {
        setTimeout(() => {
            red.innerHTML = '';
            green.innerHTML = '';
        }, 3000);
    }
});
