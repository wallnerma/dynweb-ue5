const homeView = require('../views/homeView');
const galleries = require('../models/galleries');

function handleGetHome (req, res) {
    function generateResponse(galleries) {
        res.send(homeView.render(galleries));
    }

    galleries.getGalleries(generateResponse);
}

module.exports = {
    getHome: handleGetHome
};