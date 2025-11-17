const User = require("../models/User");

exports.getCart = async (req, res) => {
  const user = await User.findById(req.session.userId)
    .populate("cart.product")
    .lean();

  res.render("pages/cart", {
    cart: user.cart || []
  });
};

exports.addToCart = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.json({ success: false, redirect: '/auth/signin', message: 'Please login first' });
    }

    const { productId, quantity = 1 } = req.body;

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.json({ success: false, redirect: '/auth/signin', message: 'User not found' });
    }

    const existing = user.cart.find(item => item.product.toString() === productId);

    if (existing) {
      existing.qty += quantity;
      // Prevent qty from going below 1
      if (existing.qty < 1) existing.qty = 1;
    } else {
      user.cart.push({ product: productId, qty: Math.abs(quantity) });
    }

    await user.save();
    res.json({ success: true, message: 'Cart updated successfully', cart: user.cart });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.json({ success: false, message: 'Server error' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.json({ success: false, redirect: '/auth/signin' });
    }

    const { productId } = req.body;
    const user = await User.findById(req.session.userId);

    user.cart = user.cart.filter(item => item.product.toString() !== productId);

    await user.save();
    res.json({ success: true, message: 'Removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.json({ success: false, message: 'Server error' });
  }
};
