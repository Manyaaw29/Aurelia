const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);

// Protected routes
router.get('/me', protect, userController.getProfile);
router.put('/me', protect, userController.updateProfile);
router.put('/change-password', protect, userController.changePassword);
router.post('/logout', protect, userController.logout);

// Address management
router.get('/addresses', protect, userController.getAddresses);
router.post('/addresses', protect, userController.addAddress);
router.put('/addresses/:id', protect, userController.updateAddress);
router.delete('/addresses/:id', protect, userController.deleteAddress);
router.put('/addresses/:id/default', protect, userController.setDefaultAddress);

module.exports = router;
