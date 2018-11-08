const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trackerModelSchema = new Schema ({
  createdAt: Date,
  manufacturer: String,
  type: String,
  apiLink: String,
  trackerIds: String,
});

module.exports = mongoose.model('TrackerModel', trackerModelSchema);
