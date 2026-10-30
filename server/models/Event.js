const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  venue: { type: String, required: true },
  registrationsCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Event', eventSchema);