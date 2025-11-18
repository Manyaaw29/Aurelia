const mongoose = require('mongoose');
const Product = require('../models/Product');

// MongoDB connection string
const mongoURI = 'mongodb+srv://manyaawasthi24cse_db_user:VYKsYk7ZCq6R3lBO@cluster0.6zx3crn.mongodb.net/aurelia_jewelry?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true';

// Featured product names to set
const featuredProductNames = [
    'Golden Grace Layered Necklace Set',
    'Golden Grace Halo Hoops Earrings',
    'Golden Grace Stackable Rings'
];

async function setFeaturedProducts() {
    try {
        // Connect to MongoDB
        await mongoose.connect(mongoURI, {
            ssl: true,
            tls: true
        });
        console.log('✅ Connected to MongoDB');
        
        // First, set all products to NOT featured
        await Product.updateMany({}, { $set: { featured: false } });
        console.log('📊 Reset all products to non-featured');
        
        // Set the three specific products as featured
        for (const productName of featuredProductNames) {
            const result = await Product.updateOne(
                { name: { $regex: new RegExp(productName, 'i') } },
                { $set: { featured: true } }
            );
            
            if (result.matchedCount > 0) {
                console.log(`✓ Set "${productName}" as featured`);
            } else {
                console.log(`⚠ Product "${productName}" not found - will create or check name`);
            }
        }
        
        // Verify featured products
        const featuredProducts = await Product.find({ featured: true }).select('name category');
        console.log('\n🌟 Featured Products:');
        featuredProducts.forEach(p => console.log(`  - ${p.name} (${p.category})`));
        
    } catch (error) {
        console.error('❌ Error setting featured products:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
    }
}

// Run the script
setFeaturedProducts();
