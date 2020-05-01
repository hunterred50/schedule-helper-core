const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: String,
  description: String,
  category: String,
  project: String,
  startTime: Number,
  duration: Number,
  userId: String
})

module.exports = mongoose.model('Item', itemSchema);