const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

        const skip = (page - 1) * limit;

        const reviews = await Review.find({ 
            product: productId,
            isApproved: true 
        })
            .populate('user', 'name avatar')
            .sort(sort)
            .limit(Number(limit))
            .skip(skip);

        const total = await Review.countDocuments({ product: productId, isApproved: true });

        res.status(200).json({
            success: true,
            count: reviews.length,
            total,
            pages: Math.ceil(total / limit),
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews',
            error: error.message
        });
    }
};

// @desc    Create product review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
    try {
        const { product, rating, title, comment, images } = req.body;

        // Check if product exists
        const productExists = await Product.findById(product);
        if (!productExists) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            product,
            user: req.user.id
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }

        const review = await Review.create({
            product,
            user: req.user.id,
            rating,
            title,
            comment,
            images
        });

        // Update product rating
        await updateProductRating(product);

        // Add review to product
        await Product.findByIdAndUpdate(product, {
            $push: { reviews: review._id }
        });

        await review.populate('user', 'name avatar');

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            data: review
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating review',
            error: error.message
        });
    }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res) => {
    try {
        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check ownership
        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this review'
            });
        }

        review = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('user', 'name avatar');

        // Update product rating
        await updateProductRating(review.product);

        res.status(200).json({
            success: true,
            message: 'Review updated successfully',
            data: review
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating review',
            error: error.message
        });
    }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check ownership or admin
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this review'
            });
        }

        const productId = review.product;
        await review.deleteOne();

        // Remove review from product
        await Product.findByIdAndUpdate(productId, {
            $pull: { reviews: req.params.id }
        });

        // Update product rating
        await updateProductRating(productId);

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting review',
            error: error.message
        });
    }
};

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
exports.markHelpful = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { $inc: { helpful: 1 } },
            { new: true }
        ).populate('user', 'name avatar');

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            data: review
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error marking review as helpful',
            error: error.message
        });
    }
};

// @desc    Approve review (Admin)
// @route   PUT /api/reviews/:id/approve
// @access  Private/Admin
exports.approveReview = async (req, res) => {
    try {
        const { isApproved } = req.body;

        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { isApproved },
            { new: true }
        ).populate('user', 'name avatar');

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            message: `Review ${isApproved ? 'approved' : 'disapproved'}`,
            data: review
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating review approval',
            error: error.message
        });
    }
};

// Helper function to update product rating
async function updateProductRating(productId) {
    const reviews = await Review.find({ product: productId, isApproved: true });
    
    if (reviews.length > 0) {
        const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        
        await Product.findByIdAndUpdate(productId, {
            'rating.average': avgRating.toFixed(1),
            'rating.count': reviews.length
        });
    } else {
        await Product.findByIdAndUpdate(productId, {
            'rating.average': 0,
            'rating.count': 0
        });
    }
}
