const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trackerTypeSchema = new Schema ({
  createdAt: Date,
  manufacturer: String,
  type: String,
  apiLink: String
});

module.exports = mongoose.model('TrackerType', trackerTypeSchema);
