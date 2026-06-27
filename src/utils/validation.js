const validator = require('validator');

const validateSignupData = (req, options = {}) => {
  const { requireName = true, validatePassword = true } = options;
  const { firstName, lastName, emailId, password } = req.body;

  if (requireName && (!firstName || !lastName)) {
    throw new Error('Name is not valid');
  }

  if (emailId !== undefined && !validator.isEmail(emailId)) {
    throw new Error('Email is not valid');
  }

  if (
    validatePassword &&
    password !== undefined &&
    !validator.isStrongPassword(password)
  ) {
    throw new Error('Password is not strong enough');
  }
};

module.exports = { validateSignupData };
