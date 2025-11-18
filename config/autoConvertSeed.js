require('dotenv').config();
const fs = require('fs');
const path = require('path');

console.log('🔄 Starting automatic seed file conversion...\n');

// Read the current seed file
const seedPath = path.join(__dirname, 'seed.js');
let seedContent = fs.readFileSync(seedPath, 'utf-8');

// Extract the products array using regex
const productsMatch = seedContent.match(/const products = \[([\s\S]*?)\];[\s\S]*?\/\/ Admin user/);

if (!productsMatch) {
    console.error('❌ Could not find products array in seed.js');
    process.exit(1);
}

const productsString = productsMatch[1];

// Parse the products (this is a simple eval, be careful in production)
let products;
try {
    products = eval('[' + productsString + ']');
} catch (error) {
    console.error('❌ Error parsing products:', error.message);
    process.exit(1);
}

console.log(`📦 Found ${products.length} products to convert\n`);

// Conversion function
function convertProduct(product, index) {
    const converted = {};
    
    // 1. title → name
    converted.name = product.title || product.name;
    if (!converted.name) {
        console.warn(`⚠️  Product ${index + 1}: Missing name/title`);
    }
    
    // 2. category → Capitalized (Rings, Earrings, Necklaces, Bracelets)
    let category = product.category || '';
    if (category === 'featured' || category === 'necklacesc') {
        // Last 3 products - assign real categories
        if (converted.name.includes('Necklace')) {
            category = 'Necklaces';
            converted.featured = true;
        } else if (converted.name.includes('Earring')) {
            category = 'Earrings';
            converted.featured = true;
        } else if (converted.name.includes('Ring')) {
            category = 'Rings';
            converted.featured = true;
        } else {
            category = 'Necklaces'; // Default
            converted.featured = true;
        }
    } else {
        // Capitalize first letter
        category = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
    }
    converted.category = category;
    
    // 3. description
    converted.description = product.description || 'Premium jewelry piece from Aurelia collection.';
    
    // 4. price & originalPrice
    converted.price = product.price || 0;
    converted.originalPrice = product.originalPrice || null;
    
    // 5. discountPercent → discount
    converted.discount = product.discountPercent || product.discount || 0;
    
    // 6. images - convert strings to objects with url and alt
    if (Array.isArray(product.images)) {
        converted.images = product.images.map((img, imgIndex) => {
            if (typeof img === 'string') {
                return {
                    url: img,
                    alt: `${converted.name} - View ${imgIndex + 1}`
                };
            }
            return img; // Already in correct format
        });
    } else {
        converted.images = [];
    }
    
    // 7. sku
    converted.sku = product.sku || `AUTO-${category.toUpperCase().slice(0, 2)}-${String(index + 1).padStart(3, '0')}`;
    
    // 8. material
    converted.material = product.material || '18K Gold Plated Stainless Steel';
    
    // 9. weight - convert "10g" to 10
    if (typeof product.weight === 'string') {
        converted.weight = parseFloat(product.weight.replace(/[^0-9.]/g, '')) || 10;
    } else {
        converted.weight = product.weight || 10;
    }
    
    // 10. dimensions
    converted.dimensions = product.dimensions || {};
    if (product.length) {
        if (typeof product.length === 'string') {
            if (product.length.toLowerCase().includes('adjustable')) {
                converted.dimensions.length = 6.5; // Default adjustable length
            } else {
                const lengthNum = parseFloat(product.length.replace(/[^0-9.]/g, ''));
                if (lengthNum) converted.dimensions.length = lengthNum;
            }
        } else {
            converted.dimensions.length = product.length;
        }
    }
    
    // 11. stockQuantity (REQUIRED)
    converted.stockQuantity = product.stockQuantity || Math.floor(Math.random() * 11) + 10; // Random 10-20
    
    // 12. productPage (REQUIRED) - generate based on category and index
    const categoryFolder = category.toLowerCase();
    const productNumber = (index % 12) + 1; // Cycle through product1-product12
    converted.productPage = `products/${categoryFolder}/product${productNumber}.html`;
    
    // 13. tags
    converted.tags = product.tags || [categoryFolder, converted.name.split(' ')[0].toLowerCase()];
    
    // 14. Boolean flags
    converted.featured = product.featured || converted.featured || false;
    converted.newArrival = product.newArrival || (index < 15); // First 15 are new arrivals
    converted.bestSeller = product.bestSeller || false;
    converted.mostGifted = product.mostGifted || false;
    
    // 15. inStock (auto-calculated by model pre-save hook)
    converted.inStock = converted.stockQuantity > 0;
    
    return converted;
}

// Convert all products
const convertedProducts = products.map((product, index) => {
    try {
        return convertProduct(product, index);
    } catch (error) {
        console.error(`❌ Error converting product ${index + 1}:`, error.message);
        return null;
    }
}).filter(p => p !== null);

console.log(`✅ Successfully converted ${convertedProducts.length} products\n`);

// Generate new seed.js content
const newSeedContent = `require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

// Converted products data - Auto-generated from autoConvertSeed.js
const products = ${JSON.stringify(convertedProducts, null, 2)};

// Admin user
const adminUser = {
    name: "Admin",
    email: "admin@aurelia.com",
    password: "admin123",
    role: "admin",
    phone: "9876543210",
    emailVerified: true
};

// Seed database
const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aurelia_jewelry');
        console.log('✅ MongoDB Connected');

        // Clear existing data
        await Product.deleteMany({});
        await User.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Insert products
        await Product.insertMany(products);
        console.log(\`✅ Inserted \${products.length} products\`);

        // Create admin user
        await User.create(adminUser);
        console.log('✅ Created admin user');
        console.log('   Email: admin@aurelia.com');
        console.log('   Password: admin123');

        console.log('\\n🎉 Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
`;

// Backup original file
const backupPath = path.join(__dirname, 'seed.backup.js');
fs.writeFileSync(backupPath, seedContent);
console.log(`💾 Backed up original seed.js to seed.backup.js`);

// Write new seed file
fs.writeFileSync(seedPath, newSeedContent);
console.log(`✅ Created new seed.js with ${convertedProducts.length} converted products`);

console.log('\n📊 Conversion Summary:');
console.log(`   Total products: ${convertedProducts.length}`);
console.log(`   Rings: ${convertedProducts.filter(p => p.category === 'Rings').length}`);
console.log(`   Earrings: ${convertedProducts.filter(p => p.category === 'Earrings').length}`);
console.log(`   Necklaces: ${convertedProducts.filter(p => p.category === 'Necklaces').length}`);
console.log(`   Bracelets: ${convertedProducts.filter(p => p.category === 'Bracelets').length}`);
console.log(`   Featured: ${convertedProducts.filter(p => p.featured).length}`);
console.log(`   New Arrivals: ${convertedProducts.filter(p => p.newArrival).length}`);

console.log('\n✨ Next steps:');
console.log('   1. Run: node config/seed.js');
console.log('   2. Check MongoDB Atlas for your products');
console.log('   3. Test category pages to see all 12 products per category\n');
