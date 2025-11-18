const Wishlist = require('../models/Wishlist');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get wishlist (supports both guest and authenticated users)
// @route   GET /api/wishlist
// @access  Public
exports.getWishlist = async (req, res) => {
    try {
        const sessionId = req.cookies?.sessionId;
        
        if (!sessionId) {
            return res.json({ success: true, products: [] });
        }
        
        const wishlist = await Wishlist.findOne({ sessionId }).populate('products');
        
        if (!wishlist) {
            return res.json({ success: true, products: [] });
        }
        
        res.json({ success: true, products: wishlist.products });
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ success: false, message: 'Error fetching wishlist' });
    }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/add/:productId
// @access  Public
exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const requestProductId = req.body.productId || productId; // Support both URL param and body
        
        // Check if product exists
        const product = await Product.findById(requestProductId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        // Get session ID from cookies or create new one
        let sessionId = req.cookies?.sessionId;
        if (!sessionId) {
            sessionId = require('crypto').randomBytes(16).toString('hex');
            res.cookie('sessionId', sessionId, { maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 days
        }
        
        // Find or create wishlist
        let wishlist = await Wishlist.findOne({ sessionId });
        if (!wishlist) {
            wishlist = new Wishlist({ sessionId, products: [] });
        }
        
        // Check if product already in wishlist
        if (!wishlist.products.includes(requestProductId)) {
            wishlist.products.push(requestProductId);
            await wishlist.save();
        }
        
        res.json({ success: true, message: 'Product added to wishlist' });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ success: false, message: 'Error adding to wishlist' });
    }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/remove/:productId
// @access  Public
exports.removeFromWishlist = async (req, res) => {
    try {
        const sessionId = req.cookies?.sessionId;
        const { productId } = req.params;
        
        if (!sessionId) {
            return res.status(400).json({ success: false, message: 'No wishlist found' });
        }
        
        const wishlist = await Wishlist.findOne({ sessionId });
        if (!wishlist) {
            return res.status(404).json({ success: false, message: 'Wishlist not found' });
        }
        
        wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
        await wishlist.save();
        
        res.json({ success: true, message: 'Product removed from wishlist' });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        res.status(500).json({ success: false, message: 'Error removing from wishlist' });
    }
};

// @desc    Move product from wishlist to cart
// @route   POST /api/wishlist/move-to-cart/:productId
// @access  Public
exports.moveToCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const sessionId = req.cookies?.sessionId;
        
        if (!sessionId) {
            return res.status(400).json({ success: false, message: 'No session found' });
        }
        
        const wishlist = await Wishlist.findOne({ sessionId });
        if (!wishlist || !wishlist.products.includes(productId)) {
            return res.status(404).json({ success: false, message: 'Product not in wishlist' });
        }
        
        // Get product details
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        // Add to cart
        let cart = await Cart.findOne({ sessionId });
        if (!cart) {
            cart = new Cart({ sessionId, items: [] });
        }
        
        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );
        
        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += 1;
        } else {
            cart.items.push({
                product: productId,
                quantity: 1,
                price: product.price
            });
        }
        
        await cart.save();
        
        // Remove from wishlist
        wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
        await wishlist.save();
        
        res.json({ success: true, message: 'Product moved to cart' });
    } catch (error) {
        console.error('Error moving to cart:', error);
        res.status(500).json({ success: false, message: 'Error moving to cart' });
    }
};
