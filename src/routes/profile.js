const express = require('express');
const { userAuth } = require('../middleware/auth');
const { validateEditProfileData } = require('../utils/validation');
const router = express.Router();

router.get('/profile/view', userAuth, async (req, res) => {
  try {
    const user = req.user;
    const safeUser = user.toObject ? user.toObject() : user;
    res.status(200).send(safeUser);
  } catch (err) {
    res.status(400).send('ERROR: ' + err.message);
  }
});

router.patch('/profile/edit', userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error('Invalid Edit Request');
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your profile has been updated successfully!`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send('Error ' + error.message);
  }
});

module.exports = router;
