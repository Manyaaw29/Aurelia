const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get cart (supports both guest and authenticated users)
// @route   GET /api/cart
// @access  Public
exports.getCart = async (req, res) => {
    try {
        const sessionId = req.cookies?.sessionId;
        
        if (!sessionId) {
            return res.json({ success: true, cart: { items: [], totalAmount: 0 } });
        }
        
        const cart = await Cart.findOne({ sessionId }).populate('items.product');
        
        if (!cart) {
            return res.json({ success: true, cart: { items: [], totalAmount: 0 } });
        }
        
        res.json({ success: true, cart: { items: cart.items, totalAmount: cart.totalAmount } });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ success: false, message: 'Error fetching cart' });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Public
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        
        if (!productId) {
            return res.status(400).json({ success: false, message: 'Product ID required' });
        }
        
        // Get product details
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        // Get session ID from cookies or create new one
        let sessionId = req.cookies?.sessionId;
        if (!sessionId) {
            sessionId = require('crypto').randomBytes(16).toString('hex');
            res.cookie('sessionId', sessionId, { maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 days
        }
        
        // Find or create cart
        let cart = await Cart.findOne({ sessionId });
        if (!cart) {
            cart = new Cart({ sessionId, items: [] });
        }
        
        // Check if product already in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );
        
        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({
                product: productId,
                quantity: quantity,
                price: product.price
            });
        }
        
        await cart.save();
        
        res.json({ success: true, message: 'Product added to cart', cart });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ success: false, message: 'Error adding to cart' });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:productId
// @access  Public
exports.updateCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const sessionId = req.cookies?.sessionId;
        
        if (!sessionId) {
            return res.status(400).json({ success: false, message: 'No cart found' });
        }
        
        const cart = await Cart.findOne({ sessionId });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }
        
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ success: false, message: 'Item not found in cart' });
        }
        
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        
        res.json({ success: true, message: 'Cart updated', cart });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ success: false, message: 'Error updating cart' });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Public
exports.removeFromCart = async (req, res) => {
    try {
        const sessionId = req.cookies?.sessionId;
        const { productId } = req.params;
        
        if (!sessionId) {
            return res.status(400).json({ success: false, message: 'No cart found' });
        }
        
        const cart = await Cart.findOne({ sessionId });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }
        
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        
        res.json({ success: true, message: 'Product removed from cart' });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ success: false, message: 'Error removing from cart' });
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Public
exports.clearCart = async (req, res) => {
    try {
        const sessionId = req.cookies?.sessionId;
        
        if (!sessionId) {
            return res.json({ success: true, message: 'No cart to clear' });
        }
        
        const cart = await Cart.findOne({ sessionId });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        
        res.json({ success: true, message: 'Cart cleared' });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ success: false, message: 'Error clearing cart' });
    }
};
