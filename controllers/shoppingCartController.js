const shoppingCartView = require('../views/shoppingCartView');
const orderFormView = require('../views/orderFormView');
const orderSuccessView = require('../views/orderSuccessView');
const shoppingCart = require('../models/cookieBasedShoppingCart');

function handleGetShoppingCart (req, res) {
    const images = shoppingCart.getImages(req);
    res.send(shoppingCartView.render(images));
}

function handlePostAddImage (req, res) {
    const imgIdToAdd = req.body.imgId;

    shoppingCart.addImage(req, res, imgIdToAdd);

    const returnUri = req.body.returnUri || '/';
    res.redirect(302, returnUri);
}

function handlePostRemoveImage (req, res) {
    const imgIdToRemove = req.body.imgId;

    shoppingCart.removeImage(req, res, imgIdToRemove);
    res.redirect(302, '/shopping-cart');
}

function handlePostClear (req, res) {
    shoppingCart.clear(res);
    res.redirect(302, '/shopping-cart');
}

function handleGetOrderForm (req, res) {
    res.send(orderFormView.render());
}

function handlePostOrder (req, res, next) {

    // TODO Would be good to do some server-side validation as well
    // This {...} syntax is called destructuring and is a nice and concise
    // way in ES6 / ES2015 to extract some variables from an object (or array)
    const {firstName, lastName, street, zipCity, phone} = req.body;

    function generateResponse(err) {
        if (err) {

            // Note: next is always passed as a third parameter in ordinary
            // express middleware functions. With next we simply forward request
            // handling to the next middleware in the routing config. If we
            // call next with an error object, all routes are skipped by express up
            // until error handling middleware (see 500 handling).
            next(err);
        } else {
            res.redirect(303, '/shopping-cart/order-success');
        }
    }

    shoppingCart.order(req, res, firstName, lastName, street, zipCity, phone, generateResponse);
}

function handleGetOrderSuccess (req, res) {
    const orderedImages = shoppingCart.getOrderedImages(req);
    if (orderedImages.length > 0) {
        shoppingCart.clearOrderedImages(res);
        res.send(orderSuccessView.render(orderedImages));
    } else {
        res.redirect(302, '/');
    }
}

module.exports = {
    getShoppingCart: handleGetShoppingCart,
    postAddImage: handlePostAddImage,
    postRemoveImage: handlePostRemoveImage,
    postClear: handlePostClear,
    getOrderForm: handleGetOrderForm,
    postOrder: handlePostOrder,
    getOrderSuccess: handleGetOrderSuccess
};