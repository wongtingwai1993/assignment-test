
var emailValidator = require('email-validator');

module.exports = {
    validateEmail: function (email) {
        return (email !== null & emailValidator.validate(email) && email.length < 255);
    }
}