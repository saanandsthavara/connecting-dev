const express = require('express');
const { validateSignupData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

router.post('/signup', async (req, res) => {
  console.log('coming here');
  try {
    // Validation of Data
    validateSignupData(req);
    const { firstName, lastName, emailId, password, age, gender, location } =
      req.body;
    // Encrypting the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password:', hashedPassword);

    //creating a new instance of user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      age,
      gender,
      location,
    });
    await user.save();
    res.status(201).send('User created successfully');
  } catch (error) {
    res.status(400).send('Something went wrong ' + error.message);
  }
});

router.post('/login', async (req, res) => {
  try {
    validateSignupData(req, { requireName: false, validatePassword: false });
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error('Invalid Credentials');
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid Credentials');
    } else {
      const token = await user.getJWT();
      res.cookie('token', token);
      res.status(200).send('User logged in successfully');
    }
  } catch (error) {
    res.status(400).send('Something went wrong ' + error.message);
  }
});

module.exports = router;
