const layout = require('./layout');

function renderView (galleries) {
    const viewData = {
        bodyPartial: 'startPage',
        galleries: galleries.slice(0, Math.min(3, galleries.length))
    };
    return layout(viewData);
}

module.exports = {
    render: renderView
};