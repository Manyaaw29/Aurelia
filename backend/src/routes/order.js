const express = require("express");
const router = express.Router();
const orderCtrl = require("../controllers/orderController");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

// Place order
router.post("/place", orderCtrl.placeOrder);

// My Orders page
router.get("/myorders", orderCtrl.getMyOrders);

module.exports = router;
