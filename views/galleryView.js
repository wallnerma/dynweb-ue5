const layout = require('./layout');

function renderView (gallery) {
    const viewData = {
        bodyPartial: 'gallery',
        gallery: gallery
    };
    return layout(viewData);
}

module.exports = {
    render: renderView
};