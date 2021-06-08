import $ from 'jquery';

let buttons = $('.btn-apply');

buttons.each(function (item, value) {
  let button = $(value);
  button.on('click', function () {
    $.ajax({
      type: "POST",
      url : button.data('url'),
    }).done(function (response) {
      if (response !== "201") {
        changeButton(button);
      }else{
        console.log('Error');
      }
    })
  });
});


function changeButton(button) {
  if (button.hasClass('btn-primary')){
    button.removeClass('btn-primary');
    button.addClass('btn-danger');
    button.html('<i class="fas fa-times"></i>Annuler');
  }else{
    button.removeClass('btn-danger');
    button.addClass('btn-primary');
    button.html('<i class="fas fa-check"></i>Je postule');
  }
}