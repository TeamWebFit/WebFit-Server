const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
  createdAt: String,
  updatedAt: String,
  lastLogin: String,
  firstName: String,
  name: String,
  authToken: String,
  dateOfBirth: String,
  gender: Number,
  active: Boolean,// @defaultValue(value: false)
  userGroup: Number,
  height: Number,
  trackerIds: [String],
  weightId: Number,
  email: String,
  password: String,
  loggedIn: Boolean,
  guest: Boolean,
  profilePic: String,
  allowsteps: Number,
  allowheart: Number,
  allowweight: Number
});

module.exports = mongoose.model('User', userSchema);
