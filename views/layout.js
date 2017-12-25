const templates = require('./templates');

function layout (viewData) {
    const layoutViewData = {
        currentYear: new Date().getFullYear(),
    };
    const mergedViewData = Object.assign(layoutViewData, viewData);
    const layoutTemplate = templates.get('layout');
    return layoutTemplate(mergedViewData);
}

module.exports = layout;