
var emailValidator = require('email-validator');

module.exports = {
    validateEmail: function (email) {
        return (emailValidator.validate(email) && email.length < 255);
    }
}