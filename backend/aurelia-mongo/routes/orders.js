// routes/orders.js
const express = require('express');
const router = express.Router();
// This line requires 'models/order.js'
const Order = require('../models/order');

// Add a test route
router.get('/', (req, res) => {
  res.send('Orders route is working');
});

module.exports = router;