const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is invalid!");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("firstName should be 4-50 characters!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is Invalid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter a Strong Password");
  }
};

module.exports = { validateSignUpData };
