const express = require("express");
const router = express.Router();
const cartCtrl = require("../controllers/cartController");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

// View cart
router.get("/", cartCtrl.getCart);

// Add to cart
router.post("/add", cartCtrl.addToCart);

// Remove from cart
router.post("/remove", cartCtrl.removeFromCart);

module.exports = router;
