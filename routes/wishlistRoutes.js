const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

// Wishlist routes are accessible to both guests and authenticated users
// router.use(protect); // Commented out to allow guest wishlists

router.get('/', wishlistController.getWishlist);
router.post('/add/:productId', wishlistController.addToWishlist);
router.post('/add', wishlistController.addToWishlist); // Support POST /api/wishlist/add with body
router.delete('/remove/:productId', wishlistController.removeFromWishlist);
router.post('/move-to-cart/:productId', wishlistController.moveToCart);

module.exports = router;
