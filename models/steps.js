const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stepsSchema = new Schema ({
  userId: String,
  trackerId: String,
  time: Date,
  value: Number
});

module.exports = mongoose.model('Steps', stepsSchema);
