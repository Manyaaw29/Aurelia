const mongoose = require('mongoose');
// Use ../ to go up one directory from scripts folder to project root
const Product = require('../models/Product');
const Review = require('../models/Review');

// Try to require User model, if it fails we'll create users differently
let User;
try {
    User = require('../models/User');
} catch (error) {
    console.log('⚠️  User model not found, will use alternative method');
}

// MongoDB connection string - UPDATE THIS WITH YOUR CONNECTION STRING
const mongoURI = 'mongodb+srv://manyaawasthi24cse_db_user:VYKsYk7ZCq6R3lBO@cluster0.6zx3crn.mongodb.net/aurelia_jewelry?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true';

// Sample reviewer names for realistic reviews
const reviewerNames = [
    'Priya Sharma', 'Ananya Patel', 'Kavya Singh', 'Rhea Kapoor', 'Ishita Verma',
    'Sneha Reddy', 'Diya Malhotra', 'Aarohi Gupta', 'Meera Joshi', 'Tanvi Desai',
    'Nisha Kumar', 'Pooja Agarwal', 'Riya Mehta', 'Simran Bhatia', 'Aisha Khan',
    'Divya Nair', 'Anjali Chopra', 'Neha Iyer', 'Sakshi Rao', 'Aditi Bansal',
    'Shreya Saxena', 'Kiara Arora', 'Myra Shah', 'Isha Pillai', 'Sana Mishra',
    'Tara Reddy', 'Zara Khan', 'Navya Gupta', 'Ria Malhotra', 'Sia Kapoor',
    'Maya Singh', 'Aanya Verma', 'Disha Patel', 'Trisha Desai', 'Vanya Joshi',
    'Avni Kumar', 'Isha Agarwal', 'Kriti Mehta', 'Naina Bhatia', 'Pihu Nair',
    'Ruhi Chopra', 'Siya Iyer', 'Mishti Bansal', 'Reet Saxena', 'Kirti Arora',
    'Meher Shah', 'Nitya Pillai', 'Ojaswi Mishra', 'Palak Sharma', 'Radhika Patel',
    'Saanvi Singh'
];

// Sample review titles
const reviewTitles = {
    5: [
        'Absolutely Perfect!',
        'Exceeded Expectations',
        'Stunning Piece',
        'Worth Every Penny',
        'Simply Beautiful',
        'Exceptional Quality',
        'Gorgeous!',
        'Love It!',
        'Amazing Craftsmanship',
        'Perfect Gift',
        'Highly Recommend',
        'Outstanding',
        'Exquisite Design',
        'Best Purchase Ever'
    ],
    4: [
        'Very Good Quality',
        'Pretty Piece',
        'Nice Purchase',
        'Good Value',
        'Satisfied',
        'Really Nice',
        'Great Product',
        'Very Happy',
        'Good Quality',
        'Lovely Design'
    ],
    3: [
        'Decent Quality',
        'It\'s Okay',
        'Average',
        'Not Bad',
        'Satisfactory',
        'Fair Product',
        'Meets Expectations'
    ],
    2: [
        'Could Be Better',
        'Somewhat Disappointed',
        'Not Great',
        'Expected More',
        'Below Average'
    ],
    1: [
        'Disappointed',
        'Not Recommended',
        'Poor Quality',
        'Not Worth It'
    ]
};

// Sample review comments by rating
const reviewComments = {
    5: [
        'Absolutely stunning! The craftsmanship is exceptional and the attention to detail is remarkable.',
        'Perfect piece! Exceeded my expectations in every way. The quality is outstanding.',
        'Gorgeous design and excellent quality. Highly recommend to anyone looking for premium jewelry!',
        'Beautiful jewelry! Worth every penny. I receive compliments every time I wear it.',
        'Amazing quality and the design is breathtaking! This is definitely my new favorite piece.',
        'This is my new favorite piece. Simply perfect in every aspect!',
        'Exquisite craftsmanship. The finishing is flawless and it looks even better in person.',
        'Outstanding quality! The pictures don\'t do it justice. Absolutely love it!',
        'Best jewelry purchase I\'ve made. The design is elegant and the quality is top-notch.',
        'Incredible piece! The weight feels premium and the design is timeless.',
        'I\'m in love with this jewelry! Perfect for special occasions and daily wear.',
        'Superb quality and beautiful design. Will definitely purchase more from this collection.',
        'Exactly what I was looking for! The craftsmanship is impeccable.',
        'This piece is a showstopper! Everyone asks me where I got it from.',
        'Premium quality jewelry at its finest. No regrets with this purchase!',
        'The design is elegant and sophisticated. Looks expensive and feels premium.',
        'I bought this as a gift and the recipient absolutely loved it! Perfect choice.',
        'The detailing is amazing! You can tell this was made with care and precision.',
        'Flawless piece! The shine and finish are remarkable. Very impressed.',
        'Worth the investment! This is jewelry that will last a lifetime.'
    ],
    4: [
        'Very nice piece. Slightly heavier than expected but still great quality.',
        'Beautiful design. Good quality for the price. Happy with my purchase.',
        'Really pretty! Minor imperfection but overall very satisfied with the product.',
        'Great purchase! Looks exactly like the pictures. Would buy again.',
        'Lovely jewelry. Would definitely buy again. Good value for money.',
        'Good quality and elegant design. Very pleased with my purchase.',
        'Pretty piece. Took slightly longer to arrive but worth the wait.',
        'Nice jewelry. The color is slightly different from photos but still beautiful.',
        'Great quality! Just wish it came with a better storage box.',
        'Beautiful piece! Lost one star because the chain is a bit delicate.',
        'Very elegant design. The only issue is it\'s smaller than I expected.',
        'Good purchase overall. The clasp could be sturdier but otherwise perfect.',
        'Looks great! The finishing could be a tiny bit better but still very nice.',
        'Happy with this purchase. Minor scratches but barely noticeable.',
        'Good quality jewelry. Wish it came in more color options though.'
    ],
    3: [
        'Decent quality. Not as shiny as I expected but still okay.',
        'It\'s okay. The design is nice but the finish could be better.',
        'Average quality. Good for the price range but nothing extraordinary.',
        'Not bad but not exceptional either. Does the job for casual wear.',
        'Satisfactory. Meets basic expectations but could be improved.',
        'The design is lovely but the quality is just average.',
        'It\'s alright. Would be better if the metal was slightly thicker.',
        'Fair product. The photos made it look better than it actually is.',
        'Decent for the price. Don\'t expect premium quality though.',
        'Average piece. The design is nice but material feels a bit cheap.'
    ],
    2: [
        'Not as described. The color is slightly different from the images.',
        'Quality could be better. A bit disappointed with my purchase.',
        'Doesn\'t look as good in person. Expected more for the price.',
        'The clasp feels a bit flimsy. Needs improvement in durability.',
        'Below my expectations. The finish started showing wear after a few uses.',
        'Not very impressed. The material feels cheaper than advertised.',
        'The design is nice but the execution is poor. Quality issues.'
    ],
    1: [
        'Very disappointed with the quality. Not what I expected at all.',
        'Not worth the price. Poor craftsmanship and cheap materials.',
        'The finish started wearing off quickly. Not recommended.',
        'Broke after just a few wears. Very poor quality control.',
        'Don\'t waste your money. The quality is terrible.'
    ]
};

// Function to generate random date within last 12 months
function randomDate() {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 12);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Function to get a random item from array
function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Function to generate a random review
function generateReview() {
    // Weighted random rating (more likely to be 4-5 stars)
    const rand = Math.random();
    let rating;
    if (rand < 0.55) rating = 5;      // 55% chance of 5 stars
    else if (rand < 0.85) rating = 4;  // 30% chance of 4 stars
    else if (rand < 0.95) rating = 3;  // 10% chance of 3 stars
    else if (rand < 0.99) rating = 2;  // 4% chance of 2 stars
    else rating = 1;                    // 1% chance of 1 star
    
    const title = randomItem(reviewTitles[rating]);
    const comment = randomItem(reviewComments[rating]);
    const date = randomDate();
    
    return {
        rating,
        title,
        comment,
        createdAt: date,
        updatedAt: date
    };
}

// Function to update product rating
async function updateProductRating(productId) {
    const reviews = await Review.find({ product: productId, isApproved: true });
    
    if (reviews.length > 0) {
        const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        
        await Product.findByIdAndUpdate(productId, {
            'rating.average': avgRating.toFixed(1),
            'rating.count': reviews.length
        });
    }
}

// Main function to add reviews to all products
async function addReviewsToAllProducts() {
    try {
        // Connect to MongoDB
        await mongoose.connect(mongoURI, {
            ssl: true,
            tls: true
        });
        console.log('✅ Connected to MongoDB');
        
        // Get all products
        const products = await Product.find({});
        console.log(`📊 Found ${products.length} products in database\n`);
        
        // Get or create dummy users for reviews
        let users = [];
        
        if (User) {
            users = await User.find({}).limit(25);
            
            // If we don't have enough users, create dummy users
            if (users.length < 25) {
                console.log('📝 Creating dummy users for reviews...');
                const dummyUsers = [];
                
                for (let i = 0; i < 25; i++) {
                    const name = reviewerNames[i] || `User ${i + 1}`;
                    
                    try {
                        // Let the User model's pre-save hook handle password hashing
                        const newUser = new User({
                            name: name,
                            email: `reviewer${i + 1}@aurelia.com`,
                            password: 'DummyPass123!', // Will be hashed by pre-save hook
                            role: 'user'
                        });
                        
                        await newUser.save();
                        dummyUsers.push(newUser);
                    } catch (err) {
                        // Check if user already exists
                        if (err.code === 11000) {
                            // Duplicate email, find existing user
                            const existingUser = await User.findOne({ email: `reviewer${i + 1}@aurelia.com` });
                            if (existingUser) {
                                dummyUsers.push(existingUser);
                            }
                        } else {
                            console.log(`  ⚠️  Could not create user ${name}: ${err.message}`);
                        }
                    }
                }
                
                users = dummyUsers;
                console.log(`✓ Created/Found ${users.length} dummy users\n`);
            }
        } else {
            // Create minimal user objects if User model doesn't exist
            console.log('📝 Creating minimal user references...');
            for (let i = 0; i < 25; i++) {
                users.push({
                    _id: new mongoose.Types.ObjectId(),
                    name: reviewerNames[i] || `User ${i + 1}`
                });
            }
            console.log(`✓ Created ${users.length} user references\n`);
        }
        
        let totalReviewsAdded = 0;
        let productCount = 0;
        
        // Clear existing reviews (optional - remove if you want to keep existing reviews)
        const existingReviewsCount = await Review.countDocuments();
        if (existingReviewsCount > 0) {
            console.log(`⚠️  Found ${existingReviewsCount} existing reviews. Deleting them...`);
            await Review.deleteMany({});
            console.log('✓ Cleared existing reviews\n');
        }
        
        // Add 10 reviews to each product
        for (const product of products) {
            productCount++;
            console.log(`[${productCount}/${products.length}] Processing: ${product.name}`);
            
            const reviews = [];
            
            // Generate 10 reviews for this product
            for (let i = 0; i < 10; i++) {
                const reviewData = generateReview();
                const user = users[i % users.length]; // Cycle through users
                
                reviews.push({
                    product: product._id,
                    user: user._id,
                    rating: reviewData.rating,
                    title: reviewData.title,
                    comment: reviewData.comment,
                    verified: Math.random() > 0.3, // 70% verified purchases
                    helpful: Math.floor(Math.random() * 20), // Random helpful count 0-19
                    isApproved: true, // Auto-approve all reviews
                    createdAt: reviewData.createdAt,
                    updatedAt: reviewData.updatedAt
                });
            }
            
            // Insert all 10 reviews for this product
            await Review.insertMany(reviews);
            
            // Update product rating
            await updateProductRating(product._id);
            
            // Get updated product to show stats
            const updatedProduct = await Product.findById(product._id);
            
            totalReviewsAdded += 10;
            console.log(`  ✓ Added 10 reviews (Avg Rating: ${updatedProduct.rating.average}/5.0)`);
            console.log(`  📊 Rating Distribution: ${reviews.filter(r => r.rating === 5).length}★★★★★, ${reviews.filter(r => r.rating === 4).length}★★★★☆, ${reviews.filter(r => r.rating === 3).length}★★★☆☆`);
            console.log('');
        }
        
        console.log('═══════════════════════════════════════════════════');
        console.log(`🎉 SUCCESS! Added reviews to all products`);
        console.log(`═══════════════════════════════════════════════════`);
        console.log(`📦 Total Products: ${products.length}`);
        console.log(`⭐ Total Reviews Added: ${totalReviewsAdded}`);
        console.log(`👥 Reviews per Product: 10`);
        console.log(`═══════════════════════════════════════════════════\n`);
        
    } catch (error) {
        console.error('❌ Error adding reviews:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

// Run the script
addReviewsToAllProducts();