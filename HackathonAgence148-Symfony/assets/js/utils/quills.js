let selectors = document.querySelectorAll('.standalone-container');
let html = false;
if (selectors.length > 0){
  selectors.forEach(function (value) {
    let id = value.getAttribute('data-id');
    if (value.children[1]) {
      let f = document.getElementById(id);
      let quill = new Quill(value.children[1], {
        modules: {
          toolbar: '#' + id + '-toolbar-container'
        },
        placeholder: 'Description',
        theme: 'snow'
      });

      quill.root.innerHTML = f.value;

      quill.on('text-change', function (delta, oldDelta, source) {
        if (source === 'user') {
          f.value = (html) ? quill.root.innerHTML : quill.getText();
        }
      });
    }
  })
}