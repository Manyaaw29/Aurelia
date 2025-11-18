// ========== ENHANCED OOP JavaScript Implementation ==========

// Product Class
class Product {
    constructor(id, name, price, image, category) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.category = category;
    }

    getFormattedPrice() {
        return `₹${this.price.toLocaleString('en-IN')}`;
    }

    getDetails() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            image: this.image,
            category: this.category
        };
    }
}

// CartItem Class
class CartItem {
    constructor(product, quantity = 1) {
        this.product = product;
        this.quantity = quantity;
    }

    increaseQuantity() {
        this.quantity++;
    }

    decreaseQuantity() {
        if (this.quantity > 1) {
            this.quantity--;
        }
    }

    getTotalPrice() {
        return this.product.price * this.quantity;
    }

    getFormattedTotalPrice() {
        return `₹${this.getTotalPrice().toLocaleString('en-IN')}`;
    }
}

// ShoppingCart Class
class ShoppingCart {
    constructor() {
        this.items = [];
        this.cartBadge = null;
    }

    async addItem(product) {
        try {
            const token = localStorage.getItem('authToken');
            const headers = {
                'Content-Type': 'application/json'
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('/api/cart/add', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    productId: product.productId || product.id,
                    quantity: 1
                })
            });

            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                this.showNotification('Network error: Invalid server response', 'error');
                return;
            }

            if (response.ok && data.success) {
                // Update local cart state
                const existingItem = this.items.find(item => 
                    (item.product.productId || item.product.id) === (product.productId || product.id)
                );
                
                if (existingItem) {
                    existingItem.increaseQuantity();
                } else {
                    this.items.push(new CartItem(product));
                }
                
                this.updateCartUI();
                this.showNotification(`${product.name} added to cart!`, 'success');
                
                // Refresh cart count from server
                await this.fetchCartFromServer();
            } else {
                this.showNotification('Error: ' + (data.message || 'Unable to add to cart'), 'error');
            }
        } catch (error) {
            console.error('Cart error:', error);
            this.showNotification('Network error: Unable to reach server', 'error');
        }
    }

    async fetchCartFromServer() {
        try {
            const response = await fetch('/api/cart');
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.cart) {
                    // Update cart badge with server count
                    this.updateCartBadge(data.cart.items?.length || 0);
                }
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.product.id !== productId);
        this.updateCartUI();
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
    }

    getFormattedTotalPrice() {
        return `₹${this.getTotalPrice().toLocaleString('en-IN')}`;
    }

    updateCartUI() {
        this.updateCartBadge();
        this.renderCartItems();
    }

    updateCartBadge(count = null) {
        const cartIcon = document.querySelector('a[href="/cart"]');
        if (!cartIcon) return;

        if (!this.cartBadge) {
            this.cartBadge = document.createElement('span');
            this.cartBadge.style.cssText = 'position: absolute; top: -8px; right: -8px; background: #D4AF37; color: #000; border-radius: 50%; width: 20px; height: 20px; font-size: 11px; display: flex; align-items: center; justify-content: center; font-weight: 700;';
            cartIcon.style.position = 'relative';
            cartIcon.appendChild(this.cartBadge);
        }
        
        const totalItems = count !== null ? count : this.getTotalItems();
        this.cartBadge.textContent = totalItems;
        this.cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    renderCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartCountElement = document.getElementById('cartCount');
        const cartTotalElement = document.getElementById('cartTotal');

        if (!cartItemsContainer) return;

        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = '<p style="color: #ccc; text-align: center; padding: 40px 0;">Your cart is empty</p>';
        } else {
            cartItemsContainer.innerHTML = this.items.map(item => `
                <div style="display: flex; gap: 15px; margin-bottom: 20px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
                    <img src="${item.product.image}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
                    <div style="flex: 1;">
                        <h4 style="color: #D4AF37; margin-bottom: 5px; font-size: 0.95rem;">${item.product.name}</h4>
                        <p style="color: #ccc; font-size: 0.9rem;">${item.product.getFormattedPrice ? item.product.getFormattedPrice() : formatINR(item.product.price)}</p>
                        <div style="display: flex; align-items: center; gap: 10px; margin-top: 8px;">
                            <button onclick="cart.decreaseQuantity('${item.product.productId || item.product.id}')" style="background: rgba(212, 175, 55, 0.2); border: none; color: #D4AF37; width: 25px; height: 25px; border-radius: 5px; cursor: pointer;">-</button>
                            <span style="color: #fff; font-weight: 600;">${item.quantity}</span>
                            <button onclick="cart.increaseQuantity('${item.product.productId || item.product.id}')" style="background: rgba(212, 175, 55, 0.2); border: none; color: #D4AF37; width: 25px; height: 25px; border-radius: 5px; cursor: pointer;">+</button>
                            <button onclick="cart.removeItem('${item.product.productId || item.product.id}')" style="background: rgba(255, 0, 0, 0.2); border: none; color: #ff6666; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-left: auto;">Remove</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        if (cartCountElement) cartCountElement.textContent = this.getTotalItems();
        if (cartTotalElement) cartTotalElement.textContent = this.getFormattedTotalPrice();
    }

    increaseQuantity(productId) {
        const item = this.items.find(item => (item.product.productId || item.product.id) === productId);
        if (item) {
            item.increaseQuantity();
            this.updateCartUI();
        }
    }

    decreaseQuantity(productId) {
        const item = this.items.find(item => (item.product.productId || item.product.id) === productId);
        if (item) {
            item.decreaseQuantity();
            this.updateCartUI();
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.textContent = message;
        
        const bgColor = type === 'success' ? '#D4AF37' : '#ff6666';
        const textColor = type === 'success' ? '#000' : '#fff';
        
        notification.style.cssText = `position: fixed; top: 100px; right: 20px; background: ${bgColor}; color: ${textColor}; padding: 15px 25px; border-radius: 10px; font-weight: 600; z-index: 10001; animation: slideIn 0.3s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.3);`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Newsletter Class
class Newsletter {
    constructor() {}

    async subscribe(email) {
        if (!this.isValidEmail(email)) {
            throw new Error('Please enter a valid email address');
        }

        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || `Error: ${res.statusText}`);
            }

            return true;
        } catch (err) {
            throw new Error(err.message || 'Subscription failed. Please try again.');
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// SearchManager Class
class SearchManager {
    constructor(products) {
        this.products = products;
    }

    search(query) {
        const lowercaseQuery = query.toLowerCase().trim();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(lowercaseQuery) ||
            product.category.toLowerCase().includes(lowercaseQuery)
        );
    }
}

// Animation Observer Class
class AnimationObserver {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );
    }

    observe(elements) {
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = `all 0.6s ease ${index * 0.1}s`;
            this.observer.observe(element);
        });
    }
}

// Initialize cart globally
let cart;

// Helper function for formatting INR
function formatINR(price) {
    return `₹${Number(price).toLocaleString('en-IN')}`;
}

// Global function to add to cart from product card
function addToCartFromCard(event, btn) {
    // Prevent default button behavior
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const card = btn.closest('.product-card');
    if (!card) {
        console.error('Product card not found');
        return;
    }
    
    const product = {
        productId: card.getAttribute('data-product-id'),
        name: card.getAttribute('data-product-name'),
        price: Number(card.getAttribute('data-product-price')),
        image: card.getAttribute('data-product-image')
    };
    
    if (!product.productId || !product.name || !product.price) {
        console.error('Invalid product data:', product);
        cart.showNotification('Error: Invalid product data', 'error');
        return;
    }
    
    if (cart && typeof cart.addItem === 'function') {
        cart.addItem(product);
    } else {
        console.error('Cart not initialized');
    }
}

// Page Load Handler
window.addEventListener('load', () => {
    // Hide loading overlay
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
        }, 500);
    }

    // Initialize animations
    const animationObserver = new AnimationObserver();
    const categoryCards = document.querySelectorAll('.category-card');
    const productCards = document.querySelectorAll('.product-card');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    if (categoryCards.length) animationObserver.observe([...categoryCards]);
    if (productCards.length) animationObserver.observe([...productCards]);
    if (testimonialCards.length) animationObserver.observe([...testimonialCards]);
});

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    cart = new ShoppingCart();
    window.cart = cart; // Make it globally accessible
    
    // Fetch initial cart count
    cart.fetchCartFromServer();
    
    const newsletter = new Newsletter();
    const products = []; // Will be populated from page data
    const searchManager = new SearchManager(products);

    // Cart modal functionality
    const cartIcon = document.querySelector('a[href="/cart"]');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (cartIcon && cartModal) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            cartModal.style.display = 'flex';
        });
    }

    if (closeCart && cartModal) {
        closeCart.addEventListener('click', () => {
            cartModal.style.display = 'none';
        });

        closeCart.addEventListener('mouseover', () => {
            closeCart.style.transform = 'rotate(90deg)';
        });

        closeCart.addEventListener('mouseout', () => {
            closeCart.style.transform = 'rotate(0deg)';
        });
    }

    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.style.display = 'none';
            }
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.getTotalItems() > 0) {
                window.location.href = '/checkout';
            } else {
                alert('Your cart is empty!');
            }
        });

        checkoutBtn.addEventListener('mouseover', () => {
            checkoutBtn.style.transform = 'scale(1.05)';
        });

        checkoutBtn.addEventListener('mouseout', () => {
            checkoutBtn.style.transform = 'scale(1)';
        });
    }

    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterMessage = document.getElementById('newsletterMessage');
    const newsletterButton = newsletterForm?.querySelector('.newsletter-button');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletterEmail');
            const originalButtonText = newsletterButton?.textContent || 'Subscribe';

            if (newsletterButton) {
                newsletterButton.textContent = 'Subscribing...';
                newsletterButton.disabled = true;
            }
            
            try {
                await newsletter.subscribe(emailInput.value);
                
                if (newsletterMessage) {
                    newsletterMessage.textContent = '✓ Successfully subscribed! Check your email.';
                    newsletterMessage.style.color = '#D4AF37';
                }
                emailInput.value = '';
            } catch (error) {
                if (newsletterMessage) {
                    newsletterMessage.textContent = '✗ ' + error.message;
                    newsletterMessage.style.color = '#ff6666';
                }
            } finally {
                if (newsletterButton) {
                    setTimeout(() => {
                        newsletterButton.textContent = originalButtonText;
                        newsletterButton.disabled = false;
                    }, 1000);
                }
            }

            if (newsletterMessage) {
                setTimeout(() => {
                    newsletterMessage.textContent = '';
                }, 4000);
            }
        });
    }

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    let searchTimeout;

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value;
            
            searchTimeout = setTimeout(() => {
                if (query.length > 2) {
                    const results = searchManager.search(query);
                    
                    if (results.length > 0) {
                        const notification = document.createElement('div');
                        notification.textContent = `Found ${results.length} product(s) matching "${query}"`;
                        notification.style.cssText = 'position: fixed; top: 100px; right: 20px; background: #1A3D2E; color: #D4AF37; padding: 15px 25px; border-radius: 10px; font-weight: 500; z-index: 10001; animation: slideIn 0.3s ease; border: 1px solid #D4AF37;';
                        document.body.appendChild(notification);
                        
                        setTimeout(() => {
                            notification.style.animation = 'slideOut 0.3s ease';
                            setTimeout(() => notification.remove(), 300);
                        }, 2500);
                    }
                }
            }, 500);
        });
    }

    // Scroll to Top Button
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('active');
            } else {
                scrollTopBtn.classList.remove('active');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
        }
    });

    // Enhanced hover effects for product cards
    const allProductCards = document.querySelectorAll('.product-card');
    allProductCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xPercent = (x / rect.width) - 0.5;
            const yPercent = (y / rect.height) - 0.5;
            
            card.style.transform = `translateY(-10px) rotateY(${xPercent * 10}deg) rotateX(${-yPercent * 10}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateY(0) rotateX(0)';
        });
    });

    // Add ripple effect to CTA buttons
    document.querySelectorAll('.cta-button, .section-cta, .newsletter-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: 20px;
                height: 20px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: translate(-50%, -50%) scale(0);
                animation: rippleEffect 0.6s ease-out;
                pointer-events: none;
                left: ${x}px;
                top: ${y}px;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleEffect {
            to {
                transform: translate(-50%, -50%) scale(20);
                opacity: 0;
            }
        }
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    console.log('🎨 Aurelia Homepage Enhanced - All features loaded!');
    console.log('✨ Cart system initialized and ready');
});