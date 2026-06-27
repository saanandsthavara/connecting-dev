// connection string : mongodb+srv://sdsthavara:myMongoDB123@namstenodecluster.w5kch0m.mongodb.net/?appName=NamsteNodeCluster

const mongoose = require('mongoose');

const connectDB = async () => {
  console.log('Connecting to MongoDB...');
  console.log('MongoDB URI:', process.env.MONGODB_URI);
  await mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('MongoDB connected successfully');
    })
    .catch((err) => {
      console.log('Error connecting to MongoDB', err);
    });
};

module.exports = connectDB;
