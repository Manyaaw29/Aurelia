# Database Seeding Scripts - Usage Guide

This directory contains scripts for populating and managing the Aurelia Jewelry database.

## Available Scripts

### 1. Add Reviews to All Products
**File:** `scripts/addReviews.js`

**Purpose:** Adds 5 realistic reviews to each of the 51 products in the database.

**Features:**
- Generates realistic reviewer names (25 different names)
- Creates weighted ratings (more likely to be 4-5 stars)
- Includes contextual review comments based on rating
- Assigns random dates within the last 6 months
- Updates product's average rating and review count

**Run:**
```bash
node scripts/addReviews.js
```

**Expected Output:**
```
✅ Connected to MongoDB
📊 Found 51 products in database
✓ Updated Multicolor Heart Open Ring - Added 5 reviews (Avg Rating: 4.2)
✓ Updated Thin Twig Ring - Added 5 reviews (Avg Rating: 4.2)
...
🎉 Successfully added reviews to 51 products!
📈 Each product now has 5 reviews with ratings and comments
```

**Database Changes:**
- Adds `reviews` array to each product with 5 review objects
- Each review contains: `reviewerName`, `rating`, `comment`, `date`
- Updates `rating.average` with calculated average
- Updates `rating.count` to 5

---

### 2. Set Featured Products
**File:** `scripts/setFeaturedProducts.js`

**Purpose:** Sets the three "Golden Grace" products as featured for homepage display.

**Featured Products:**
1. Golden Grace Layered Necklace Set (Necklaces)
2. Golden Grace Halo Hoops Earrings (Earrings)
3. Golden Grace Stackable Rings (Rings)

**Run:**
```bash
node scripts/setFeaturedProducts.js
```

**Expected Output:**
```
✅ Connected to MongoDB
📊 Reset all products to non-featured
✓ Set "Golden Grace Layered Necklace Set" as featured
✓ Set "Golden Grace Halo Hoops Earrings" as featured
✓ Set "Golden Grace Stackable Rings" as featured

🌟 Featured Products:
  - Golden Grace Layered Necklace Set (Necklaces)
  - Golden Grace Halo Hoops Earrings (Earrings)
  - Golden Grace Stackable Rings (Rings)
```

**Database Changes:**
- Sets `featured: false` for all products
- Sets `featured: true` for the three Golden Grace products

---

## Prerequisites

Before running these scripts, ensure:

1. **MongoDB Connection:** Update the `mongoURI` in each script with your connection string
2. **Dependencies Installed:** Run `npm install` to ensure mongoose is available
3. **Product Model:** The Product schema must support:
   - `reviews` array with embedded review objects
   - `rating.average` and `rating.count` fields
   - `featured` boolean field

---

## MongoDB Connection String

Both scripts use the connection string from `.env`:
```
mongodb+srv://manyaawasthi24cse_db_user:VYKsYk7ZCq6R3lBO@cluster0.6zx3crn.mongodb.net/aurelia_jewelry?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true
```

---

## Review Data Structure

Each review object contains:
```javascript
{
  reviewerName: String,    // e.g., "Priya Sharma"
  rating: Number,          // 1-5 (weighted towards 4-5)
  comment: String,         // Rating-appropriate comment
  date: Date              // Random date in last 6 months
}
```

**Rating Distribution:**
- 5 stars: 50% probability
- 4 stars: 30% probability
- 3 stars: 10% probability
- 2 stars: 7% probability
- 1 star: 3% probability

---

## Verification Queries

### Check if reviews were added:
```bash
node -e "const mongoose = require('mongoose'); const Product = require('./models/Product'); mongoose.connect('YOUR_MONGO_URI').then(async () => { const p = await Product.findOne().select('name reviews rating'); console.log(p); process.exit(0); });"
```

### Check featured products:
```bash
node -e "const mongoose = require('mongoose'); const Product = require('./models/Product'); mongoose.connect('YOUR_MONGO_URI').then(async () => { const p = await Product.find({ featured: true }).select('name'); console.log(p); process.exit(0); });"
```

---

## Running Scripts Locally

1. **Stop the main server** (if running):
   ```bash
   # Press Ctrl+C in the terminal running nodemon
   # Or kill all node processes:
   Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
   ```

2. **Run the scripts**:
   ```bash
   # Add reviews
   node scripts/addReviews.js
   
   # Set featured products
   node scripts/setFeaturedProducts.js
   ```

3. **Restart the server**:
   ```bash
   nodemon server
   ```

4. **Verify changes**:
   - Visit `http://localhost:3000/` to see featured products
   - Visit any product page to see the 5 reviews

---

## Troubleshooting

### Authentication Error
If you see `bad auth : authentication failed`:
- Verify the MongoDB URI in `.env` matches the one in the scripts
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure the database user has read/write permissions

### Duplicate Index Warnings
These are safe to ignore. They occur because indexes are defined both in the schema and using `schema.index()`.

### Products Not Found
If `setFeaturedProducts.js` can't find a product:
- Check the exact product name in the database
- Update the `featuredProductNames` array with the correct name
- Product names are case-sensitive

---

## Sample Review Output

After running `addReviews.js`, each product will have reviews like:

```javascript
{
  reviewerName: "Priya Sharma",
  rating: 5,
  comment: "Absolutely stunning! The craftsmanship is exceptional.",
  date: ISODate("2024-08-15T10:30:00.000Z")
},
{
  reviewerName: "Ananya Patel",
  rating: 4,
  comment: "Very nice piece. Slightly heavier than expected but still great.",
  date: ISODate("2024-09-22T14:20:00.000Z")
}
```

---

## Notes

- Scripts are **idempotent** for `setFeaturedProducts` (safe to run multiple times)
- Running `addReviews.js` multiple times will **replace** existing reviews
- Scripts automatically close the database connection after completion
- All dates are in ISO format for consistency

---

## Success Criteria

After running both scripts:

✅ All 51 products have 5 reviews each  
✅ Each product has an updated average rating  
✅ Three "Golden Grace" products are marked as featured  
✅ Homepage displays the three featured products  
✅ Product pages show the 5 reviews with names, ratings, comments, and dates

