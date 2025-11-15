// server.js (CommonJS)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // We still need 'path'

// === 1. IMPORT ROUTES ===
const productRoutes = require('./routes/products');
const newsletterRoutes = require('./routes/newsletters');
const addressRoutes = require('./routes/addresses');
const orderRoutes = require('./routes/orders');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// === 2. SERVE FRONTEND ===
// This will serve CSS, images, etc. from your 'public-frontend' folder
app.use(express.static(path.join(__dirname, 'public-frontend')));

// === 3. DB CONNECTION ===
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('ERROR: MONGO_URI (or MONGODB_URI) is not set in .env');
  process.exit(1);
}

mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB Error:', err.message || err);
    process.exit(1);
  });

// === 4. MANUAL ROUTE FOR HOMEPAGE ===
// This manually sends the homepage.html file. This bypasses the cache problem.
app.get('/homepage.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public-frontend', 'homepage.html'));
});

// === 5. USE API ROUTES ===
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend working!' });
});

app.use('/api/products', productRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', orderRoutes);

// === 6. START SERVER ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});