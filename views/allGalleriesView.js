const layout = require('./layout');

function renderView (galleries) {
    const viewData = {
        bodyPartial: 'allGalleries',
        galleries: galleries
    };
    return layout(viewData);
}

module.exports = {
    render: renderView
};