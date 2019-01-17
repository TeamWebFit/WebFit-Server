const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workoutSchema = new Schema ({
  userId: String,
  date: String,
  title: String,
  time: String
});

module.exports = mongoose.model('Workout', workoutSchema);
