const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trackerSchema = new Schema ({
  createdAt: String,
  trackerModelID: String,
  userId: String, //Database User
  access_token: String,
  token_type: String,
  expires_in: Number,
  refreshtoken: String, //Google Fit
  user_id: String, //Fitbit User
  lastSync: String,
  stepsId: String
});

module.exports = mongoose.model('Tracker', trackerSchema);
