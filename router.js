// External modules
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

// Internal modules
const homeController = require('./controllers/homeController');
const galleriesController = require('./controllers/galleriesController');
const shoppingCartController = require('./controllers/shoppingCartController');
const errorController = require('./controllers/errorController');
const authController = require('./controllers/authController');
const reportsController = require('./controllers/reportsController');

const getSessionConfig = function(app) {
    const inProduction = app.get('env') === 'production';
    return {

        // required key to sign the generated session ID cookies
        secret: 'a-Very-sECREt-K3y!',

        // Setting to false will cause the session to not be saved back to the store if it wasn't modified
        resave: false,

        // if a session has been created and has not been modified (e.g. in case of a failing login attempt)
        // it'll not be saved in session store
        saveUninitialized: false,
        cookie: {
            secure: inProduction,
            httpOnly: true
        }
    }
};

const needsAuth = function (req, res, next) {
    req.needsAuth = true;
    next();
};

module.exports = function (app) {
    app.use(express.static('public'));

    app.get('/admin', needsAuth);

    /* Setup session mechanism */
    app.use(expressSession(getSessionConfig(app)));
    app.use(authController.authorizeRequest);

    /* Reports related routes */
    app.get('/admin', reportsController.getReports);

    /* Authentication related routes */
    app.get('/login', authController.getLoginForm);
    app.post('/login', bodyParser.urlencoded({ extended: true }), authController.postLogin);
    app.get('/logout', authController.logout)

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