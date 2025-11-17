const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },

  category: { type: String, required: true },  // earrings, rings, etc.

  price: { type: Number, required: true },     // final price
  originalPrice: { type: Number },             // optional
  discountPercent: { type: Number },           // optional e.g. 20

  images: [String],                            // array of 1–4 images

  description: { type: String },               // main product description
  stylingTip: { type: String },                // optional second description

  sku: { type: String },                       // example: BR512-AU
  material: { type: String },
  length: { type: String },
  weight: { type: String },

  stock: { type: Number, default: 10 },        // stock count
  rating: { type: Number, default: 4.5 },      // average rating

  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    date: { type: Date, default: Date.now }
  }],

  createdAt: { type: Date, default: Date.now },
});

productSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Add indexes for faster queries
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Product", productSchema);
