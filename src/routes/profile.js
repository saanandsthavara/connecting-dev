const express = require('express');
const bcrypt = require('bcrypt');
const { userAuth } = require('../middleware/auth');
const {
  validateEditProfileData,
  validatePasswordResetData,
} = require('../utils/validation');
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

router.patch('/profile/forgotpassword', userAuth, async (req, res) => {
  try {
    validatePasswordResetData(req);

    const loggedInUser = req.user;
    const { oldPassword, newPassword } = req.body;

    const isCurrentPasswordValid = await bcrypt.compare(
      oldPassword,
      loggedInUser.password,
    );

    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = hashedPassword;
    await loggedInUser.save();

    res.status(200).json({
      message: 'Password updated successfully',
    });
  } catch (error) {
    res.status(400).send('ERROR: ' + error.message);
  }
});

module.exports = router;
