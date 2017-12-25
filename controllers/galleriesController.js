const allGalleriesView = require('../views/allGalleriesView');
const galleryView = require('../views/galleryView');
const galleries = require('../models/galleries');

function handleGetAllGalleries (req, res) {
    function generateResponse(galleries) {
        res.send(allGalleriesView.render(galleries));
    }

    galleries.getGalleries(generateResponse);
}

function handleGetGallery (req, res) {
    const galleryKey = req.params.galleryKey;

    function generateResponse(gallery) {
        res.send(galleryView.render(gallery));
    }

    galleries.getGallery(galleryKey, generateResponse);
}

module.exports = {
    getAllGalleries: handleGetAllGalleries,
    getGallery: handleGetGallery
};