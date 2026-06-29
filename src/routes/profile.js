const express = require('express');
const { userAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/profile', userAuth, async (req, res) => {
  try {
    const user = req.user;
    const safeUser = user.toObject ? user.toObject() : user;
    res.status(200).send(safeUser);
  } catch (err) {
    res.status(400).send('ERROR: ' + err.message);
  }
});

module.exports = router;
