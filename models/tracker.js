const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trackerSchema = new Schema ({
  createdAt: Date,
  trackerTypeId: String,
  userId: String,
  token: String
});

module.exports = mongoose.model('Tracker', trackerSchema);
