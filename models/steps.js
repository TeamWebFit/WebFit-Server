const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stepsSchema = new Schema ({
  trackerId: String,
  userId: String,
  time: String,
  value: Number
});

module.exports = mongoose.model('Steps', stepsSchema);
