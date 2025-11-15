// models/Address.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  name: String,
  type: String, // Home, Office...
  line1: String,
  line2: String,
  city: String,
  state: String,
  zip: String,
  country: String,
  phone: String,
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Address', addressSchema);
