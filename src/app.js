require('dotenv').config();

const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(express.json());
app.use(cookieParser());
app.use(cors());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/requests');
const userRouter = require('./routes/user');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

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
