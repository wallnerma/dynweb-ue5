// Hint: be aware that storing passwords in clear-text is bad,
// bad practise and shall never be done in a real application.
const accounts = {
    'peter': 'swd16',
    'hans': 'swd16',
    'josef': 'swd16'
};

module.exports = {
    verifyCredentials: function (username, password) {

        // Note: this could be written much more concise
        // but for the sake of understanding...
        if (username && password) {

            // Hint: actually, the password is the return value of accounts[username].
            // But if the username is not known, _undefined_ will be returned. This lets
            // us know if the user exists.
            const userExists = accounts[username];
            if (userExists) {

                // We query the password again with accounts[username].
                // We could have written this more concise.
                return password === accounts[username];
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
};