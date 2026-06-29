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

const validateEditProfileData = (req) => {
  // allowed edit fields
  const allowedEditFields = [
    'firstname',
    'lastname',
    'photoUrl',
    'gender',
    'age',
    'about',
    'skills',
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field),
  );

  return isEditAllowed;
};

const validatePasswordResetData = (req) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new Error('Current password and new password are required');
  }

  if (!validator.isStrongPassword(newPassword)) {
    throw new Error('Password is not strong enough');
  }
};

module.exports = {
  validateSignupData,
  validateEditProfileData,
  validatePasswordResetData,
};
