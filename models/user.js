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
  language: String,
  country: String,
  zipcode: Number,
  height: Number,
  trackerIds: [String],
  weightId: String,
  email: String,
  password: String,
  loggedIn: Boolean
});

module.exports = mongoose.model('User', userSchema);
