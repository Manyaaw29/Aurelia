# Aurelia Jewelry - Complete Project Documentation

## 🎯 **Project Overview**

Aurelia is a luxury jewelry e-commerce platform built with **Node.js**, **Express.js**, **MongoDB**, and **EJS** templating. The project features a complete backend API with authentication, cart management, orders, and a fully responsive frontend with 17+ pages.

---

## 📚 **Technology Stack**

### **Backend**
- **Node.js** v14+ - Runtime environment
- **Express.js** 4.18.2 - Web framework
- **MongoDB** with **Mongoose** 8.0.3 - Database
- **JWT** (jsonwebtoken 9.0.2) - Authentication
- **bcryptjs** 2.4.3 - Password hashing
- **EJS** - Template engine

### **Frontend**
- **HTML5** - Semantic markup
- **CSS3** - Custom styling with gradients, animations
- **JavaScript ES6+** - OOP classes, async/await, Fetch API
- **Font Awesome** 6.5.0 - Icons
- **Google Fonts** - Playfair Display, Inter

### **Development Tools**
- **nodemon** 3.0.2 - Auto-restart server
- **morgan** - HTTP request logger
- **helmet** - Security headers
- **compression** - Gzip compression
- **cors** - Cross-origin resource sharing

---

## 📁 **Complete Directory Structure**

```
Aurelia/
│
├── server.js                      # Main Express application
├── package.json                   # Dependencies and scripts
├── .env                           # Environment variables
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
├── README.md                      # Backend API documentation
├── EJS_CONVERSION_SUMMARY.md      # Frontend conversion guide
│
├── config/
│   └── seed.js                    # Database seeding script
│
├── models/                        # Mongoose schemas
│   ├── Product.js                 # Product schema with categories
│   ├── User.js                    # User schema with auth
│   ├── Order.js                   # Order schema with tracking
│   └── Review.js                  # Review schema
│
├── controllers/                   # Business logic
│   ├── productController.js       # Product CRUD operations
│   ├── userController.js          # User auth & profile
│   ├── cartController.js          # Cart management
│   ├── wishlistController.js      # Wishlist operations
│   ├── orderController.js         # Order processing
│   └── reviewController.js        # Review management
│
├── routes/                        # API endpoints
│   ├── productRoutes.js           # /api/products
│   ├── userRoutes.js              # /api/users
│   ├── cartRoutes.js              # /api/cart
│   ├── wishlistRoutes.js          # /api/wishlist
│   ├── orderRoutes.js             # /api/orders
│   └── reviewRoutes.js            # /api/reviews
│
├── middleware/
│   └── auth.js                    # JWT authentication middleware
│
├── views/                         # EJS templates
│   ├── layout.ejs                 # Master layout
│   ├── partials/
│   │   ├── header.ejs             # Shared header
│   │   └── footer.ejs             # Shared footer
│   ├── homepage.ejs               # Main landing page
│   ├── about_us.ejs               # Company info
│   ├── collections.ejs            # Product collections
│   ├── bracelets.ejs              # Bracelets category
│   ├── earrings.ejs               # Earrings category
│   ├── necklaces.ejs              # Necklaces category
│   ├── rings.ejs                  # Rings category
│   ├── cart.ejs                   # Shopping cart
│   ├── wishlist.ejs               # Saved items
│   ├── checkout.ejs               # Order checkout
│   ├── account.ejs                # User profile
│   ├── address.ejs                # Address management
│   ├── myorder.ejs                # Order history
│   ├── signin.ejs                 # Login page
│   ├── signup.ejs                 # Registration
│   ├── support.ejs                # Customer support
│   ├── terms.ejs                  # Terms & conditions
│   └── customerstories.ejs        # Testimonials
│
├── public/                        # Static assets
│   ├── css/                       # Stylesheets (15 files)
│   │   ├── homepage.css
│   │   ├── about_us.css
│   │   ├── categories.css         # Shared by 4 category pages
│   │   ├── collections.css
│   │   ├── cart.css
│   │   ├── wishlist.css
│   │   ├── checkout.css
│   │   ├── account.css
│   │   ├── address.css
│   │   ├── myorder.css
│   │   ├── signin.css
│   │   ├── signup.css
│   │   ├── support.css
│   │   ├── terms.css
│   │   └── customerstories.css
│   └── js/                        # Client-side scripts (18 files)
│       ├── homepage.js            # OOP cart, newsletter, search
│       ├── about_us.js
│       ├── collections.js
│       ├── bracelets.js
│       ├── earrings.js
│       ├── necklaces.js
│       ├── rings.js
│       ├── cart.js
│       ├── wishlist.js
│       ├── checkout.js
│       ├── account.js
│       ├── address.js
│       ├── myorder.js
│       ├── signin.js
│       ├── signup.js
│       ├── support.js
│       ├── terms.js
│       └── customerstories.js
│
├── frontend/                      # Original HTML files (backup)
│   ├── homepage.html
│   ├── about_us.html
│   ├── collections.html
│   ├── [14 more HTML files]
│   ├── homepage.mp4               # Hero video
│   ├── images/                    # Product images
│   │   └── [various image files]
│   └── products/                  # Product detail pages
│       ├── homepage/
│       │   ├── homepage_1.html
│       │   ├── homepage_2.html
│       │   └── homepage_3.html
│       ├── bracelets/
│       │   ├── product1.html
│       │   └── [11 more products]
│       ├── earrings/
│       │   └── [12 products]
│       ├── necklaces/
│       │   └── [12 products]
│       └── rings/
│           └── [12 products]
│
└── node_modules/                  # Dependencies (gitignored)
```

---

## 🗄️ **Database Schema**

### **Product Model**
```javascript
{
  name: String,                    // Product name
  description: String,             // Product description
  price: Number,                   // Base price
  discount: Number,                // Discount percentage
  finalPrice: Number (virtual),    // Calculated price
  category: Enum,                  // rings, necklaces, earrings, bracelets
  sku: String (unique),            // Stock keeping unit
  images: [String],                // Image URLs
  stock: Number,                   // Available quantity
  inStock: Boolean (virtual),      // Availability status
  rating: {
    average: Number,
    count: Number
  },
  tags: [String],                  // Search tags
  featured: Boolean,               // Featured flag
  newArrival: Boolean,             // New arrival flag
  bestSeller: Boolean,             // Best seller flag
  views: Number,                   // View count
  soldCount: Number                // Sales count
}
```

### **User Model**
```javascript
{
  name: String,                    // Full name
  email: String (unique),          // Email address
  password: String (hashed),       // Encrypted password
  phone: String,                   // Phone number
  role: Enum,                      // user, admin
  addresses: [{
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: Boolean
  }],
  wishlist: [ProductId],           // Saved products
  cart: [ProductId],               // Cart items
  orders: [OrderId],               // Order history
  active: Boolean                  // Account status
}
```

### **Order Model**
```javascript
{
  orderNumber: String (unique),    // Auto-generated
  user: UserId,                    // Customer reference
  items: [{
    product: ProductId,
    quantity: Number,
    price: Number
  }],
  shippingAddress: Object,         // Delivery address
  paymentMethod: String,           // COD, card, UPI
  paymentStatus: Enum,             // pending, completed, failed
  subtotal: Number,                // Items total
  tax: Number,                     // Tax amount
  shippingCost: Number,            // Delivery charge
  totalAmount: Number,             // Final total
  orderStatus: Enum,               // pending → processing → shipped → delivered
  statusHistory: [{
    status: String,
    timestamp: Date,
    note: String
  }],
  tracking: {
    provider: String,
    number: String,
    url: String
  }
}
```

### **Review Model**
```javascript
{
  product: ProductId,              // Product reference
  user: UserId,                    // Reviewer
  rating: Number,                  // 1-5 stars
  title: String,                   // Review headline
  comment: String,                 // Review text
  helpful: Number,                 // Helpfulness count
  verified: Boolean                // Verified purchase
}
```

---

## 🌐 **API Endpoints**

### **Products**
```
GET    /api/products              - Get all products (with filters)
GET    /api/products/search       - Search products
GET    /api/products/category/:category - Get by category
GET    /api/products/featured     - Get featured products
GET    /api/products/new-arrivals - Get new arrivals
GET    /api/products/best-sellers - Get best sellers
GET    /api/products/:id          - Get single product
POST   /api/products              - Create product (Admin)
PUT    /api/products/:id          - Update product (Admin)
DELETE /api/products/:id          - Delete product (Admin)
```

### **Users**
```
POST   /api/users/register        - Register new user
POST   /api/users/login           - Login user
GET    /api/users/profile         - Get user profile (Auth)
PUT    /api/users/profile         - Update profile (Auth)
PUT    /api/users/password        - Change password (Auth)
```

### **Cart**
```
GET    /api/cart                  - Get cart items (Auth)
POST   /api/cart                  - Add to cart (Auth)
PUT    /api/cart/:productId       - Update quantity (Auth)
DELETE /api/cart/:productId       - Remove from cart (Auth)
DELETE /api/cart                  - Clear cart (Auth)
```

### **Wishlist**
```
GET    /api/wishlist              - Get wishlist (Auth)
POST   /api/wishlist              - Add to wishlist (Auth)
DELETE /api/wishlist/:productId   - Remove from wishlist (Auth)
```

### **Orders**
```
GET    /api/orders                - Get user orders (Auth)
GET    /api/orders/:id            - Get single order (Auth)
POST   /api/orders                - Create order (Auth)
PUT    /api/orders/:id/status     - Update status (Admin)
PUT    /api/orders/:id/cancel     - Cancel order (Auth)
```

### **Reviews**
```
GET    /api/reviews/product/:productId - Get product reviews
POST   /api/reviews               - Create review (Auth)
PUT    /api/reviews/:id           - Update review (Auth)
DELETE /api/reviews/:id           - Delete review (Auth)
PUT    /api/reviews/:id/helpful   - Mark helpful (Auth)
```

---

## 🎨 **Frontend Routes**

```
GET    /                          - Homepage
GET    /collections               - Latest collections
GET    /bracelets                 - Bracelets category
GET    /earrings                  - Earrings category
GET    /necklaces                 - Necklaces category
GET    /rings                     - Rings category
GET    /cart                      - Shopping cart
GET    /wishlist                  - Wishlist
GET    /checkout                  - Checkout page
GET    /account                   - User account
GET    /address                   - Address management
GET    /myorder                   - Order history
GET    /signin                    - Login page
GET    /signup                    - Registration
GET    /about_us                  - About company
GET    /support                   - Customer support
GET    /terms                     - Terms & conditions
GET    /customerstories           - Testimonials
```

---

## 🚀 **Getting Started**

### **1. Install Dependencies**
```bash
npm install
```

### **2. Setup Environment**
Create `.env` file:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/aurelia_jewelry
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
SESSION_SECRET=your_session_secret
```

### **3. Start MongoDB**
```bash
mongod
```

### **4. Seed Database** (Optional)
```bash
npm run seed
```

### **5. Start Server**
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

### **6. Access Application**
```
Frontend: http://localhost:3000
API:      http://localhost:3000/api
```

---

## 🔧 **npm Scripts**

```json
{
  "start": "node server.js",       // Production server
  "dev": "nodemon server.js",      // Development with auto-reload
  "seed": "node config/seed.js"    // Seed database
}
```

---

## 🔐 **Authentication Flow**

1. **Register**: POST `/api/users/register` with email, password, name
2. **Login**: POST `/api/users/login` → receives JWT token
3. **Use Token**: Send token in header: `Authorization: Bearer <token>`
4. **Protected Routes**: Middleware validates token, attaches user to req.user
5. **Role Check**: Admin-only routes check `req.user.role === 'admin'`

---

## 🛒 **Cart Management**

### **Client-Side (public/js/homepage.js)**
```javascript
class ShoppingCart {
  addItem(product)       // Add product to cart
  removeItem(productId)  // Remove from cart
  updateCartUI()         // Refresh cart display
  getTotalPrice()        // Calculate total
  showNotification(msg)  // Show alert
}
```

### **Server-Side (/api/cart)**
- Cart stored in User model (cart: [ProductId])
- Persistent across sessions
- Syncs with database on each change

---

## 📧 **Newsletter System**

### **Frontend (public/js/homepage.js)**
```javascript
class Newsletter {
  async subscribe(email)  // Send to /api/newsletter
  isValidEmail(email)     // Validate email format
}
```

### **Backend (Future Enhancement)**
- POST `/api/newsletter` endpoint to be implemented
- Store subscribers in Newsletter collection
- Integrate with email service (SendGrid, Mailgun)

---

## 🔍 **Search Functionality**

### **Frontend Search**
```javascript
class SearchManager {
  search(query)  // Filter products by name/category
}
```

### **Backend Search**
```
GET /api/products/search?q=keyword
- Text search using MongoDB indexes
- Search in name, description, tags
```

---

## 📱 **Responsive Design**

### **Breakpoints**
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

### **Features**
- Mobile-first CSS approach
- Touch-friendly navigation
- Collapsible menu on mobile
- Responsive product grids
- Optimized images

---

## 🎨 **Design System**

### **Colors**
```css
--color-primary: #D4AF37     /* Gold */
--color-secondary: #F4D03F    /* Light Gold */
--color-dark: #0D2818         /* Dark Green */
--color-accent: #1A3D2E       /* Medium Green */
--color-text: #FFFFFF         /* White */
--color-grey: #CCCCCC         /* Grey */
```

### **Typography**
```css
font-family-serif: 'Playfair Display', serif   /* Headings */
font-family-sans: 'Inter', sans-serif           /* Body text */
```

### **Animations**
- Fade in/out transitions
- Hover scale effects
- Parallax scrolling
- Smooth scroll to top
- Ripple button effects

---

## 🔒 **Security Features**

1. **Helmet.js** - HTTP security headers
2. **bcryptjs** - Password hashing (10 salt rounds)
3. **JWT** - Token-based authentication
4. **express-validator** - Input validation
5. **CORS** - Cross-origin protection
6. **Rate Limiting** - DDoS prevention (future)
7. **Session Security** - httpOnly cookies

---

## 📊 **Performance Optimizations**

1. **Compression** - Gzip middleware
2. **Static Asset Caching** - Express static with caching
3. **Database Indexing** - Optimized queries
4. **Image Optimization** - Lazy loading (future)
5. **CDN Usage** - Font Awesome, Google Fonts

---

## 🧪 **Testing** (Future Enhancement)

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

---

## 📦 **Deployment** (Future Steps)

### **Heroku**
```bash
heroku create aurelia-jewelry
git push heroku main
```

### **MongoDB Atlas**
Update `.env`:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/aurelia
```

### **Environment Variables**
Set in hosting platform dashboard:
- `NODE_ENV=production`
- `JWT_SECRET=<strong_secret>`
- `MONGODB_URI=<atlas_connection_string>`

---

## 📝 **TODO / Future Enhancements**

### **Backend**
- [ ] Email verification for registration
- [ ] Password reset functionality
- [ ] Admin dashboard for products/orders
- [ ] Payment gateway integration (Stripe, Razorpay)
- [ ] Order tracking with real-time updates
- [ ] Advanced search with filters (price range, rating)
- [ ] Product recommendations (AI/ML)
- [ ] Inventory management system

### **Frontend**
- [ ] Progressive Web App (PWA)
- [ ] Product image zoom/gallery
- [ ] Quick view product modal
- [ ] Infinite scroll for products
- [ ] Filter sidebar (price, rating, tags)
- [ ] User reviews display on product pages
- [ ] Order tracking page
- [ ] Live chat support
- [ ] Multi-language support (i18n)

### **Testing & DevOps**
- [ ] Unit tests (Jest, Mocha)
- [ ] Integration tests (Supertest)
- [ ] E2E tests (Cypress, Playwright)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Docker containerization
- [ ] Logging system (Winston, Morgan)
- [ ] Error monitoring (Sentry)
- [ ] Performance monitoring (New Relic)

---

## 🐛 **Known Issues**

1. **Mongoose Index Warnings** - Duplicate index definitions in models (non-critical)
2. **MongoDB Connection** - Server requires MongoDB to start (now non-blocking for frontend)
3. **Newsletter API** - Not yet implemented (frontend ready)
4. **Product Detail Pages** - Still use HTML files (need EJS conversion)

---

## 📚 **Documentation Files**

- **README.md** - Backend API documentation
- **EJS_CONVERSION_SUMMARY.md** - Frontend conversion guide
- **PROJECT_DOCUMENTATION.md** (this file) - Complete project overview

---

## 👥 **Contributors**

- **Developer**: Aurelia Team
- **Project**: Aurelia Jewelry E-commerce Platform
- **License**: ISC

---

## 📞 **Support**

For questions or issues:
- Check documentation files
- Review code comments
- Test API endpoints with Postman/Insomnia
- Check browser console for frontend errors
- Review server logs for backend issues

---

**Project Status**: ✅ **Core Development Complete**  
**Next Phase**: Feature enhancements, testing, deployment

---

*Last Updated: January 2025*
