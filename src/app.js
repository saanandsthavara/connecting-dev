const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello! this function is called request handler11111');
});

app.get('/apitesting', (req, res) => {
  console.log('This is api-testing endpoint');
  res.send('This is another api endpoint');
});

app.get('/api-users', (req, res) => {
  console.log('This is the api-users api endpoint');
  res.send('This is the users api endpoint');
});

app.listen(7777, () => {
  console.log('Server is running on port 7777');
});
