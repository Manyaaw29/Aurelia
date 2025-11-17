const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./db/connect');

// ROUTES (will be created later)
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const wishlistRoutes = require('./routes/wishlist');
const orderRoutes = require('./routes/order');
const accountRoutes = require('./routes/account');
const addressRoutes = require('./routes/address');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect Database
connectDB();

// Handlebars Engine
const hbs = require('hbs');
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// Handlebars Helpers
hbs.registerHelper('range', function(start, end) {
  const arr = [];
  for (let i = start; i <= end; i++) {
    arr.push(i);
  }
  return arr;
});

hbs.registerHelper('lte', function(a, b) {
  return a <= b;
});

hbs.registerHelper('gt', function(a, b) {
  return a > b;
});

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Public folder for CSS/JS/Images  
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/images', express.static(path.join(__dirname, '..', '..', 'frontend', 'images')));
app.use('/products', express.static(path.join(__dirname, '..', '..', 'frontend', 'products')));
// Serve video files and other assets from frontend
app.use(express.static(path.join(__dirname, '..', '..', 'frontend')));

// Session Middleware (with fallback if MongoDB is unavailable)
const sessionOptions = {
  secret: process.env.SESSION_SECRET || 'defaultsecret123',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
};

// Only use MongoStore if MongoDB is connected
if (process.env.MONGO_URI) {
  try {
    sessionOptions.store = MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      touchAfter: 24 * 3600 // lazy session update
    });
  } catch (err) {
    console.warn("⚠️  Using in-memory session store (sessions won't persist on restart)");
  }
}

app.use(session(sessionOptions));

// Make logged-in user accessible in all views
app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId || null;
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/order', orderRoutes);
app.use('/account', accountRoutes);
app.use('/address', addressRoutes);
app.use('/', productRoutes); // Keep this last as it has catch-all routes

// Start server
app.listen(PORT, () => {
  console.log(`✔ Server running at http://localhost:${PORT}`);
});
