const layout = require('./layout');

function renderView (orderedImages) {
    const viewData = {
        bodyPartial: 'orderSuccess',
        orderedImagesCount: orderedImages.length
    };
    return layout(viewData);
}

module.exports = {
    render: renderView
};