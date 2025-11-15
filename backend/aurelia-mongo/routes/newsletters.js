// routes/newsletters.js
const express = require('express');
const router = express.Router();
// This line requires 'models/newsletter.js'
const Newsletter = require('../models/newsletter');

router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }
    const doc = new Newsletter({ email });
    await doc.save();
    res.status(201).json({ message: 'Subscribed' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Already subscribed' });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;