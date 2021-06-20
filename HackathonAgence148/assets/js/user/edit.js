import $ from "jquery";

$(document).ready(function () {
  let accordion = $('#accordionUser');
  if (accordion.length > 0) {
    let buttons = accordion.find('[data-toggle=collapse]');
    buttons.each(function (index) {
      $(this).on('click', function () {
        if (index === 1) {
          $(buttons[0]).addClass('collapsed');
        } else {
          $(buttons[1]).addClass('collapsed');
        }
        $(this).removeClass('collapsed');
      });
    });
  }
});
$('form').on('keyup keypress', function(e) {
  let keyCode = e.keyCode || e.which;
  if (keyCode === 13) {
    e.preventDefault();
    return false;
  }
});