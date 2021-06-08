import $ from "jquery";
import createCard from "./utils/utils";

require('../css/app.scss');

const container = $('#container-products');

if (container.length > 0){
    const loader = $('<div class="loader"></div>');
    const form = $('#form-filter');

    let nextItem = 1;
    let loadMore = () => {
        container.append(loader);
        let params = {
            'name': form.find('#name').val(),
            'aloy': form.find('#aloy').val(),
            'categories': form.find('#categories').val(),
            'elaborator': form.find('#elaborator').val()
        };
        let url = container.data('fetch') + "?";
        for (let [key, value] of Object.entries(params)) {
            if (value.length > 0) {
                url += key + "=" + value + "&"
            }
        }

        url += "page=" + nextItem;

        $.ajax(url)
            .done(function (data) {
                let empty = $('#empty-message');
                let result = JSON.parse(data);
                if (result.length > 0) {
                    result.forEach(function (item) {
                        container.append(createCard(item, container, container.data('translations')));
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

    form.find('button').on('click', function () {
        nextItem = 1;
        container.html('');
        loadMore();
    });

    container.scroll(function () {
        if ((container.scrollTop() + container.innerHeight()) >= container.prop('scrollHeight') - 0.5) {
            loadMore();
        }
    });

    loadMore();
}