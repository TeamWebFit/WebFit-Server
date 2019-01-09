const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const weightSchema = new Schema ({
  date: String,
  value: Number,
  userId: String,
});

module.exports = mongoose.model('Weight', weightSchema);
