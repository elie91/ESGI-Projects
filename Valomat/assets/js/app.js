import buildQuill from "./modules/Quill";
require('../css/app.scss');
import Tracking from "./modules/Tracking";

window.onload = function () {
    let flash = document.querySelector('.flash');
    if (flash) {
        flash.classList.add('show');
        setTimeout(function () { 
            flash.classList.remove('show');
        }, 3000)
    }
};

let checkGeneratePassword = document.getElementById('checkGeneratePassword');

if (checkGeneratePassword){
    checkGeneratePassword.onchange = function () {
        let container = document.getElementById('collapse-form');
        if (!checkGeneratePassword.checked) {
            container.className = "col-md-12 show";
        }else{
            container.className = "col-md-12";
        }
    }
}

buildQuill();
setInterval(Tracking, 10000);




