const express = require("express");
const router = express.Router();
const addressCtrl = require("../controllers/addressController");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

// View all addresses
router.get("/", addressCtrl.getAddresses);

// Add address
router.post("/add", addressCtrl.addAddress);

// Update address
router.post("/update/:id", addressCtrl.updateAddress);

// Delete address
router.post("/delete/:id", addressCtrl.deleteAddress);

// Default address
router.post("/default/:id", addressCtrl.setDefaultAddress);

module.exports = router;
