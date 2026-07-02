const express = require('express');
const { userAuth } = require('../middleware/auth');
const ConnnectionRequest = require('../models/connectionRequest');
const userRouter = express.Router();

const USER_SAFE_FIELDS = [
  'firstName',
  'lastName',
  'photoUrl',
  'age',
  'location',
  'about',
  'skills',
  'gender',
];
// Get all the pending connections
userRouter.get('/user/requests/recieved', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnnectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate('fromUserId', [
      'firstName',
      'lastName',
      'photoUrl',
      'about',
      'skills',
      'location',
    ]);
    res.json({
      message: 'Pending connection requests for ' + loggedInUser.firstName,
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: 'accepted' },
        { fromUserId: loggedInUser._id, status: 'accepted' },
      ],
    })
      .populate('fromUserId', USER_SAFE_FIELDS)
      .populate('toUserId', USER_SAFE_FIELDS);

    const data = connectionRequests.map((request) => {
      if (request.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return request.toUserId;
      }
      return request.fromUserId;
    });

    res.json({
      message: 'Sent connection requests for ' + loggedInUser.firstName,
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = userRouter;
