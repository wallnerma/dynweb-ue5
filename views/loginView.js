const hbs = require('handlebars');
const layout = require('./layout');

hbs.registerPartial('login-form',
    `<h1>Login</h1>
     <form action="/login" method="post">
         <p><label>Benutzer: <br/><input type="text" name="username"></label></p>     
         <p><label>Passwort: <br/><input type="password" name="password"></label></p>     
         <p><button type="submit">Login</button></p>     
     </form>
     <p>{{ message }}</p>
     `);

function renderLoginForm (data) {
    data = data || {}; // If we got no data create an empty object instead
    const viewModel = Object.assign(data, { bodyPartial: 'login-form' });
    return layout(viewModel);
}

module.exports = {
    render: renderLoginForm
};