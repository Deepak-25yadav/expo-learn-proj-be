const express = require('express');
const router = express.Router();
const Admission = require('../models/Admission');

// @route   POST /api/admissions
// @desc    Submit an admission enquiry
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { parentName, studentName, phone, email, classApplying, message } = req.body;
    console.log("admission post api request called", { parentName, studentName, phone, email, classApplying, message })

    // Validation
    if (!parentName || !studentName || !phone || !classApplying) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const newAdmission = new Admission({
      parentName,
      studentName,
      phone,
      email,
      classApplying,
      message,
    });

    const savedAdmission = await newAdmission.save();

    res.status(201).json({ success: true, data: savedAdmission });
  } catch (err) {
    console.error('Error saving admission enquiry:', err.message);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// @route   GET /api/admissions
// @desc    Get all admission enquiries (for admin dashboard)
// @access  Private (Simplified to Public for learning)
router.get('/', async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });

    console.log("admission get api request called", { admissions })

    res.json({ success: true, count: admissions.length, data: admissions });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
