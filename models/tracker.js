const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trackerSchema = new Schema ({
  createdAt: Date,
  trackerModelID: String,
  userId: String,
  token: String,
  lastSync: Date
});

module.exports = mongoose.model('Tracker', trackerSchema);
