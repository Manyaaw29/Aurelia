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

            addItem(product) {
                const existingItem = this.items.find(item => item.product.id === product.id);
                
                if (existingItem) {
                    existingItem.increaseQuantity();
                } else {
                    this.items.push(new CartItem(product));
                }
                
                this.updateCartUI();
                this.showNotification(`${product.name} added to cart!`);
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

            updateCartBadge() {
                const cartIcon = document.querySelector('a[href="cart.html"]');
                if (!this.cartBadge) {
                    this.cartBadge = document.createElement('span');
                    this.cartBadge.style.cssText = 'position: absolute; top: -8px; right: -8px; background: #D4AF37; color: #000; border-radius: 50%; width: 20px; height: 20px; font-size: 11px; display: flex; align-items: center; justify-content: center; font-weight: 700;';
                    cartIcon.style.position = 'relative';
                    cartIcon.appendChild(this.cartBadge);
                }
                
                const totalItems = this.getTotalItems();
                this.cartBadge.textContent = totalItems;
                this.cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
            }

            renderCartItems() {
                const cartItemsContainer = document.getElementById('cartItems');
                const cartCountElement = document.getElementById('cartCount');
                const cartTotalElement = document.getElementById('cartTotal');

                if (this.items.length === 0) {
                    cartItemsContainer.innerHTML = '<p style="color: #ccc; text-align: center; padding: 40px 0;">Your cart is empty</p>';
                } else {
                    cartItemsContainer.innerHTML = this.items.map(item => `
                        <div style="display: flex; gap: 15px; margin-bottom: 20px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
                            <img src="${item.product.image}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
                            <div style="flex: 1;">
                                <h4 style="color: #D4AF37; margin-bottom: 5px; font-size: 0.95rem;">${item.product.name}</h4>
                                <p style="color: #ccc; font-size: 0.9rem;">${item.product.getFormattedPrice()}</p>
                                <div style="display: flex; align-items: center; gap: 10px; margin-top: 8px;">
                                    <button onclick="cart.decreaseQuantity(${item.product.id})" style="background: rgba(212, 175, 55, 0.2); border: none; color: #D4AF37; width: 25px; height: 25px; border-radius: 5px; cursor: pointer;">-</button>
                                    <span style="color: #fff; font-weight: 600;">${item.quantity}</span>
                                    <button onclick="cart.increaseQuantity(${item.product.id})" style="background: rgba(212, 175, 55, 0.2); border: none; color: #D4AF37; width: 25px; height: 25px; border-radius: 5px; cursor: pointer;">+</button>
                                    <button onclick="cart.removeItem(${item.product.id})" style="background: rgba(255, 0, 0, 0.2); border: none; color: #ff6666; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-left: auto;">Remove</button>
                                </div>
                            </div>
                        </div>
                    `).join('');
                }

                cartCountElement.textContent = this.getTotalItems();
                cartTotalElement.textContent = this.getFormattedTotalPrice();
            }

            increaseQuantity(productId) {
                const item = this.items.find(item => item.product.id === productId);
                if (item) {
                    item.increaseQuantity();
                    this.updateCartUI();
                }
            }

            decreaseQuantity(productId) {
                const item = this.items.find(item => item.product.id === productId);
                if (item) {
                    item.decreaseQuantity();
                    this.updateCartUI();
                }
            }

            showNotification(message) {
                const notification = document.createElement('div');
                notification.textContent = message;
                notification.style.cssText = 'position: fixed; top: 100px; right: 20px; background: #D4AF37; color: #000; padding: 15px 25px; border-radius: 10px; font-weight: 600; z-index: 10001; animation: slideIn 0.3s ease;';
                document.body.appendChild(notification);

                setTimeout(() => {
                    notification.style.animation = 'slideOut 0.3s ease';
                    setTimeout(() => notification.remove(), 300);
                }, 2000);
            }
        }

        // Newsletter Class
        // Newsletter Class
class Newsletter {
    constructor() {
        // We no longer need the this.subscribers array
    }

    async subscribe(email) {
        if (!this.isValidEmail(email)) {
            throw new Error('Please enter a valid email address');
        }

        // Send the data to your backend API
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email })
            });

            // If the server response isn't "ok" (not 200-299)
            if (!res.ok) {
                // Get the error message from your server (e.g., "Already subscribed")
                const errorData = await res.json();
                throw new Error(errorData.error || `Error: ${res.statusText}`);
            }

            // If we are here, it was successful
            return true;

        } catch (err) {
            // This catches network errors or the errors we threw above
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

        // Initialize everything
        const products = [
            new Product(1, 'Golden Grace Layered Necklace Set', 3999, 'https://artizanjoyeria.com/cdn/shop/files/preview_images/5e9d29b3369246a5b1679c40ba2bf5e2.thumbnail.0000000000_1024x.jpg?v=1744835748', 'Necklaces'),
            new Product(2, 'Golden Grace Halo Hoops Earrings', 2499, 'https://www.goodthing.co.nz/cdn/shop/files/Silk_Steel_Jewellery_-_Halo_Medium_Hoop_Earrings_232bc4b1-7b0c-4a93-a101-15491ce0837e_1600x.webp?v=1748477656', 'Earrings'),
            new Product(3, 'Golden Grace Stackable Rings', 4999, 'https://mysmartbazaar.com/cdn/shop/files/JG-PC-RNG-2780-F1.jpg?v=1730910996&width=600', 'Rings')
        ];

        const cart = new ShoppingCart();
        const newsletter = new Newsletter();
        const searchManager = new SearchManager(products);
        const animationObserver = new AnimationObserver();

        // Page Load Handler
        window.addEventListener('load', () => {
            // Hide loading overlay
            setTimeout(() => {
                document.getElementById('loadingOverlay').classList.add('hidden');
            }, 500);

            // Initialize animations
            const categoryCards = document.querySelectorAll('.category-card');
            const productCards = document.querySelectorAll('.product-card');
            const testimonialCards = document.querySelectorAll('.testimonial-card');
            
            animationObserver.observe([...categoryCards]);
            animationObserver.observe([...productCards]);
            animationObserver.observe([...testimonialCards]);
        });

        // DOM Content Loaded
        document.addEventListener('DOMContentLoaded', function() {
            // Add "Add to Cart" buttons to products
            const productCards = document.querySelectorAll('.product-card');
            
            productCards.forEach((card, index) => {
                const productInfo = card.querySelector('.product-info');
                const addToCartBtn = document.createElement('button');
                addToCartBtn.textContent = 'Add to Cart';
                addToCartBtn.style.cssText = 'width: 100%; margin-top: 15px; padding: 12px; background: linear-gradient(135deg, #D4AF37, #F4D03F); color: #000; border: none; border-radius: 20px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;';
                addToCartBtn.onmouseover = () => addToCartBtn.style.transform = 'translateY(-2px)';
                addToCartBtn.onmouseout = () => addToCartBtn.style.transform = 'translateY(0)';
                addToCartBtn.onclick = (e) => {
                    e.preventDefault();
                    cart.addItem(products[index]);
                };
                productInfo.appendChild(addToCartBtn);
            });

            // Cart modal functionality
            const cartIcon = document.querySelector('a[href="cart.html"]');
            const cartModal = document.getElementById('cartModal');
            const closeCart = document.getElementById('closeCart');
            const checkoutBtn = document.getElementById('checkoutBtn');

            cartIcon.addEventListener('click', (e) => {
                e.preventDefault();
                cartModal.style.display = 'flex';
            });

            closeCart.addEventListener('click', () => {
                cartModal.style.display = 'none';
            });

            closeCart.addEventListener('mouseover', () => {
                closeCart.style.transform = 'rotate(90deg)';
            });

            closeCart.addEventListener('mouseout', () => {
                closeCart.style.transform = 'rotate(0deg)';
            });

            cartModal.addEventListener('click', (e) => {
                if (e.target === cartModal) {
                    cartModal.style.display = 'none';
                }
            });

            checkoutBtn.addEventListener('click', () => {
                if (cart.getTotalItems() > 0) {
                    alert('Proceeding to checkout... Total: ' + cart.getFormattedTotalPrice());
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

            // Newsletter form
            // Newsletter form
const newsletterForm = document.getElementById('newsletterForm');
const newsletterMessage = document.getElementById('newsletterMessage');
const newsletterButton = newsletterForm.querySelector('.newsletter-button'); // Get the button

// Make the function async
newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletterEmail');
    const originalButtonText = newsletterButton.textContent;

    // Disable button and show loading text
    newsletterButton.textContent = 'Subscribing...';
    newsletterButton.disabled = true;
    
    try {
        // Await the API call
        await newsletter.subscribe(emailInput.value);
        
        // Success
        newsletterMessage.textContent = '✓ Successfully subscribed! Check your email.';
        newsletterMessage.style.color = '#D4AF37';
        emailInput.value = '';

    } catch (error) {
        // Show the error from the server (e.g., "Already subscribed")
        newsletterMessage.textContent = '✗ ' + error.message;
        newsletterMessage.style.color = '#ff6666';
    } finally {
        // Re-enable the button after 1 second
        setTimeout(() => {
            newsletterButton.textContent = originalButtonText;
            newsletterButton.disabled = false;
        }, 1000);
    }

    // Clear the message after a few seconds
    setTimeout(() => {
        newsletterMessage.textContent = '';
    }, 4000);
});

            // Search functionality with debounce
            const searchInput = document.querySelector('.search-input');
            let searchTimeout;

            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value;
                
                searchTimeout = setTimeout(() => {
                    if (query.length > 2) {
                        const results = searchManager.search(query);
                        console.log('Search results:', results);
                        
                        if (results.length > 0) {
                            // Show search results notification
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

            // Scroll to Top Button
            const scrollTopBtn = document.getElementById('scrollTop');

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

            // Parallax effect for hero section
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const hero = document.querySelector('.hero');
                if (hero) {
                    hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
                }
            });

            // Hover effects for category cards
            const categoryCards = document.querySelectorAll('.category-card');
            categoryCards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    categoryCards.forEach(otherCard => {
                        if (otherCard !== card) {
                            otherCard.style.opacity = '0.7';
                            otherCard.style.transform = 'scale(0.98)';
                        }
                    });
                });

                card.addEventListener('mouseleave', () => {
                    categoryCards.forEach(otherCard => {
                        otherCard.style.opacity = '1';
                        otherCard.style.transform = 'scale(1)';
                    });
                });
            });

            // Enhanced hover effects for product cards
            const allProductCards = document.querySelectorAll('.product-card');
            allProductCards.forEach(card => {
                const productImage = card.querySelector('.product-image');
                
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

            // Animated counter for testimonials section
            const observeTestimonials = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                    }
                });
            }, { threshold: 0.2 });

            document.querySelectorAll('.testimonial-card').forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(50px) scale(0.95)';
                card.style.transition = `all 0.6s ease ${index * 0.2}s`;
                observeTestimonials.observe(card);
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

            // Add ripple animation to styles dynamically
            const style = document.createElement('style');
            style.textContent = `
                @keyframes rippleEffect {
                    to {
                        transform: translate(-50%, -50%) scale(20);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);

            // Enhanced tagline animation
            const taglineText = document.querySelector('.tagline-text');
            const observeTagline = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                    }
                });
            }, { threshold: 0.5 });

            if (taglineText) {
                observeTagline.observe(taglineText);
            }

            // Story content animation
            const storyContent = document.querySelector('.story-content');
            const observeStory = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'slideInRight 0.8s ease forwards';
                    }
                });
            }, { threshold: 0.3 });

            if (storyContent) {
                observeStory.observe(storyContent);
            }

            console.log('🎨 Aurelia Homepage Enhanced - All features loaded!');
            console.log('✨ Features: Parallax, Animations, Smart Cart, Newsletter, Search');
        });