# Aurelia Jewelry E-commerce Platform

A complete Node.js, Express, and MongoDB backend for the Aurelia Jewelry e-commerce website.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (User/Admin)
  - Secure password hashing with bcrypt
  
- **Product Management**
  - Complete CRUD operations
  - Category-based filtering
  - Search functionality
  - Product ratings and reviews
  
- **Shopping Features**
  - Cart management
  - Wishlist functionality
  - Order placement and tracking
  - Multiple payment methods support
  
- **User Profile**
  - Multiple address management
  - Order history
  - Profile updates

## 📁 Project Structure

```
Aurelia/
├── frontend/              # Static HTML/CSS/JS files
│   ├── homepage.html
│   ├── collections.html
│   ├── cart.html
│   └── ...
├── models/               # MongoDB models
│   ├── Product.js
│   ├── User.js
│   ├── Order.js
│   └── Review.js
├── controllers/          # Route controllers
│   ├── productController.js
│   ├── userController.js
│   ├── orderController.js
│   ├── cartController.js
│   ├── wishlistController.js
│   └── reviewController.js
├── routes/              # API routes
│   ├── productRoutes.js
│   ├── userRoutes.js
│   ├── orderRoutes.js
│   ├── cartRoutes.js
│   ├── wishlistRoutes.js
│   └── reviewRoutes.js
├── middleware/          # Custom middleware
│   └── auth.js
├── config/              # Configuration files
│   └── seed.js
├── public/              # Public assets
├── uploads/             # User uploads
├── server.js            # Main server file
├── package.json
├── .env.example
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Update the values in `.env`:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/aurelia_jewelry
   JWT_SECRET=your_super_secret_key
   SESSION_SECRET=your_session_secret
   ```

3. **Start MongoDB:**
   - If using local MongoDB:
   ```bash
   mongod
   ```
   - If using MongoDB Atlas, update MONGODB_URI in .env

4. **Seed the database:**
   ```bash
   npm run seed
   ```
   This will create sample products and an admin user:
   - Email: `admin@aurelia.com`
   - Password: `admin123`

5. **Start the server:**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

6. **Access the application:**
   - Frontend: `http://localhost:3000`
   - API Base: `http://localhost:3000/api`

## 📡 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `POST /api/users/logout` - Logout user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get by category
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new-arrivals` - Get new arrivals
- `GET /api/products/best-sellers` - Get best sellers
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:productId` - Update cart item
- `DELETE /api/cart/remove/:productId` - Remove from cart
- `DELETE /api/cart/clear` - Clear cart

### Wishlist
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist/add/:productId` - Add to wishlist
- `DELETE /api/wishlist/remove/:productId` - Remove from wishlist
- `POST /api/wishlist/move-to-cart/:productId` - Move to cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-token-here>
```

## 🗄️ Database Models

### User
- Personal information
- Addresses (multiple)
- Cart items
- Wishlist
- Order history

### Product
- Details (name, description, price)
- Category
- Images
- Stock management
- Ratings and reviews

### Order
- Order items
- Shipping address
- Payment information
- Status tracking
- Order history

### Review
- Product reference
- User reference
- Rating (1-5)
- Comment
- Helpful count

## 📦 Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT, bcrypt
- **Security:** Helmet, CORS, Rate limiting
- **Other:** Morgan (logging), Compression

## 🔧 Development

Run in development mode with nodemon:
```bash
npm run dev
```

## 📝 Notes

- The frontend is served as static files from the `/frontend` directory
- API responses follow a consistent format with `success`, `message`, and `data` fields
- All passwords are hashed using bcrypt
- JWT tokens expire in 7 days by default

## 👥 Admin Features

Admin users can:
- Manage all products (CRUD operations)
- View all orders
- Update order status
- Approve/disapprove reviews

## 🚦 Next Steps

1. Connect frontend JavaScript to API endpoints
2. Implement payment gateway integration
3. Add email notifications
4. Implement image upload for products
5. Add advanced filtering and sorting
6. Implement order tracking with real carriers
7. Add analytics dashboard for admin

## 📄 License

ISC

## 👤 Author

Aurelia Team
