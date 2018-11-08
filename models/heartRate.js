const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const heartRateSchema = new Schema ({
  userId: String,
  trackerId: String,
  time: Date,
  value: Number
});

module.exports = mongoose.model('heartRate', heartRateSchema);
