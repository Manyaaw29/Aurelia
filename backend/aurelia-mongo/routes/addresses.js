// routes/addresses.js
const express = require('express');
const router = express.Router();
// This line requires 'models/address.js'
const Address = require('../models/address');

// Add a test route
router.get('/', (req, res) => {
  res.send('Addresses route is working');
});

module.exports = router;