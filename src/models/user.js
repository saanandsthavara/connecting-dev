const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 50,
    },
    gender: {
      type: String,
      required: true,
      validate(value) {
        if (!['male', 'female', 'other'].includes(value)) {
          throw new Error('Invalid gender');
        }
      },
    },
    location: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      default:
        'https://media.istockphoto.com/id/1142192548/vector/man-avatar-profile-male-face-silhouette-or-icon-isolated-on-white-background-vector.jpg?s=1024x1024&w=is&k=20&c=ISYAkNv_k8SCN_pHkYWqlWdGSbirhx_yCigo7QC8NAw=',
    },
    about: {
      type: String,
      default:
        'This is a default about section. Please update your about section.',
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('User', userSchema);
