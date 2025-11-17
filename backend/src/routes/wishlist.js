const express = require("express");
const router = express.Router();
const wishlistCtrl = require("../controllers/wishlistController");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

// Wishlist page
router.get("/", wishlistCtrl.getWishlist);

// Toggle Wishlist
router.post("/toggle", wishlistCtrl.toggleWishlist);

module.exports = router;
