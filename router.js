// External modules
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Internal modules
const homeController = require('./controllers/homeController');
const galleriesController = require('./controllers/galleriesController');
const shoppingCartController = require('./controllers/shoppingCartController');
const errorController = require('./controllers/errorController');

module.exports = function (app) {
    app.use(express.static('public'));

    app.get('/', homeController.getHome);

    app.get('/galleries', galleriesController.getAllGalleries);
    // TODO a middleware that checks if a gallery exists
    app.get('/galleries/:galleryKey', galleriesController.getGallery);

    app.use('/shopping-cart', cookieParser());
    app.get('/shopping-cart', shoppingCartController.getShoppingCart);
    // Hint: express allows to register multiple middleware functions at once
    app.post('/shopping-cart/add', bodyParser.urlencoded({ extended: true }), shoppingCartController.postAddImage);
    app.post('/shopping-cart/remove', bodyParser.urlencoded({ extended: true }), shoppingCartController.postRemoveImage);
    app.post('/shopping-cart/clear', shoppingCartController.postClear);
    app.get('/shopping-cart/order', shoppingCartController.getOrderForm);
    app.post('/shopping-cart/order', bodyParser.urlencoded({ extended: true }), shoppingCartController.postOrder);
    app.get('/shopping-cart/order-success', shoppingCartController.getOrderSuccess);

    app.use(errorController.handle404);
    app.use(errorController.handle500);
};