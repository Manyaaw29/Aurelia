const mongoose = require('mongoose');
const Product = require('../models/Product');

// MongoDB connection string
const mongoURI = 'mongodb+srv://manyaawasthi24cse_db_user:VYKsYk7ZCq6R3lBO@cluster0.6zx3crn.mongodb.net/aurelia_jewelry?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true';

async function getProductIds() {
    try {
        await mongoose.connect(mongoURI, {
            ssl: true,
            tls: true
        });
        console.log('✅ Connected to MongoDB\n');
        
        // Get the three products for customer stories
        const products = await Product.find({
            name: {
                $in: [
                    'Tree of Life Necklace',
                    'Diamond Studded Hoop Earrings',
                    'Droplet Blush Ring'
                ]
            }
        }).select('name _id category');
        
        console.log('🌟 Product IDs for Customer Stories:\n');
        products.forEach(p => {
            console.log(`${p.name}:`);
            console.log(`  _id: ${p._id}`);
            console.log(`  category: ${p.category}`);
            console.log(`  Link: /product/${p._id}\n`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

getProductIds();
