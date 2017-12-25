const layout = require('./layout');

function renderView (images) {
    const viewData = {
        bodyPartial: 'shoppingCart',
        shoppingCart: {
            images: images,
            itemCount: images.length
        }
    };
    return layout(viewData);
}

module.exports = {
    render: renderView
};