require('dotenv').config();

const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();
const { validateSignupData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middleware/auth');

app.use(express.json());
app.use(cookieParser());

//creating an API
app.post('/signup', async (req, res) => {
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

// login API
app.post('/login', async (req, res) => {
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

// profile API
app.get('/profile', userAuth, async (req, res) => {
  try {
    const user = req.user;
    const safeUser = user.toObject ? user.toObject() : user;
    res.status(200).send(safeUser);
  } catch (err) {
    res.status(400).send('ERROR: ' + err.message);
  }
});
// get user by email
app.get('/user', async (req, res) => {
  // we will get the email from the req body
  const email = req.body.email;
  try {
    const user = await User.find({ emailId: email });
    if (user.length === 0) {
      res.status(404).send('User not found');
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send('Something went wrong');
  }
});

// get all users
app.get('/fetch', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send('Something went wrong');
  }
});

// delete the user
app.delete('/delete', async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).send('User not found');
    } else {
      res.status(200).send('User deleted successfully');
    }
  } catch (error) {
    res.status(400).send('Something went wrong');
  }
});

// update the user
app.patch('/user/:userId', async (req, res) => {
  const userId = req.params?.userId;
  const updateData = req.body;

  try {
    const ALLOWED_UPDATES = ['photoUrl', 'about', 'age'];

    const isUpdateAllowed = Object.keys(updateData).every((update) =>
      ALLOWED_UPDATES.includes(update),
    );

    if (!isUpdateAllowed) {
      throw new Error('Invalid updates');
    }
    if (userData?.skills.length > 10) {
      throw new Error('Skills cannot be more than 10');
    }
    const user = await User.findByIdAndUpdate(userId, updateData, {
      runValidators: true,
    });
    if (!user) {
      res.status(404).send('User not found');
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    res.status(400).send('Something went wrong');
  }
});

// first we are going to connect to the database and then listen to the server

connectDB()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(7777, () => {
      console.log('Server is running on port 7777');
    });
  })
  .catch((err) => {
    console.log('Error connecting to the database', err);
  });
