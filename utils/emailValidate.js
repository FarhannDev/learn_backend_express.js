const validator = require("validator");

const validateEmail = (email) => {
  return validator.isEmail(email);
};

module.exports = validateEmail;
