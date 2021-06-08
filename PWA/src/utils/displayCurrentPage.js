export default function displayCurrentPage(selector) {
    const elements = Array.from(app.querySelectorAll('[page]'));
    elements.forEach(element => {
        if(element.getAttribute('page') !== selector) {
            element.removeAttribute('active')
        } else {
            element.setAttribute('active', true);
        }
    })
}