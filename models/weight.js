const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const weightSchema = new Schema ({
  kilogram: Number,
  userId: String
})

module.exports = mongoose.model('Weight', weightSchema);
