const express = require("express");
const router = express.Router();

const productCtrl = require("../controllers/productController");

// Homepage
router.get("/", productCtrl.home);

// Collections page
router.get("/collections", productCtrl.getCollections);

// Category pages
router.get("/rings", productCtrl.getCategoryPage);
router.get("/bracelets", productCtrl.getCategoryPage);
router.get("/earrings", productCtrl.getCategoryPage);
router.get("/necklaces", productCtrl.getCategoryPage);

// Static pages
router.get("/about", productCtrl.getAbout);
router.get("/support", productCtrl.getSupport);
router.get("/terms", productCtrl.getTerms);
router.get("/stories", productCtrl.getStories);
router.get("/checkout", productCtrl.getCheckout);

// Individual product
router.get("/product/:id", productCtrl.getProduct);

// Add review
router.post("/product/review", productCtrl.addReview);

module.exports = router;
