// Update seed script to add orderId field to all products
// This script adds sequential orderId to existing products based on their creation order

const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

async function updateProductsWithOrderId() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        
        // Get all products sorted by _id (creation order)
        const products = await Product.find({}).sort({ _id: 1 });
        
        console.log(`📦 Found ${products.length} products`);
        
        // Update each product with orderId
        for (let i = 0; i < products.length; i++) {
            products[i].orderId = i + 1; // Start from 1
            await products[i].save();
            console.log(`✓ Updated ${products[i].name} with orderId: ${i + 1}`);
        }
        
        console.log('✅ All products updated with orderId');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

updateProductsWithOrderId();
