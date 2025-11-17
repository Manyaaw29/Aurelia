const Product = require("../models/Product");

exports.home = async (req, res) => {
  try {
    // Homepage is static, no need to load products
    res.render("pages/home");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

exports.getCollections = async (req, res) => {
  try {
    const products = await Product.find()
      .select('title slug category price originalPrice discountPercent images rating stock')
      .lean();
    res.render("pages/collections", { products });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

exports.getCategoryPage = async (req, res) => {
  try {
    const category = req.path.substring(1);
    const products = await Product.find({ category })
      .select('title slug category price originalPrice discountPercent images rating stock')
      .lean();
    res.render(`pages/${category}`, { products, category });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

exports.getProduct = async (req, res) => {
  try {
    const identifier = req.params.id;
    let product = await Product.findOne({ slug: identifier }).lean();
    if (!product) product = await Product.findById(identifier).lean();
    if (!product) return res.status(404).send("Product not found");
    // Limit reviews to last 10 for performance
    if (product.reviews && product.reviews.length > 10) {
      product.reviews = product.reviews.slice(-10);
    }
    res.render("pages/product", { product });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

exports.getAbout = (req, res) => res.render("pages/about_us");
exports.getSupport = (req, res) => res.render("pages/support");
exports.getTerms = (req, res) => res.render("pages/terms");
exports.getStories = (req, res) => res.render("pages/customerstories");
exports.getCheckout = (req, res) => res.render("pages/checkout");

exports.addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    if (!req.session.userId) {
      return res.json({ success: false, message: 'Please login to review' });
    }
    
    const Product = require("../models/Product");
    const User = require("../models/User");
    
    const product = await Product.findById(productId);
    const user = await User.findById(req.session.userId);
    
    if (!product || !user) {
      return res.json({ success: false, message: 'Invalid product or user' });
    }
    
    product.reviews.push({
      user: user._id,
      userName: `${user.firstName} ${user.lastName}`,
      rating: Number(rating),
      comment: comment,
      date: new Date()
    });
    
    // Update average rating
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = totalRating / product.reviews.length;
    
    await product.save();
    
    res.json({ 
      success: true, 
      message: 'Review added successfully',
      review: product.reviews[product.reviews.length - 1]
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.json({ success: false, message: 'Server error' });
  }
};
