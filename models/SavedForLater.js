const mongoose = require('mongoose');

const savedForLaterSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    sessionId: {
        type: String,
        required: false
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, {
    timestamps: true
});

// Index for faster lookups
savedForLaterSchema.index({ user: 1 });
savedForLaterSchema.index({ sessionId: 1 });

module.exports = mongoose.model('SavedForLater', savedForLaterSchema);
