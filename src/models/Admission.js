const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  parentName: {
    type: String,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  classApplying: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Admission', admissionSchema);
