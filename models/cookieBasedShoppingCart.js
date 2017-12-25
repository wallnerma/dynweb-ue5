const path = require('path');
const fs = require('fs');
const hbs = require('handlebars');

// NOTE: I'm not totally satisfied with leaking the knowledge of HTTP cookies
// into the model layer. However, at least the module name states that fact clearly.
// Maybe a cleaner solution would be to serve the shopping card model with a persistence
// object (strategy design pattern) that is responsible for storing and
// retrieving shopping cart data.

const ORDER_RECEIPTS_PATH = path.join(process.cwd(), 'Bestellungen');
const ORDERED_IMAGES_COOKIE_KEY = 'orderedImages';
const SHOPPING_CART_COOKIE_KEY = 'shoppingCart';

// Note: we don't bother extracting that to a file since this isn't really
// a view in a web application sense and hence would confuse us when being
// placed into the templates folder.
const orderReceiptTemplate = hbs.compile(`Bestellung

Datum: {{orderDate}}

{{firstName}} {{lastName}}
{{street}}
{{city}}
{{#if phone}}
{{phone}}
{{else}}
Keine Telefonnummer
{{/if}}

Bestellte Bilder:
{{#each orderedImages}}
- {{this}}
{{/each}}
`);


/* **************** */
/* Helper functions */
/* **************** */

function getShoppingCartContents (req) {
    return req.cookies[SHOPPING_CART_COOKIE_KEY] || [];
}

function updateCartCookie (res, images) {
    res.cookie(SHOPPING_CART_COOKIE_KEY, images, {httpOnly: true});
}

function getOrderedImages (req) {
    return req.cookies[ORDERED_IMAGES_COOKIE_KEY] || [];
}

function updateOrderedCookie(res, imageIds) {
    res.cookie(ORDERED_IMAGES_COOKIE_KEY, imageIds, {httpOnly: true});
}

function clearOrderedImages (res) {
    res.clearCookie(ORDERED_IMAGES_COOKIE_KEY);
}

function zeroPad (val, len = 2) {
    const str = String(val);
    return str.length === len ? str : zeroPad('0' + str, len);
}

// Hint: ES6 / ES2015 allows to define default values
// if a parameter isn't passed by client code
function formatOrderDate (orderDate = new Date()) {
    // Hint: normally we would use something like moment.js to do date operations
    const dateStr =
        zeroPad(orderDate.getDate())
        + '.' + zeroPad((orderDate.getMonth() + 1))
        + '.' + orderDate.getFullYear();
    const timeStr =
        zeroPad(orderDate.getHours())
        + ':' + zeroPad(orderDate.getMinutes());

    return dateStr + ' ' + timeStr;
}

function ensureOrderReceiptPathExists () {
    if (!fs.existsSync(ORDER_RECEIPTS_PATH)) {
        fs.mkdirSync(ORDER_RECEIPTS_PATH);
    }
}

function getUniqueFileName (dirPath, orderDate, lastName, firstName, counter = 0) {
    const formatOrderDate = orderDate => {
        return orderDate.getFullYear()
            + '-' + zeroPad(orderDate.getMonth() + 1, 2)
            + '-' + zeroPad(orderDate.getDate(), 2);
    };

    const counterStr = counter === 0 ? '' : ('_' + counter);
    const formattedOrderDate = formatOrderDate(orderDate);
    const fileNameToProbe = `${formattedOrderDate}${counterStr}_${lastName}_${firstName}`;

    if (fs.existsSync(path.join(dirPath, fileNameToProbe))) {
        return getUniqueFileName(dirPath, orderDate, lastName, firstName, counter + 1);
    } else {
        return fileNameToProbe;
    }
}

/* ************** */
/* Business logic */
/* ************** */

function getImages (req) {
    const imagesInCart = getShoppingCartContents(req);
    const images = [];
    imagesInCart.forEach(function(imgId) {
        const label = imgId.slice(imgId.lastIndexOf('/') + 1);
        images.push({
            imgUri: '/galleries/' + imgId,
            imgId: imgId,
            label: label
        });
    });
    return images;
}

function addImage (req, res, imageId) {
    const imagesInCart = getShoppingCartContents(req);
    const imageNotYetAdded = !imagesInCart.includes(imageId);
    if (imageNotYetAdded) {
        imagesInCart.push(imageId);
        updateCartCookie(res, imagesInCart);
    }
}

function removeImage (req, res, imageId) {
    const imagesInCart = getShoppingCartContents(req);
    if (imagesInCart.includes(imageId)) {

        // Hint: splice is the way to remove an element from an array
        imagesInCart.splice(imagesInCart.indexOf(imageId), 1);
        updateCartCookie(res, imagesInCart);
    }
}

function clearShoppingCart (res) {
    updateCartCookie(res, []);
}

function setOrderedImages (res, imageIds) {
    updateOrderedCookie(res, imageIds);
}

function placeOrder (req, res, firstName, lastName, street, zipCity, phone, orderPlacedHandler) {
    const imagesInCart = getShoppingCartContents(req);
    const orderDate = new Date();

    const orderReceipt = orderReceiptTemplate({
        orderDate: formatOrderDate(orderDate),
        firstName: firstName,
        lastName: lastName,
        street: street,
        city: zipCity,
        phone: phone,
        orderedImages: imagesInCart
    });

    ensureOrderReceiptPathExists();
    const fileName = getUniqueFileName(ORDER_RECEIPTS_PATH, orderDate, lastName, firstName);
    fs.writeFile(path.join(ORDER_RECEIPTS_PATH, fileName), orderReceipt, 'utf8', function(err) {
        setOrderedImages(res, imagesInCart);
        clearShoppingCart(res);

        orderPlacedHandler(err);
    });
}

module.exports = {
    getImages: getImages,
    addImage: addImage,
    removeImage: removeImage,
    clear: clearShoppingCart,
    order: placeOrder,
    getOrderedImages: getOrderedImages,
    clearOrderedImages: clearOrderedImages
};