const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  orderId: { type: String, required: true, unique: true }, // AU-102930 etc

  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      qty: { type: Number, required: true },
      price: { type: Number, required: true }               // final price per item
    }
  ],

  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: "cod" },          // cod | upi | card | netbanking

  shippingAddress: {
    name: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    zip: String,
    phone: String
  },

  status: { type: String, default: "Processing" },          // Processing, Shipped, Delivered
  orderedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
