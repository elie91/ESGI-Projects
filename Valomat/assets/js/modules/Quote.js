export default class Quote {

    constructor() {
        this.form = document.querySelector('form[name="quote"]');
        this.quote_company = document.getElementById('quote_company');
        this.quote_email = document.getElementById('quote_email');
        this.quote_phone = document.getElementById('quote_phone');
        this.quote_firstname = document.getElementById('quote_firstname');
        this.quote_lastname = document.getElementById('quote_lastname');
        this.getFromStorage();
        this.initEvents();
    }

    initEvents() {
        this.form.addEventListener('submit', this.saveInStorage.bind(this));
    }

    saveInStorage(event) {
        event.preventDefault();
        localStorage.setItem('quote_company', this.quote_company.value);
        localStorage.setItem('quote_email', this.quote_email.value);
        localStorage.setItem('quote_phone', this.quote_phone.value);
        localStorage.setItem('quote_firstname', this.quote_firstname.value);
        localStorage.setItem('quote_lastname', this.quote_lastname.value);
        this.form.submit();
    }

    getFromStorage() {
        this.quote_company.value = localStorage.getItem('quote_company') ? localStorage.getItem('quote_company') : '';
        this.quote_email.value = localStorage.getItem('quote_email') ? localStorage.getItem('quote_email') : '';
        this.quote_phone.value = localStorage.getItem('quote_phone') ? localStorage.getItem('quote_phone') : '';
        this.quote_firstname.value = localStorage.getItem('quote_firstname') ? localStorage.getItem('quote_firstname') : '';
        this.quote_lastname.value = localStorage.getItem('quote_lastname') ? localStorage.getItem('quote_lastname') : '';
    }

}