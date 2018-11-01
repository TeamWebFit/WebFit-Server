const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  firstName: String,
  name: String,
  authToken: String,
  dateOfBirth: Date,
  gender: Number,
  active: Boolean,// @defaultValue(value: false)
  userGroup: Number,
  language: String,
  country: String,
  zipcode: Number,
  height: Number,
  trackerId: String,
  weightId: String,
  email: String,
  password: String
})

module.exports = mongoose.model('User', userSchema);
