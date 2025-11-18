const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.get('/', orderController.getUserOrders);
router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrderById);
router.put('/:id/cancel', orderController.cancelOrder);

// Admin routes
router.get('/admin/all', authorize('admin'), orderController.getAllOrders);
router.put('/admin/:id/status', authorize('admin'), orderController.updateOrderStatus);

module.exports = router;
