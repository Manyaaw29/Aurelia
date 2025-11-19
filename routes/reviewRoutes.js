const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/product/:productId', reviewController.getProductReviews);

// Protected routes (require authentication)
router.post('/', protect, reviewController.createReview);
router.put('/:id', protect, reviewController.updateReview);
router.delete('/:id', protect, reviewController.deleteReview);
router.post('/:id/helpful', protect, reviewController.markHelpful);

// Admin routes
router.put('/:id/approve', protect, authorize('admin'), reviewController.approveReview);

module.exports = router;