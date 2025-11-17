const User = require("../models/User");

exports.getWishlist = async (req, res) => {
  const user = await User.findById(req.session.userId)
    .populate("wishlist")
    .lean();

  res.render("pages/wishlist", { 
    wishlist: user.wishlist || [] 
  });
};

exports.toggleWishlist = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.json({ success: false, redirect: '/auth/signin', message: 'Please login first' });
    }

    const { productId } = req.body;
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.json({ success: false, redirect: '/auth/signin', message: 'User not found' });
    }

    const exists = user.wishlist.includes(productId);

    if (exists) {
      user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();

    res.json({ success: true, added: !exists, message: exists ? 'Removed from wishlist' : 'Added to wishlist' });
  } catch (error) {
    console.error('Toggle wishlist error:', error);
    res.json({ success: false, message: 'Server error' });
  }
};
