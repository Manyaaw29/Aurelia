const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true
        // Removed unique: true - defined in index below instead
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: String,
        price: Number,
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        image: String
    }],
    shippingAddress: {
        fullName: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        addressLine1: {
            type: String,
            required: true
        },
        addressLine2: String,
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            default: 'India'
        }
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['COD', 'Card', 'UPI', 'NetBanking', 'Wallet']
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    paymentDetails: {
        transactionId: String,
        paidAt: Date
    },
    itemsPrice: {
        type: Number,
        required: true,
        default: 0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    orderStatus: {
        type: String,
        enum: ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'],
        default: 'Processing'
    },
    statusHistory: [{
        status: String,
        timestamp: {
            type: Date,
            default: Date.now
        },
        note: String
    }],
    deliveredAt: Date,
    cancelledAt: Date,
    cancelReason: String,
    notes: String,
    tracking: {
        trackingNumber: String,
        carrier: String,
        trackingUrl: String
    }
}, {
    timestamps: true
});

// Index for faster queries (only define here, not in schema fields)
orderSchema.index({ user: 1, orderStatus: 1 });
orderSchema.index({ orderNumber: 1 }, { unique: true }); // Unique index defined here

// Generate order number before saving
orderSchema.pre('save', async function(next) {
    if (this.isNew && !this.orderNumber) {
        const count = await mongoose.model('Order').countDocuments();
        this.orderNumber = `AUR${Date.now()}${count + 1}`;
    }
    next();
});

// Add status to history when status changes
orderSchema.pre('save', function(next) {
    if (this.isModified('orderStatus')) {
        this.statusHistory.push({
            status: this.orderStatus,
            timestamp: new Date()
        });
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);