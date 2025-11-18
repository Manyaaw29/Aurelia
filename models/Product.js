const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [200, 'Product name cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    originalPrice: {
        type: Number,
        default: null
    },
    discount: {
        type: Number,
        default: 0,
        min: [0, 'Discount cannot be negative'],
        max: [100, 'Discount cannot exceed 100%']
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        enum: ['Bracelets', 'Earrings', 'Necklaces', 'Rings']
    },
    subcategory: {
        type: String,
        trim: true
    },
    images: [{
        url: {
            type: String,
            required: true
        },
        alt: {
            type: String,
            default: ''
        }
    }],
    material: {
        type: String,
        default: 'Gold Plated'
    },
    weight: {
        type: Number, // in grams
        default: 0
    },
    dimensions: {
        length: Number,
        width: Number,
        height: Number
    },
    inStock: {
        type: Boolean,
        default: true
    },
    stockQuantity: {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'Stock quantity cannot be negative']
    },
    sku: {
        type: String,
        unique: true,
        required: true
    },
    rating: {
        average: {
            type: Number,
            default: 0,
            min: [0, 'Rating cannot be less than 0'],
            max: [5, 'Rating cannot exceed 5']
        },
        count: {
            type: Number,
            default: 0
        }
    },
    reviews: [{
        reviewerName: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    tags: [{
        type: String,
        trim: true
    }],
    featured: {
        type: Boolean,
        default: false
    },
    newArrival: {
        type: Boolean,
        default: false
    },
    bestSeller: {
        type: Boolean,
        default: false
    },
    mostGifted: {
        type: Boolean,
        default: false
    },
    productPage: {
        type: String,
        required: true
    },
    orderId: {
        type: Number,
        required: true,
        unique: true
    },
    views: {
        type: Number,
        default: 0
    },
    sales: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Indexes for better query performance
productSchema.index({ category: 1, inStock: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ name: 'text', description: 'text' });

// Virtual for discounted price
productSchema.virtual('finalPrice').get(function() {
    if (this.discount > 0) {
        return this.price - (this.price * this.discount / 100);
    }
    return this.price;
});

// Virtual for single image (backwards compatibility)
productSchema.virtual('image').get(function() {
    if (this.images && this.images.length > 0) {
        return this.images[0].url || this.images[0];
    }
    return '/images/placeholder.jpg';
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// Middleware to update inStock based on stockQuantity
productSchema.pre('save', function(next) {
    this.inStock = this.stockQuantity > 0;
    next();
});

module.exports = mongoose.model('Product', productSchema);
