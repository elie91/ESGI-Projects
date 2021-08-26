export default function collectionType(){
  jQuery(document).ready(function() {

    let $collectionHolder = $('ul.features');

    let $addFeaturesButton = $('<button type="button" class="btn btn-primary add_feature_link"><i class="fas fa-plus"></i>Add a feature</button>');
    let $newLinkLi = $('<li></li>').append($addFeaturesButton);

    $collectionHolder.append($newLinkLi);

    $collectionHolder.data('index', $collectionHolder.find(':input').length);

    $addFeaturesButton.on('click', function(e) {
      addFeaturesForm($collectionHolder, $newLinkLi);
    });
  });
}

function addFeaturesForm($collectionHolder, $newLinkLi) {

  let prototype = $collectionHolder.data('prototype');

  let index = $collectionHolder.data('index');

  let newForm = prototype;
  newForm = newForm.replace(/__name__/g, index);

  $collectionHolder.data('index', index + 1);

  let $newFormLi = $('<li></li>').append(newForm);
  $newLinkLi.before($newFormLi);
}



