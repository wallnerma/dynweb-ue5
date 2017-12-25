const layout = require('./layout');

function render404 () {
    return layout({
        bodyPartial: '404'
    });
}

function render500 () {
    return layout({
        bodyPartial: '500'
    });
}

module.exports = {
    render404: render404,
    render500: render500
};