const layout = require('./layout');

function renderView (images) {
    const viewData = {
        bodyPartial: 'orderForm',
    };
    return layout(viewData);
}

module.exports = {
    render: renderView
};