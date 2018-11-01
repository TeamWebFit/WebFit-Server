const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trackerSchema = new Schema ({
  name: String,
  trackerModel: String,
  userId: String
})

module.exports = mongoose.model('Tracker', trackerSchema);
