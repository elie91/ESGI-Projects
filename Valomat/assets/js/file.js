import $ from 'jquery';

$('input[type=file]').each(function () {
    $(this).on('change',function(e){
        let fileName = e.target.files[0].name;
        $('.custom-file-label').html(fileName);
    })
})