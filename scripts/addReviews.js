const mongoose = require('mongoose');
const Product = require('../models/Product');

// MongoDB connection string
const mongoURI = 'mongodb+srv://manyaawasthi24cse_db_user:VYKsYk7ZCq6R3lBO@cluster0.6zx3crn.mongodb.net/aurelia_jewelry?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true';

// Sample reviewer names for realistic reviews
const reviewerNames = [
    'Priya Sharma', 'Ananya Patel', 'Kavya Singh', 'Rhea Kapoor', 'Ishita Verma',
    'Sneha Reddy', 'Diya Malhotra', 'Aarohi Gupta', 'Meera Joshi', 'Tanvi Desai',
    'Nisha Kumar', 'Pooja Agarwal', 'Riya Mehta', 'Simran Bhatia', 'Aisha Khan',
    'Divya Nair', 'Anjali Chopra', 'Neha Iyer', 'Sakshi Rao', 'Aditi Bansal',
    'Shreya Saxena', 'Kiara Arora', 'Myra Shah', 'Isha Pillai', 'Sana Mishra'
];

// Sample review comments by rating
const reviewComments = {
    5: [
        'Absolutely stunning! The craftsmanship is exceptional.',
        'Perfect piece! Exceeded my expectations in every way.',
        'Gorgeous design and excellent quality. Highly recommend!',
        'Beautiful jewelry! Worth every penny.',
        'Amazing quality and the design is breathtaking!',
        'This is my new favorite piece. Simply perfect!',
        'Exquisite craftsmanship. I receive compliments every time I wear it.',
        'Outstanding quality! The pictures don\'t do it justice.'
    ],
    4: [
        'Very nice piece. Slightly heavier than expected but still great.',
        'Beautiful design. Good quality for the price.',
        'Really pretty! Minor imperfection but overall very satisfied.',
        'Great purchase! Looks exactly like the pictures.',
        'Lovely jewelry. Would definitely buy again.',
        'Good quality and elegant design. Very pleased with my purchase.',
        'Pretty piece. Took slightly longer to arrive but worth the wait.'
    ],
    3: [
        'Decent quality. Not as shiny as I expected.',
        'It\'s okay. The design is nice but the finish could be better.',
        'Average quality. Good for the price range.',
        'Not bad but not exceptional either. Does the job.',
        'Satisfactory. Meets basic expectations.',
        'The design is lovely but the quality is just average.'
    ],
    2: [
        'Not as described. The color is slightly different.',
        'Quality could be better. A bit disappointed.',
        'Doesn\'t look as good in person. Expected more for the price.',
        'The clasp feels a bit flimsy. Needs improvement.'
    ],
    1: [
        'Very disappointed with the quality.',
        'Not worth the price. Poor craftsmanship.',
        'The finish started wearing off quickly. Not recommended.'
    ]
};

// Function to generate random date within last 6 months
function randomDate() {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 6);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Function to generate a random review
function generateReview() {
    // Weighted random rating (more likely to be 4-5 stars)
    const rand = Math.random();
    let rating;
    if (rand < 0.5) rating = 5;
    else if (rand < 0.8) rating = 4;
    else if (rand < 0.9) rating = 3;
    else if (rand < 0.97) rating = 2;
    else rating = 1;
    
    const reviewerName = reviewerNames[Math.floor(Math.random() * reviewerNames.length)];
    const comments = reviewComments[rating];
    const comment = comments[Math.floor(Math.random() * comments.length)];
    const date = randomDate();
    
    return {
        reviewerName,
        rating,
        comment,
        date
    };
}

// Function to generate 5 reviews for each product
function generateFiveReviews() {
    const reviews = [];
    for (let i = 0; i < 5; i++) {
        reviews.push(generateReview());
    }
    return reviews;
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
        console.log(`📊 Found ${products.length} products in database`);
        
        let updatedCount = 0;
        
        // Add reviews to each product
        for (const product of products) {
            const reviews = generateFiveReviews();
            
            // Calculate average rating
            const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
            
            // Update product with reviews and rating
            await Product.updateOne(
                { _id: product._id },
                { 
                    $set: { 
                        reviews: reviews,
                        'rating.average': parseFloat(avgRating.toFixed(1)),
                        'rating.count': 5
                    } 
                }
            );
            
            updatedCount++;
            console.log(`✓ Updated ${product.name} - Added 5 reviews (Avg Rating: ${avgRating.toFixed(1)})`);
        }
        
        console.log(`\n🎉 Successfully added reviews to ${updatedCount} products!`);
        console.log(`📈 Each product now has 5 reviews with ratings and comments`);
        
    } catch (error) {
        console.error('❌ Error adding reviews:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
    }
}

// Run the script
addReviewsToAllProducts();
