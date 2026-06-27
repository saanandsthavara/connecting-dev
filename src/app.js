require('dotenv').config();

const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();

app.use(express.json());

//creating an API
app.post('/signup', async (req, res) => {
  //creating a new instance of user model
  const user = new User(req.body);
  await user.save();
  res.status(201).send('User created successfully');
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
app.patch('/user', async (req, res) => {
  const userId = req.body.userId;
  const updateData = req.body;
  try {
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
