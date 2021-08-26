export default function Tracking() {
    let url = document.querySelector('.tracking');
    if (url) {
        url = url.getAttribute('data-url');
        let checks = document.querySelectorAll(".tracking .check");
        if (url) {
            fetch(url).then(function (data) {
                data.json().then(function (value) {
                    checks[value - 1].className = "check active";
                    if (value !== 3) {
                        checks[value].className = "check incoming";
                    }
                })
            });
        }
    }
}