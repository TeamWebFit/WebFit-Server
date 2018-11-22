const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stepsSchema = new Schema ({
  trackerId: String,
  time: String,
  value: String
});

module.exports = mongoose.model('Steps', stepsSchema);
