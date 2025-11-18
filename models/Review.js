const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },
    title: {
        type: String,
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    comment: {
        type: String,
        required: [true, 'Review comment is required'],
        trim: true,
        maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    images: [{
        type: String
    }],
    verified: {
        type: Boolean,
        default: false
    },
    helpful: {
        type: Number,
        default: 0
    },
    isApproved: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes for faster queries (removed unique constraint)
reviewSchema.index({ product: 1, user: 1 }); // Allow multiple reviews per user per product
reviewSchema.index({ product: 1, isApproved: 1 }); // For fetching approved reviews
reviewSchema.index({ user: 1 }); // For fetching user's reviews

module.exports = mongoose.model('Review', reviewSchema);