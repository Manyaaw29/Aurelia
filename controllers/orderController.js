const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod, shippingPrice, taxPrice, discount } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No order items provided'
            });
        }

        // Calculate prices
        const itemsPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);
        const totalPrice = itemsPrice + (shippingPrice || 0) + (taxPrice || 0) - (discount || 0);

        const order = await Order.create({
            user: req.user.id,
            items,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice: shippingPrice || 0,
            taxPrice: taxPrice || 0,
            discount: discount || 0,
            totalPrice
        });

        // Update product sales count
        for (const item of items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { sales: item.quantity, stockQuantity: -item.quantity }
            });
        }

        // Clear user's cart
        await User.findByIdAndUpdate(req.user.id, { cart: [] });

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('items.product')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product')
            .populate('user', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Make sure user can only see their own orders
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching order',
            error: error.message
        });
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check authorization
        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this order'
            });
        }

        // Check if order can be cancelled
        if (['Shipped', 'Delivered', 'Cancelled'].includes(order.orderStatus)) {
            return res.status(400).json({
                success: false,
                message: `Cannot cancel order with status: ${order.orderStatus}`
            });
        }

        order.orderStatus = 'Cancelled';
        order.cancelledAt = new Date();
        order.cancelReason = req.body.reason || 'Cancelled by user';
        await order.save();

        // Restore product stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stockQuantity: item.quantity }
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            data: order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error cancelling order',
            error: error.message
        });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        
        let query = {};
        if (status) {
            query.orderStatus = status;
        }

        const skip = (page - 1) * limit;
        const total = await Order.countDocuments(query);

        const orders = await Order.find(query)
            .populate('user', 'name email')
            .sort('-createdAt')
            .limit(Number(limit))
            .skip(skip);

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            pages: Math.ceil(total / limit),
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/admin/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status, note, trackingNumber, carrier } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        order.orderStatus = status;
        
        if (note) {
            order.statusHistory[order.statusHistory.length - 1].note = note;
        }

        if (status === 'Shipped' && trackingNumber) {
            order.tracking = {
                trackingNumber,
                carrier: carrier || 'Standard',
                trackingUrl: `https://tracking.example.com/${trackingNumber}`
            };
        }

        if (status === 'Delivered') {
            order.deliveredAt = new Date();
            order.paymentStatus = 'Paid';
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order status updated',
            data: order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating order status',
            error: error.message
        });
    }
};
