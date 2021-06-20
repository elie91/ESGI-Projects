class Test {

    constructor() {
        this.current_tab = 0;
        this.form = document.querySelector('.form_test');
        if (!this.form) return;
        this.tabs = Array.from(document.querySelectorAll('.form_test__tab'));
        this.steps = Array.from(document.querySelectorAll('.form_test__step'));
        this.previousBtn = document.getElementById("prevBtn");
        this.nextBtn = document.getElementById("nextBtn");
        this.initEvents();
        this.showTab();
    }

    initEvents() {
        this.nextBtn.addEventListener('click', () => this.nextPrev(1));
        this.previousBtn.addEventListener('click', () => this.nextPrev(-1));
    }

    /**
     * Display the current tab
     */
    showTab() {
        this.tabs[this.current_tab].style.display = "block";
        if (this.current_tab === 0) {
            this.previousBtn.style.display = "none";
        } else {
            this.previousBtn.style.display = "inline";
        }
        if (this.current_tab === (this.tabs.length - 1)) {
            this.nextBtn.innerHTML = "Soumettre";
            this.nextBtn.classList.replace('btn-primary', 'btn-success');
        } else {
            this.nextBtn.innerHTML = "Suivant";
        }
        this.fixStepIndicator();
    }

    /**
     * This function will figure out which tab to display
     * @param n
     */
    nextPrev(n) {
        if (n === 1 && !this.validateForm()) return false;
        this.tabs[this.current_tab].style.display = "none";
        this.current_tab = this.current_tab + n;
        if (this.current_tab >= this.tabs.length) {
            this.form.submit();
            return false;
        }
        this.showTab(this.current_tab);
    }

    /**
     *  This function deals with validation of the form fields
     * @returns {*}
     */
    validateForm() {
        if (this.current_tab === 0) {
            this.steps[this.current_tab].className += " finish";
            return true;
        }
        const inputList = Array.from(this.tabs[this.current_tab].getElementsByTagName("input"));
        const formError = this.tabs[this.current_tab].querySelector('.form_test__error');
        let valid = false;
        inputList.forEach(input => {
            if (input.checked === true) {
                valid = true;
            }
        });
        if(!valid) {
            formError.style.display = 'block';
        } else {
            formError.style.display = 'block';
            this.steps[this.current_tab].className += " finish";
        }
        return valid;
    }

    /**
     * This function removes the "active" class of all steps
     * and adds the "active" class to the current step:
     */
    fixStepIndicator() {
        for (let i = 0; i < this.steps.length; i++) {
            this.steps[i].className = this.steps[i].className.replace(" active", "");
        }
        this.steps[this.current_tab].className += " active";
    }
}

new Test();