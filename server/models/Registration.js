const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  registerNumber: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  event: { type: String, required: true },
  eventDate: { type: String, required: true },
  participationType: { type: String, required: true },
  additionalDetails: { type: String, default: 'None' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registration', registrationSchema);