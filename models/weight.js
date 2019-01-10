const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const weightSchema = new Schema ({
  userId: String,
  time: String,
  value: Number
});

module.exports = mongoose.model('Weight', weightSchema);
