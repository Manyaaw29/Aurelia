// routes/products.js
const express = require('express');
const router = express.Router();
// This line requires 'models/product.js'
const Product = require('../models/product');

// Add a test route
router.get('/', (req, res) => {
  res.send('Products route is working');
});

module.exports = router;