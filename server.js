require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');

// Import routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable for development, configure properly in production
}));
app.use(compression());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'aurelia-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Static files - serve from public and frontend directories
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/images', express.static(path.join(__dirname, 'frontend', 'images')));
app.use('/products', express.static(path.join(__dirname, 'frontend', 'products')));
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);

// Middleware to check if user is authenticated (for page routes)
const checkAuth = (req, res, next) => {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    
    if (!token) {
        return res.redirect('/signin');
    }
    
    try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.redirect('/signin');
    }
};

// Frontend Routes - Render EJS templates with layout

// Root route - redirect to signin
app.get('/', (req, res) => {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    
    if (token) {
        try {
            const jwt = require('jsonwebtoken');
            jwt.verify(token, process.env.JWT_SECRET || 'secret');
            return res.redirect('/homepage');
        } catch (error) {
            return res.redirect('/signin');
        }
    }
    
    res.redirect('/signin');
});

// Homepage route - requires authentication
app.get('/homepage', checkAuth, async (req, res) => {
    try {
        const Product = require('./models/Product');
        
        // Fetch featured products for homepage best sellers section
        const featuredProducts = await Product.find({ featured: true })
            .sort({ orderId: 1 })
            .limit(3)
            .lean();
        
        const ejs = require('ejs');
        const homepageTemplate = require('fs').readFileSync(path.join(__dirname, 'views', 'homepage.ejs'), 'utf-8');
        const rendered = ejs.render(homepageTemplate, { 
            featuredProducts 
        });
        
        res.render('layout', {
            title: 'Aurelia - Luxury Jewelry | New Arrivals',
            body: rendered,
            styles: ['homepage.css'],
            scripts: ['homepage.js']
        });
    } catch (error) {
        console.error('Error loading homepage:', error);
        res.status(500).send('Error loading homepage');
    }
});

app.get('/collections', checkAuth, async (req, res) => {
    try {
        const Product = require('./models/Product');
        
        // Define strict category order: Ring, Earring, Necklace, Bracelet
        const categoryOrder = ['Rings', 'Earrings', 'Necklaces', 'Bracelets'];
        
        // Fetch New Arrivals (4 products: Ring, Earring, Necklace, Bracelet)
        // No flag filters - just get one product per category
        let newArrivals = [];
        for (const category of categoryOrder) {
            const product = await Product.findOne({ 
                category: category 
            })
            .sort({ orderId: 1 })
            .lean();
            if (product) newArrivals.push(product);
        }
        
        // Fetch Recommended For You (4 products: Ring, Earring, Necklace, Bracelet)
        // No flag filters - just get one product per category (skip 1 to get different products)
        let recommended = [];
        for (const category of categoryOrder) {
            const product = await Product.findOne({ 
                category: category 
            })
            .sort({ orderId: 1 })
            .skip(1)
            .lean();
            if (product) recommended.push(product);
        }
        
        // Fetch Most Gifted (4 products: Ring, Earring, Necklace, Bracelet)
        // No flag filters - just get one product per category (skip 2 to get different products)
        let mostGifted = [];
        for (const category of categoryOrder) {
            const product = await Product.findOne({ 
                category: category 
            })
            .sort({ orderId: 1 })
            .skip(2)
            .lean();
            if (product) mostGifted.push(product);
        }
        
        const ejs = require('ejs');
        const collectionsTemplate = require('fs').readFileSync(path.join(__dirname, 'views', 'collections.ejs'), 'utf-8');
        const rendered = ejs.render(collectionsTemplate, { 
            newArrivals, 
            mostGifted, 
            recommended 
        });
        
        res.render('layout', {
            title: 'Latest Collections | Aurelia',
            body: rendered,
            styles: ['collections.css'],
            scripts: ['collections.js']
        });
    } catch (error) {
        console.error('Error loading collections:', error);
        res.status(500).send('Error loading collections page');
    }
});

app.get('/bracelets', checkAuth, async (req, res) => {
    try {
        const Product = require('./models/Product');
        
        // Get first 8 bracelets for main section (exclude featured products)
        const products = await Product.find({ category: 'Bracelets', featured: { $ne: true } }).limit(8).lean();
        // Get next 4 different products for Most Gifted section
        const giftedProducts = await Product.find({ category: 'Bracelets', featured: { $ne: true } }).skip(8).limit(4).lean();
        
        const ejs = require('ejs');
        const categoryTemplate = require('fs').readFileSync(path.join(__dirname, 'views', 'categories.ejs'), 'utf-8');
        const rendered = ejs.render(categoryTemplate, { 
            categoryName: 'Bracelets',
            products: products, 
            giftedProducts: giftedProducts.length > 0 ? giftedProducts : products.slice(0, 2)
        });
        
        res.render('layout', {
            title: 'Bracelets Collection | Aurelia',
            body: rendered,
            styles: ['categories.css'],
            scripts: ['categories.js']
        });
    } catch (error) {
        console.error('Error loading bracelets:', error);
        res.status(500).send('Error loading bracelets page');
    }
});

app.get('/earrings', checkAuth, async (req, res) => {
    try {
        const Product = require('./models/Product');
        
        // Get first 8 earrings for main section (exclude featured products)
        const products = await Product.find({ category: 'Earrings', featured: { $ne: true } }).limit(8).lean();
        // Get next 4 different products for Most Gifted section
        const giftedProducts = await Product.find({ category: 'Earrings', featured: { $ne: true } }).skip(8).limit(4).lean();
        
        const ejs = require('ejs');
        const categoryTemplate = require('fs').readFileSync(path.join(__dirname, 'views', 'categories.ejs'), 'utf-8');
        const rendered = ejs.render(categoryTemplate, { 
            categoryName: 'Earrings',
            products: products, 
            giftedProducts: giftedProducts.length > 0 ? giftedProducts : products.slice(0, 2)
        });
        
        res.render('layout', {
            title: 'Earrings Collection | Aurelia',
            body: rendered,
            styles: ['categories.css'],
            scripts: ['categories.js']
        });
    } catch (error) {
        console.error('Error loading earrings:', error);
        res.status(500).send('Error loading earrings page');
    }
});

app.get('/necklaces', checkAuth, async (req, res) => {
    try {
        const Product = require('./models/Product');
        
        // Get first 8 necklaces for main section (exclude featured products)
        const products = await Product.find({ category: 'Necklaces', featured: { $ne: true } }).limit(8).lean();
        // Get next 4 different products for Most Gifted section
        const giftedProducts = await Product.find({ category: 'Necklaces', featured: { $ne: true } }).skip(8).limit(4).lean();
        
        const ejs = require('ejs');
        const categoryTemplate = require('fs').readFileSync(path.join(__dirname, 'views', 'categories.ejs'), 'utf-8');
        const rendered = ejs.render(categoryTemplate, { 
            categoryName: 'Necklaces',
            products: products, 
            giftedProducts: giftedProducts.length > 0 ? giftedProducts : products.slice(0, 2)
        });
        
        res.render('layout', {
            title: 'Necklaces Collection | Aurelia',
            body: rendered,
            styles: ['categories.css'],
            scripts: ['categories.js']
        });
    } catch (error) {
        console.error('Error loading necklaces:', error);
        res.status(500).send('Error loading necklaces page');
    }
});

app.get('/rings', checkAuth, async (req, res) => {
    try {
        const Product = require('./models/Product');
        
        // Get first 8 rings for main section (exclude featured products)
        const products = await Product.find({ category: 'Rings', featured: { $ne: true } }).limit(8).lean();
        // Get next 4 different products for Most Gifted section
        const giftedProducts = await Product.find({ category: 'Rings', featured: { $ne: true } }).skip(8).limit(4).lean();
        
        const ejs = require('ejs');
        const categoryTemplate = require('fs').readFileSync(path.join(__dirname, 'views', 'categories.ejs'), 'utf-8');
        const rendered = ejs.render(categoryTemplate, { 
            categoryName: 'Rings',
            products: products, 
            giftedProducts: giftedProducts.length > 0 ? giftedProducts : products.slice(0, 2)
        });
        
        res.render('layout', {
            title: 'Rings Collection | Aurelia',
            body: rendered,
            styles: ['categories.css'],
            scripts: ['categories.js']
        });
    } catch (error) {
        console.error('Error loading rings:', error);
        res.status(500).send('Error loading rings page');
    }
});

app.get('/cart', checkAuth, (req, res) => {
    res.render('layout', {
        title: 'Shopping Cart | Aurelia',
        body: require('fs').readFileSync(path.join(__dirname, 'views', 'cart.ejs'), 'utf-8'),
        styles: ['cart.css'],
        scripts: ['cart.js']
    });
});

app.get('/wishlist', checkAuth, (req, res) => {
    res.render('layout', {
        title: 'My Wishlist | Aurelia',
        body: require('fs').readFileSync(path.join(__dirname, 'views', 'wishlist.ejs'), 'utf-8'),
        styles: ['wishlist.css'],
        scripts: ['wishlist.js']
    });
});

app.get('/checkout', (req, res) => {
    res.render('layout', {
        title: 'Checkout | Aurelia',
        body: require('fs').readFileSync(path.join(__dirname, 'views', 'checkout.ejs'), 'utf-8'),
        styles: ['checkout.css'],
        scripts: ['checkout.js']
    });
});

app.get('/account', checkAuth, (req, res) => {
    res.render('layout', {
        title: 'My Account | Aurelia',
        body: require('fs').readFileSync(path.join(__dirname, 'views', 'account.ejs'), 'utf-8'),
        styles: ['account.css'],
        scripts: ['account.js']
    });
});

app.get('/address', checkAuth, (req, res) => {
    res.render('layout', {
        title: 'Manage Address | Aurelia',
        body: require('fs').readFileSync(path.join(__dirname, 'views', 'address.ejs'), 'utf-8'),
        styles: ['address.css'],
        scripts: ['address.js']
    });
});

app.get('/myorder', (req, res) => {
    res.render('layout', {
        title: 'My Orders | Aurelia',
        body: require('fs').readFileSync(path.join(__dirname, 'views', 'myorder.ejs'), 'utf-8'),
        styles: ['myorder.css'],
        scripts: ['myorder.js']
    });
});

app.get('/signin', (req, res) => {
    res.render('layout', {
        title: 'Sign In | Aurelia',
        body: require('fs').readFileSync(path.join(__dirname, 'views', 'signin.ejs'), 'utf-8'),
        styles: ['signin.css'],
        scripts: ['signin.js']
    });
});

app.get('/signup', (req, res) => {
    res.render('layout', {
        title: 'Create Account | Aurelia',
        body: require('fs').readFileSync(path.join(__dirname, 'views', 'signup.ejs'), 'utf-8'),
        styles: ['signup.css'],
        scripts: ['signup.js']
    });
});

app.get('/about_us', (req, res) => {
    res.render('layout', {
        title: 'About Us | Aurelia',
        body: require('fs').readFileSync(path.join(__dirname, 'views', 'about_us.ejs'), 'utf-8'),
        styles: ['about_us.css'],
        scripts: ['about_us.js']
    });
});

app.get('/support', (req, res) => {
    res.render('layout', {
        title: 'Customer Support | Aurelia',
        body: require('fs').readFileSync(path.join(__dirname, 'views', 'support.ejs'), 'utf-8'),
        styles: ['support.css'],
        scripts: ['support.js']
    });
});

app.get('/terms', (req, res) => {
    res.render('layout', {
        title: 'Terms & Conditions | Aurelia',
        body: require('fs').readFileSync(path.join(__dirname, 'views', 'terms.ejs'), 'utf-8'),
        styles: ['terms.css'],
        scripts: ['terms.js']
    });
});

app.get('/customerstories', (req, res) => {
    res.render('layout', {
        title: 'Customer Stories | Aurelia',
        body: require('fs').readFileSync(path.join(__dirname, 'views', 'customerstories.ejs'), 'utf-8'),
        styles: ['customerstories.css'],
        scripts: ['customerstories.js']
    });
});

// Product detail page route
app.get('/product/:id', checkAuth, async (req, res) => {
    try {
        const Product = require('./models/Product');
        const Review = require('./models/Review');
        
        // Get product from database
        let product = await Product.findById(req.params.id).lean();
        
        if (!product) {
            return res.status(404).send('Product not found');
        }
        
        // Get approved reviews from Review collection
        const reviews = await Review.find({
            product: req.params.id,
            isApproved: true
        })
        .populate('user', 'name')
        .sort('-createdAt')
        .lean();
        
        // Get matching collection products - 1 from each OTHER category (3 total)
        // Never show current product's category
        let matchingProducts = [];
        const allCategories = ['Rings', 'Earrings', 'Necklaces', 'Bracelets'];
        const otherCategories = allCategories.filter(cat => cat !== product.category);
        
        for (const category of otherCategories) {
            const catProduct = await Product.findOne({
                category: category,
                _id: { $ne: product._id }
            })
            .sort({ orderId: 1 })
            .lean();
            
            if (catProduct) {
                matchingProducts.push(catProduct);
            }
        }
        
        // Get You May Also Like - EXACTLY 8 products (2 from each category)
        // Same across all pages, excluding current product
        let recommendedProducts = [];
        
        for (const category of allCategories) {
            const catProducts = await Product.find({
                category: category,
                _id: { $ne: product._id }
            })
            .sort({ orderId: 1 })
            .limit(2)
            .lean();
            
            recommendedProducts = [...recommendedProducts, ...catProducts];
        }
        
        // Format product data for template
        const formattedProduct = {
            _id: product._id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            discount: product.discount,
            images: product.images.map(img => img.url || img), // Support both formats
            description: product.description,
            stylingTip: product.stylingTip || 'Perfect for any occasion',
            category: product.category,
            sku: product.sku,
            stock: product.stockQuantity,
            material: product.material,
            weight: product.weight + 'g',
            dimensions: product.dimensions,
            rating: product.rating?.average || 4.5,
            reviewCount: product.rating?.count || 0,
            offers: [
                'Buy any 2 products and get 1 FREE jewelry cleaning cloth',
                'Extra 15% off on prepaid orders above ₹12,000',
                'Complimentary luxury gift box with every purchase',
                'Free professional jewelry cleaning service (lifetime)'
            ],
            matchingProducts: matchingProducts.map(p => ({
                _id: p._id,
                name: p.name,
                images: p.images.map(img => img.url || img)
            })),
            suggestedItems: recommendedProducts.map(p => ({
                _id: p._id,
                name: p.name,
                price: p.price,
                images: p.images.map(img => img.url || img)
            })),
            reviews: reviews.map(r => ({
                _id: r._id,
                customerName: r.user?.name || r.title || 'Anonymous',
                rating: r.rating,
                comment: r.comment,
                date: r.createdAt,
                title: r.title
            }))
        };
        
        const ejs = require('ejs');
        const productTemplate = require('fs').readFileSync(path.join(__dirname, 'views', 'product.ejs'), 'utf-8');
        const renderedProduct = ejs.render(productTemplate, { product: formattedProduct });
        
        res.render('layout', {
            title: `${formattedProduct.name} | Aurelia`,
            body: renderedProduct,
            styles: ['product.css'],
            scripts: ['product.js']
        });
    } catch (error) {
        console.error('Error loading product:', error);
        res.status(500).send('Error loading product page');
    }
});

// ============ API ROUTES ============

// Cart Routes
app.post('/api/cart/add', async (req, res) => {
    try {
        const Cart = require('./models/Cart');
        const Product = require('./models/Product');
        const { productId, quantity = 1 } = req.body;
        
        if (!productId) {
            return res.status(400).json({ success: false, message: 'Product ID required' });
        }
        
        // Get product details
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        // Get session ID from cookies or create new one
        let sessionId = req.cookies?.sessionId;
        if (!sessionId) {
            sessionId = require('crypto').randomBytes(16).toString('hex');
            res.cookie('sessionId', sessionId, { maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 days
        }
        
        // Find or create cart
        let cart = await Cart.findOne({ sessionId });
        if (!cart) {
            cart = new Cart({ sessionId, items: [] });
        }
        
        // Check if product already in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );
        
        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({
                product: productId,
                quantity: quantity,
                price: product.price
            });
        }
        
        await cart.save();
        
        res.json({ success: true, message: 'Product added to cart', cart });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ success: false, message: 'Error adding to cart' });
    }
});

app.get('/api/cart', async (req, res) => {
    try {
        const Cart = require('./models/Cart');
        const sessionId = req.cookies?.sessionId;
        
        if (!sessionId) {
            return res.json({ success: true, cart: { items: [], totalAmount: 0 } });
        }
        
        const cart = await Cart.findOne({ sessionId }).populate('items.product');
        
        if (!cart) {
            return res.json({ success: true, cart: { items: [], totalAmount: 0 } });
        }
        
        // Add image field for compatibility
        const items = cart.items.map(item => {
            const product = item.product.toObject();
            if (!product.image && product.images && product.images.length > 0) {
                product.image = product.images[0].url || product.images[0];
            }
            return { ...item.toObject(), product };
        });
        
        res.json({ success: true, cart: { items, totalAmount: cart.totalAmount } });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ success: false, message: 'Error fetching cart' });
    }
});

app.delete('/api/cart/remove/:productId', async (req, res) => {
    try {
        const Cart = require('./models/Cart');
        const sessionId = req.cookies?.sessionId;
        const { productId } = req.params;
        
        if (!sessionId) {
            return res.status(400).json({ success: false, message: 'No cart found' });
        }
        
        const cart = await Cart.findOne({ sessionId });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }
        
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        
        res.json({ success: true, message: 'Product removed from cart' });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ success: false, message: 'Error removing from cart' });
    }
});

app.put('/api/cart/update/:productId', async (req, res) => {
    try {
        const Cart = require('./models/Cart');
        const sessionId = req.cookies?.sessionId;
        const { productId } = req.params;
        const { quantity } = req.body;
        
        if (!sessionId) {
            return res.status(400).json({ success: false, message: 'No cart found' });
        }
        
        const cart = await Cart.findOne({ sessionId });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }
        
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            await cart.save();
        }
        
        res.json({ success: true, message: 'Cart updated' });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ success: false, message: 'Error updating cart' });
    }
});

// Wishlist Routes
app.post('/api/wishlist/add', async (req, res) => {
    try {
        const Wishlist = require('./models/Wishlist');
        const Product = require('./models/Product');
        const { productId } = req.body;
        
        if (!productId) {
            return res.status(400).json({ success: false, message: 'Product ID required' });
        }
        
        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        // Get session ID from cookies or create new one
        let sessionId = req.cookies?.sessionId;
        if (!sessionId) {
            sessionId = require('crypto').randomBytes(16).toString('hex');
            res.cookie('sessionId', sessionId, { maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 days
        }
        
        // Find or create wishlist
        let wishlist = await Wishlist.findOne({ sessionId });
        if (!wishlist) {
            wishlist = new Wishlist({ sessionId, products: [] });
        }
        
        // Check if product already in wishlist
        if (!wishlist.products.includes(productId)) {
            wishlist.products.push(productId);
            await wishlist.save();
        }
        
        res.json({ success: true, message: 'Product added to wishlist' });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ success: false, message: 'Error adding to wishlist' });
    }
});

app.get('/api/wishlist', async (req, res) => {
    try {
        const Wishlist = require('./models/Wishlist');
        const sessionId = req.cookies?.sessionId;
        
        if (!sessionId) {
            return res.json({ success: true, products: [] });
        }
        
        const wishlist = await Wishlist.findOne({ sessionId }).populate('products');
        
        if (!wishlist) {
            return res.json({ success: true, products: [] });
        }
        
        // Add image field for compatibility
        const products = wishlist.products.map(product => {
            const productObj = product.toObject();
            if (!productObj.image && productObj.images && productObj.images.length > 0) {
                productObj.image = productObj.images[0].url || productObj.images[0];
            }
            return productObj;
        });
        
        res.json({ success: true, products });
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ success: false, message: 'Error fetching wishlist' });
    }
});

app.delete('/api/wishlist/remove/:productId', async (req, res) => {
    try {
        const Wishlist = require('./models/Wishlist');
        const sessionId = req.cookies?.sessionId;
        const { productId } = req.params;
        
        if (!sessionId) {
            return res.status(400).json({ success: false, message: 'No wishlist found' });
        }
        
        const wishlist = await Wishlist.findOne({ sessionId });
        if (!wishlist) {
            return res.status(404).json({ success: false, message: 'Wishlist not found' });
        }
        
        wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
        await wishlist.save();
        
        res.json({ success: true, message: 'Product removed from wishlist' });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        res.status(500).json({ success: false, message: 'Error removing from wishlist' });
    }
});

// Clear entire wishlist
app.delete('/api/wishlist/clear', async (req, res) => {
    try {
        const Wishlist = require('./models/Wishlist');
        const sessionId = req.cookies?.sessionId;
        
        if (!sessionId) {
            return res.json({ success: true, message: 'No wishlist to clear' });
        }
        
        await Wishlist.findOneAndDelete({ sessionId });
        
        res.json({ success: true, message: 'Wishlist cleared successfully' });
    } catch (error) {
        console.error('Error clearing wishlist:', error);
        res.status(500).json({ success: false, message: 'Error clearing wishlist' });
    }
});

// Add all wishlist items to cart
app.post('/api/wishlist/add-all-to-cart', async (req, res) => {
    try {
        const Wishlist = require('./models/Wishlist');
        const Cart = require('./models/Cart');
        const Product = require('./models/Product');
        const sessionId = req.cookies?.sessionId;
        
        if (!sessionId) {
            return res.status(400).json({ success: false, message: 'No session found' });
        }
        
        // Get wishlist
        const wishlist = await Wishlist.findOne({ sessionId }).populate('products');
        if (!wishlist || wishlist.products.length === 0) {
            return res.status(400).json({ success: false, message: 'Wishlist is empty' });
        }
        
        // Get or create cart
        let cart = await Cart.findOne({ sessionId });
        if (!cart) {
            cart = new Cart({ sessionId, items: [] });
        }
        
        // Add each wishlist product to cart
        let addedCount = 0;
        for (const product of wishlist.products) {
            // Check if product is in stock
            if (product.stockQuantity > 0) {
                // Check if already in cart
                const existingItemIndex = cart.items.findIndex(
                    item => item.product.toString() === product._id.toString()
                );
                
                if (existingItemIndex > -1) {
                    // Increase quantity
                    cart.items[existingItemIndex].quantity += 1;
                } else {
                    // Add new item
                    cart.items.push({
                        product: product._id,
                        quantity: 1,
                        price: product.price
                    });
                }
                addedCount++;
            }
        }
        
        await cart.save();
        
        res.json({ 
            success: true, 
            message: `${addedCount} item${addedCount !== 1 ? 's' : ''} added to cart`,
            addedCount 
        });
    } catch (error) {
        console.error('Error adding all to cart:', error);
        res.status(500).json({ success: false, message: 'Error adding items to cart' });
    }
});

// === SAVED FOR LATER ROUTES ===

// Get saved for later items
app.get('/api/saved-for-later', async (req, res) => {
    try {
        const SavedForLater = require('./models/SavedForLater');
        const sessionId = req.cookies?.sessionId;
        
        if (!sessionId) {
            return res.json({ success: true, products: [] });
        }
        
        const saved = await SavedForLater.findOne({ sessionId }).populate('products');
        
        if (!saved) {
            return res.json({ success: true, products: [] });
        }
        
        // Add image field for compatibility
        const products = saved.products.map(product => {
            const productObj = product.toObject();
            if (!productObj.image && productObj.images && productObj.images.length > 0) {
                productObj.image = productObj.images[0].url || productObj.images[0];
            }
            return productObj;
        });
        
        res.json({ success: true, products });
    } catch (error) {
        console.error('Error fetching saved items:', error);
        res.status(500).json({ success: false, message: 'Error fetching saved items' });
    }
});

// Add to saved for later
app.post('/api/saved-for-later/add', async (req, res) => {
    try {
        const SavedForLater = require('./models/SavedForLater');
        const { productId } = req.body;
        let sessionId = req.cookies?.sessionId;
        
        if (!sessionId) {
            sessionId = require('crypto').randomBytes(32).toString('hex');
            res.cookie('sessionId', sessionId, { 
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true 
            });
        }
        
        let saved = await SavedForLater.findOne({ sessionId });
        
        if (!saved) {
            saved = new SavedForLater({ sessionId, products: [] });
        }
        
        if (!saved.products.includes(productId)) {
            saved.products.push(productId);
            await saved.save();
        }
        
        res.json({ success: true, message: 'Product saved for later' });
    } catch (error) {
        console.error('Error saving for later:', error);
        res.status(500).json({ success: false, message: 'Error saving product' });
    }
});

// Remove from saved for later
app.delete('/api/saved-for-later/remove/:productId', async (req, res) => {
    try {
        const SavedForLater = require('./models/SavedForLater');
        const sessionId = req.cookies?.sessionId;
        const { productId } = req.params;
        
        if (!sessionId) {
            return res.status(400).json({ success: false, message: 'No saved items found' });
        }
        
        const saved = await SavedForLater.findOne({ sessionId });
        if (!saved) {
            return res.status(404).json({ success: false, message: 'Saved items not found' });
        }
        
        saved.products = saved.products.filter(id => id.toString() !== productId);
        await saved.save();
        
        res.json({ success: true, message: 'Product removed from saved items' });
    } catch (error) {
        console.error('Error removing saved item:', error);
        res.status(500).json({ success: false, message: 'Error removing saved item' });
    }
});

// Move from saved to cart
app.post('/api/saved-for-later/move-to-cart/:productId', async (req, res) => {
    try {
        const SavedForLater = require('./models/SavedForLater');
        const Cart = require('./models/Cart');
        const Product = require('./models/Product');
        const sessionId = req.cookies?.sessionId;
        const { productId } = req.params;
        
        if (!sessionId) {
            return res.status(400).json({ success: false, message: 'No session found' });
        }
        
        // Get product details
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        // Remove from saved
        const saved = await SavedForLater.findOne({ sessionId });
        if (saved) {
            saved.products = saved.products.filter(id => id.toString() !== productId);
            await saved.save();
        }
        
        // Add to cart
        let cart = await Cart.findOne({ sessionId });
        if (!cart) {
            cart = new Cart({ sessionId, items: [] });
        }
        
        const existingItem = cart.items.find(item => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({
                product: productId,
                quantity: 1,
                price: product.price
            });
        }
        
        await cart.save();
        
        res.json({ success: true, message: 'Product moved to cart' });
    } catch (error) {
        console.error('Error moving to cart:', error);
        res.status(500).json({ success: false, message: 'Error moving product' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server first, then connect to MongoDB (non-blocking)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🎨 EJS template engine configured`);
    console.log(`📁 Views directory: ${path.join(__dirname, 'views')}`);
});

// Database connection (non-blocking)
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log('✅ MongoDB connected successfully');
        })
        .catch((err) => {
            console.warn('⚠️  MongoDB connection failed - API routes may not work:', err.message);
            console.log('💡 Frontend pages will still work without database');
        });
} else {
    console.log('ℹ️  MongoDB URI not configured - running in frontend-only mode');
}

module.exports = app;

// Add this after MongoDB connection in server.js (temporarily)
mongoose.connection.once('open', async () => {
    try {
        await mongoose.connection.collection('reviews').dropIndex('product_1_user_1');
        console.log('✅ Dropped unique index on reviews');
    } catch (error) {
        console.log('ℹ️ Index may not exist or already dropped:', error.message);
    }
});