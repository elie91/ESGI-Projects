import $ from 'jquery';
import createCard from "./utils/utils.js";

const container = $('#container-products');
const loader = $('<div class="loader"></div>');

let nextItem = 1;
let loadMore = function () {
    container.append(loader);
    $.ajax(container.data('fetch') + "?page=" + nextItem)
        .done(function (data) {
            let empty = $('#empty-message');
            let result = JSON.parse(data);
            if (result.length > 0) {
                result.forEach(function (item) {
                    container.append(createCard(item, container,container.data('translations')));
                });
                nextItem++;
                if (empty.length > 0) {
                    empty.remove();
                }
            } else {
                if (empty.length === 0) {
                    const message = $('<div id="empty-message" class="col-md-12"><p class="text-center">' + container.data('empty') + '</p></div>');
                    container.append(message);
                }

            }
            loader.remove();
        });

}

container.scroll(function () {
    if ((container.scrollTop() + container.innerHeight()) >= container.prop('scrollHeight') - 0.5) {
        loadMore();
    }
});

loadMore();