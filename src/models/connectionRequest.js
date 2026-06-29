// this connection model will define connection between two users!

const mongoose = require('mongoose');

const connnectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['ignore', 'interested', 'accepted', 'rejected'],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  },
);

const ConnnectionRequestModel = new mongoose.model(
  'connectionRequest',
  connnectionRequestSchema,
);

module.exports = ConnnectionRequestModel;
