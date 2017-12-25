const fs = require('fs');
const path = require('path');

const GALLERIES_BASE_PATH = process.cwd() + '/public/galleries/';

/**
 * Builds a galleries data structure from filesystem contents
 * @param doneHandler a function receiving all gallery objects as first parameter
 * called when reading out galleries has been finished
 */
function getGalleriesFromFS (doneHandler) {
    fs.readdir(GALLERIES_BASE_PATH, 'utf8', function(err, files) {
        const galleries = [];
        if (err) {
            console.log(err);
        }

        // First let's filter all regular gallery directories
        const galleryDirNames = files.filter((fileName) => {
            const subDirPath = GALLERIES_BASE_PATH + fileName;
            const stats = fs.statSync(subDirPath);
            const hasGalleryNamingConvention = /^\d{4}-\d{2}-\d{2}-[a-z0-9]*/i.test(fileName);
            return stats.isDirectory() && hasGalleryNamingConvention;
        });

        // Let's generate the list of gallery objects and call the doneHandler
        // when all callbacks have been executed. This is the difficulty of asynchronicity :(
        let numCallbacks = galleryDirNames.length;
        galleryDirNames.forEach(function(galleryDirName) {
            const subDirPath = GALLERIES_BASE_PATH + galleryDirName;
            fs.readdir(subDirPath, function (err, files) {
                const imgRex = /\.jpg$|\.jpeg$|\.png$/i;
                const allImages = files.filter(fileName => {
                    return imgRex.test(fileName);
                });
                const hasImages = allImages.length > 0;
                if (hasImages) {
                    const galleryName = galleryDirName;
                    const galleryUri = '/galleries/' + galleryName;
                    const gallery = {
                        name: galleryName,
                        galleryUri: galleryUri,
                        galleryThumbUri: galleryUri + '/' + allImages[0],
                    };
                    galleries.push(gallery);
                }

                const isThisTheLastCallback = --numCallbacks === 0;
                if (isThisTheLastCallback) {
                    // Attention: we never know in which order callbacks are called,
                    // so we have to sort the result
                    galleries.sort((g1, g2) => {
                        return g1.name < g2.name;
                    });
                    doneHandler(galleries);
                }
            });
        });
    });
}

function getGalleryFromFS (galleryKey, doneHandler) {
    const galleryName = getGalleryName(galleryKey);
    const gallery = {
        name: galleryName,
        images: [],
        uri: '/galleries/' + galleryName
    };

    const galleryFilePath = path.join(GALLERIES_BASE_PATH, galleryName);
    fs.readdir(galleryFilePath, 'utf8', function (error, files) {
        files.sort();

        const imgRex = /\.jpg$|\.jpeg$|\.png$/i;
        files.forEach(function (fileName) {
            if (imgRex.test(fileName)) {
                gallery.images.push({
                    imgUri: `/galleries/${galleryKey}/${fileName}`,
                    imgId: `${galleryKey}/${fileName}`,
                    label: fileName
                });
            }
        });

        doneHandler(gallery);
    });
}

function getGalleryName(galleryKey) {
    return galleryKey;
}

module.exports = {
    getGalleries: getGalleriesFromFS,
    getGallery: getGalleryFromFS
};