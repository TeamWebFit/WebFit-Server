const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const weightSchema = new Schema ({
  userId: String,
  trackerId: String,
  time: Date,
  value: Number
});

module.exports = mongoose.model('Weight', weightSchema);
