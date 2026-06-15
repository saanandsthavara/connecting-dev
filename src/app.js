const express = require('express');

const app = express();

app.get('/apitesting', (req, res) => {
  console.log('This is api-testing endpoint');
  res.send('This is another api endpoint');
});

app.post('/apitesting', (req, res) => {
  console.log('This is the api-testing endpoint');
  res.send('This is the POST api endpoint');
});

app.delete('/apitesting', (req, res) => {
  console.log('This is the api-testing endpoint');
  res.send('This is the DELETE api endpoint');
});

app.get('/api-users', (req, res) => {
  console.log('This is the api-users api endpoint');
  res.send('This is the users api endpoint');
});

app.post('/api-users/:userId', (req, res) => {
  const userId = req.params.userId;
  const params = req.query;
  console.log(`This is the api-users api endpoint for user with ID: ${userId}`);
  console.log('params', params);
  res.send(`This is the POST users api endpoint for user with ID: ${userId}`);
});

app.delete('/api-users/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log(`This is the api-users endpoint for user with ID: ${userId}`);
  res.send(`This is the DELETE users api endpoint for user with ID: ${userId}`);
});

app.get('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log(`This is the api-users endpoint for user with ID: ${userId}`);
  res.send(`This is the GET users api endpoint for user with ID: ${userId}`);
});

app.get('/', (req, res) => {
  res.send('Hello! this function is called request handler11111');
});

app.listen(7777, () => {
  console.log('Server is running on port 7777');
});
