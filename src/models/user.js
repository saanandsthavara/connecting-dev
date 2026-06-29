const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email' + value);
        }
      },
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
      enum: {
        type: String,
        enum: {
          values: ['male', 'female', 'others'],
          message: `{VALUE} is not a valid gender type`,
        },
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
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error('Invalid URL');
        }
      },
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

userSchema.methods.getJWT = function () {
  return jwt.sign({ _id: this._id }, 'devTINDER@8899');
};
userSchema.methods.validatePassword = async function (passwordFromUser) {
  const isPasswordValid = await bcrypt.compare(passwordFromUser, this.password);
  return isPasswordValid;
};

module.exports = mongoose.model('User', userSchema);
