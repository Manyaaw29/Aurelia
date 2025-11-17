const mongoose = require("mongoose");

// ---------- ADDRESS SUB-SCHEMA ----------
const addressSchema = new mongoose.Schema({
  type: { type: String, required: true },                // Home, Work, Other
  name: { type: String, required: true },                // Full name
  line1: { type: String, required: true },               // Address line 1
  line2: { type: String },                               // Address line 2
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, default: "India" },
  phone: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

// ---------- CART SUB-SCHEMA ----------
const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  qty: { type: Number, default: 1 }
});

// ---------- USER MAIN SCHEMA ----------
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },

  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },

  phone: { type: String },
  gender: { type: String },                              // Male, Female, Other
  dob: { type: String },                                 // dd-mm-yyyy OR iso string

  profilePicture: { type: String },                      // optional

  addresses: [addressSchema],                            // embedded addresses

  wishlist: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
  ],

  cart: [cartItemSchema],                                // embedded cart items

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
