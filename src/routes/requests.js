const express = require('express');
const { userAuth } = require('../middleware/auth');
const ConnnectionRequest = require('../models/connectionRequest');
const router = express.Router();
const User = require('../models/user');

router.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    // Restricting the status to be either ignored or interested
    const allowedStatus = ['ignored', 'interested'];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status type' + status,
      });
    }
    // Checking the existing connection request
    const existingConnectionRequest = await ConnnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      ],
    });
    if (existingConnectionRequest) {
      return res.status(400).json({
        message: 'connection request already exisits',
      });
    }

    // checking if the userId is present or not
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({
        message: 'User not found!',
      });
    }

    const connectionRequest = new ConnnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    const data = await connectionRequest.save();
    res.json({
      message: req.user.firstName + ' is ' + status + ' by ' + toUser.firstName,
      data,
    });
  } catch (error) {
    res.status(400).send('ERROR ' + error.message);
  }
});

module.exports = router;
