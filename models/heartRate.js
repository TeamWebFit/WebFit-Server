const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const heartRateSchema = new Schema ({
  trackerId: String,
  time: String,
  value: Number
});

module.exports = mongoose.model('HeartRate', heartRateSchema);
