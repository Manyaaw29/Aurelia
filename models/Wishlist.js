const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Allow guest wishlists
    },
    sessionId: {
        type: String,
        required: false // For guest users
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, {
    timestamps: true
});

// Index for faster lookups
wishlistSchema.index({ user: 1 });
wishlistSchema.index({ sessionId: 1 });

module.exports = mongoose.model('Wishlist', wishlistSchema);
