// this connection model will define connection between two users!

const mongoose = require('mongoose');

const connnectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // reference to the User model
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // reference to the User model
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['ignored', 'interested', 'accepted', 'rejected'],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  },
);

// it's a compound index which will make the query faster
connnectionRequestSchema.index({
  fromUserId: 1,
  toUserId: 1,
});

connnectionRequestSchema.pre('save', function () {
  connectionRequest = this;
  // check if the fromUserId is same toUserId - it should not be same!!!
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error('you cannot sent connection request to yourself!');
  }
});

const ConnnectionRequest = new mongoose.model(
  'ConnectionRequest',
  connnectionRequestSchema,
);

module.exports = ConnnectionRequest;
