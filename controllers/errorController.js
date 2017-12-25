const errorViews = require('../views/errorViews');

function handle404 (req, res) {
    res.status(404).send(errorViews.render404());
}

// Note: it's crucial that an error-handling middleware function declares four parameters
// because this is the way express knows that it is indeed an error handling function.
// For more info see http://expressjs.com/en/guide/error-handling.html
function handle500 (err, req, res, next) {
    console.log(`Unhandled error caught: [${err}]`);

    res.status(500).send(errorViews.render500());
}

module.exports = {
    handle404: handle404,
    handle500: handle500
};