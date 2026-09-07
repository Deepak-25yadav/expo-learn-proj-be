const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// @route   POST /api/contact
// @desc    Submit a contact message
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    // Validation
    if (!name || !phone || !message) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const newContact = new Contact({
      name,
      phone,
      email,
      subject,
      message,
    });

    const savedContact = await newContact.save();

    console.log("contacts post api request called 👌👌", savedContact)
    res.status(201).json({ success: true, data: savedContact });
  } catch (err) {
    console.error('Error saving contact message:', err.message);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// @route   GET /api/contact
// @desc    Get all contact messages
// @access  Private (Simplified to Public for learning)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    console.log("contacts get api request called 👌👌", contacts)
    res.json({ success: true, count: contacts.length, data: contacts });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
