const jwt = require('jsonwebtoken');
const User = require('../models/user');

// we are going to create a middleware for authentication and authorization
const userAuth = async (req, res, next) => {
  // read the token from the request header
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error('Invalid Token');
    }

    const decoded = jwt.verify(token, 'devTINDER@8899');
    const { _id } = decoded;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(400).send('Token is not valid');
  }
};

module.exports = {
  userAuth,
};
