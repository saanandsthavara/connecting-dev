const express = require('express');
const { userAuth } = require('../middleware/auth');
const ConnnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
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

userRouter.get('/feed', userAuth, async (req, res) => {
  try {
    // we will exclude the users who status is accepted or rejected or if it's a logged in user itself!
    // once we get the list of user by using new Set() method,

    // we will find the users in the database who are not in the list of excluded users and return them as a feed!
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // get all the connections (sent + recieved)
    const connectionRequests = await ConnnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select('fromUserId toUserId');

    // logic for hidden fields
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((requests) => {
      hideUsersFromFeed.add(requests.fromUserId.toString());
      hideUsersFromFeed.add(requests.toUserId.toString());
    });

    const feedusers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_FIELDS)
      .skip(skip)
      .limit(limit);

    res.send({
      data: feedusers,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = userRouter;
