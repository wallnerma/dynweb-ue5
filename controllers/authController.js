const loginView = require('./../views/loginView');
const authentication = require('./../models/authenticationModel');

function handleGetLoginForm(req, res) {
    res.send(loginView.render());
}

function handleAuthenticationAttempt(req, res) {
    const userName = req.body.username;
    const password = req.body.password;
    console.log(userName);
    if (authentication.verifyCredentials(userName, password)) {
        req.session.user = userName;
        res.redirect(302, '/admin');
    } else {
        const data = {
            message: 'Username / Passwort Kombination stimmt nicht überein. Bitte versuchen Sie es erneut!'
        };
        res.status(403).send(loginView.render(data));
    }
}

function handleAuthorizeRequest(req, res, next) {
    if (req.needsAuth) {
        if (req.session.user) {
            next();
        } else {
            res.redirect(302, '/login');
        }
    } else {
        next();
    }
}

function logout (req, res) {
    delete req.session.user;
    req.session.destroy();
    res.redirect(302, '/admin');
}

module.exports = {
    getLoginForm: handleGetLoginForm,
    postLogin: handleAuthenticationAttempt,
    authorizeRequest: handleAuthorizeRequest,
    logout: logout
};