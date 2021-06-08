import '../sass/app.scss';

import $ from 'jquery';


import Forum from "./forum/Forum";
import Test from "./test/Test";


$(document).ready(function () {
  let flash = $('.flash');
  let btn = $('#btn-sidebar');
  let sidebar = $('#sidebar');
  let navbar = $('.navbar');

  new Forum();

  if (flash.length > 0) {
    flash.addClass('show');
    setTimeout(function () {
      flash.removeClass('show');
    }, 3000)
  }

  if (btn.length > 0){
    btn.on('click', function () {
      let i = btn.find('i');
      if (sidebar.hasClass('hide')){
        sidebar.removeClass('hide');
        navbar.removeClass('w-100');
        i.addClass('fa-chevron-left');
        i.removeClass('fa-bars')
      }else{
        sidebar.addClass('hide');
        navbar.addClass('w-100');
        i.removeClass('fa-chevron-left');
        i.addClass('fa-bars');
      }
    })
  }

});
