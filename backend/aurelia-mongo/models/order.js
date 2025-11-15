// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{ productId: String, name: String, price: Number, qty: Number }],
  total: Number,
  customerName: String,
  address: Object,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
