const express = require('express');
const { userAuth } = require('../middleware/auth');
const router = express.Router();

router.post('/sendConnectionRequest', userAuth, (req, res) => {
  const user = req.user;
  console.log('sending a conn req');
  res.send(`${user.firstName} sent the connection request!`);
});

module.exports = router;
