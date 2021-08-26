import $ from "jquery";

const createCard = (product, container, translations = {}) => {

    let description = '';
    if (product.description !== null) {
        description = product.description.substring(0, 50) + '...';
    }

    return $('<div class="col-md-4 mb-4">' +
        '<div class="card card-product h-100" id="product-' + product.id + '">' +
        '<a href="' + container.data('url').replace('0', product.slug) + '">' +
        '<h5 class="card-title">#' + product.name + '</h5>' +
        '<div class="card-body">' +
        '<p class="text-dark">' + translations.aloy + ": " + product.aloy + '</p>' +
        (product.state.length > 0 ? '<p class="text-dark">' + translations.state + ": " + product.state + '</p>' : '') +
        '<p class="text-dark">' + (product.depth ? ' (' + translations.depth[0] + ') ' + product.depth + ' x ' : '') + (product.width ? ' (' + translations.width[0] + ') ' + product.width + ' x ' : '') + '(' + translations.height[0] + ') ' + product.height + '</p>' +
        '<p class="text-dark">' + description + '</p>' +
        '</div>' +
        '</a>' +
        '</div>' +
        '</div>')
}

export default createCard;