// ========== OOP CLASSES ==========

        // Product Class - Represents a single product
        class Product {
            constructor(data) {
                this.id = data.id;
                this.name = data.name;
                this.price = data.price;
                this.image = data.image;
                this.category = data.category;
                this.description = data.description || '';
                this.productPage = data.productPage || '#';
            }

            getFormattedPrice() {
                return `₹${this.price.toLocaleString('en-IN')}`;
            }

            renderHTML() {
                return `
                    <a href="${this.productPage}" class="product-card" data-id="${this.id}" data-category="${this.category}">
                        <div class="product-image" style="background-image: url('${this.image}');"></div>
                        <div class="product-info">
                            <div class="product-name">${this.name}</div>
                            <div class="product-actions">
                                <div class="product-price">${this.getFormattedPrice()}</div>
                                <div class="action-icons">
                                    <div class="action-icon wishlist-icon" data-id="${this.id}" data-name="${this.name}" title="Add to Wishlist">♡</div>
                                    <div class="action-icon cart-icon" data-id="${this.id}" data-name="${this.name}" title="Add to Cart">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <circle cx="9" cy="21" r="1"></circle>
                                            <circle cx="20" cy="21" r="1"></circle>
                                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                `;
            }
        }

        // ProductCollection Class - Manages a collection of products
        class ProductCollection {
            constructor(name) {
                this.name = name;
                this.products = [];
            }

            addProducts(productsData) {
                this.products = productsData.map(data => new Product(data));
            }

            render(containerId) {
                const container = document.getElementById(containerId);
                if (!container) return;

                if (this.products.length === 0) {
                    container.innerHTML = '<div class="error-message">No products available</div>';
                    return;
                }

                container.innerHTML = this.products.map(product => product.renderHTML()).join('');
                this.attachEventListeners(container);
            }

            attachEventListeners(container) {
                // Wishlist functionality
                container.querySelectorAll('.wishlist-icon').forEach(icon => {
                    icon.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const productName = icon.getAttribute('data-name');
                        showNotification(`${productName} added to wishlist!`);
                    });
                });

                // Cart functionality
                container.querySelectorAll('.cart-icon').forEach(icon => {
                    icon.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const productName = icon.getAttribute('data-name');
                        showNotification(`${productName} added to cart!`);
                    });
                });
            }

            filterByCategory(category) {
                if (category === 'all') return this.products;
                return this.products.filter(p => p.category === category);
            }

            search(query) {
                const lowerQuery = query.toLowerCase();
                return this.products.filter(p => 
                    p.name.toLowerCase().includes(lowerQuery) ||
                    p.category.toLowerCase().includes(lowerQuery)
                );
            }
        }

        // Newsletter Class
        class Newsletter {
            constructor() {
                this.subscribers = [];
            }

            subscribe(email) {
                if (!this.isValidEmail(email)) {
                    throw new Error('Please enter a valid email address');
                }

                if (this.subscribers.includes(email)) {
                    throw new Error('This email is already subscribed');
                }

                this.subscribers.push(email);
                return true;
            }

            isValidEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }
        }

        // DataFetcher Class - Handles JSON data fetching
        class DataFetcher {
            static async fetchProducts(url) {
                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    return data;
                } catch (error) {
                    console.error('Error fetching products:', error);
                    throw error;
                }
            }
        }

        // ========== INITIALIZE APPLICATION ==========
        
        // Global instances
        const newsletter = new Newsletter();

        // Collections
        let newArrivalsCollection;
        let mostGiftedCollection;
        let recommendedCollection;
        let allProducts = [];

        // Fetch and render products
        async function initializeProducts() {
            try {
                // IMPORTANT: Replace 'products.json' with the actual path to your JSON file
                const data = await DataFetcher.fetchProducts('./collections.json');
                
                // Create collections
                newArrivalsCollection = new ProductCollection('New Arrivals');
                mostGiftedCollection = new ProductCollection('Most Gifted');
                recommendedCollection = new ProductCollection('Recommended for You');

                // Add products to collections
                newArrivalsCollection.addProducts(data.collections.newArrivals);
                mostGiftedCollection.addProducts(data.collections.mostGifted);
                recommendedCollection.addProducts(data.collections.recommended);

                // Store all products for search
                allProducts = [
                    ...newArrivalsCollection.products,
                    ...mostGiftedCollection.products,
                    ...recommendedCollection.products
                ];

                // Render products
                newArrivalsCollection.render('newArrivalsGrid');
                mostGiftedCollection.render('mostGiftedGrid');
                recommendedCollection.render('recommendedGrid');

                console.log('Products loaded successfully!');
                console.log('Total products:', allProducts.length);

            } catch (error) {
                console.error('Failed to load products:', error);
                showError('Failed to load products. Please check if products.json file exists.');
            }
        }

        // Show error message
        function showError(message) {
            const grids = ['newArrivalsGrid', 'mostGiftedGrid', 'recommendedGrid'];
            grids.forEach(gridId => {
                const container = document.getElementById(gridId);
                if (container) {
                    container.innerHTML = `<div class="error-message">${message}</div>`;
                }
            });
        }

        // Filter functionality
        function setupFilters() {
            const filterButtons = document.querySelectorAll('.filter-btn');
            
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Update active button
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');

                    const category = button.getAttribute('data-filter');
                    
                    // Filter all sections
                    filterProducts(category);
                });
            });
        }

        function filterProducts(category) {
            const allCards = document.querySelectorAll('.product-card');
            
            allCards.forEach(card => {
                const productCategory = card.getAttribute('data-category');
                
                if (category === 'all' || productCategory === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        // Search functionality
        function setupSearch() {
            const searchInput = document.getElementById('searchInput');
            
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                
                if (query.length === 0) {
                    // Show all products
                    document.querySelectorAll('.product-card').forEach(card => {
                        card.style.display = 'block';
                    });
                    return;
                }

                if (query.length < 2) return;

                // Search through all products
                const results = allProducts.filter(product => 
                    product.name.toLowerCase().includes(query.toLowerCase()) ||
                    product.category.toLowerCase().includes(query.toLowerCase())
                );

                // Hide all products first
                document.querySelectorAll('.product-card').forEach(card => {
                    card.style.display = 'none';
                });

                // Show matching products
                results.forEach(product => {
                    const card = document.querySelector(`.product-card[data-id="${product.id}"]`);
                    if (card) {
                        card.style.display = 'block';
                    }
                });

                console.log(`Search results for "${query}":`, results.length, 'products found');
            });
        }

        // Newsletter form
        function setupNewsletter() {
            const newsletterForm = document.getElementById('newsletterForm');
            const newsletterMessage = document.getElementById('newsletterMessage');

            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = document.getElementById('newsletterEmail');
                
                try {
                    newsletter.subscribe(emailInput.value);
                    newsletterMessage.textContent = '✓ Successfully subscribed!';
                    newsletterMessage.style.color = '#D4AF37';
                    emailInput.value = '';
                } catch (error) {
                    newsletterMessage.textContent = '✗ ' + error.message;
                    newsletterMessage.style.color = '#ff6666';
                }

                setTimeout(() => {
                    newsletterMessage.textContent = '';
                }, 3000);
            });
        }

        // Show notification function
        function showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification {
                position: fixed;
                top: 80px;
                right: 20px;
                background: #D4AF37;
                color: #000;
                padding: 15px 25px;
                border-radius: 10px;
                font-weight: 600;
                z-index: 10001;
                animation: slideIn 0.3s ease;
            }
        `;
        document.head.appendChild(style);

        // Initialize everything when DOM is ready
        document.addEventListener('DOMContentLoaded', async () => {
            console.log('Initializing Aurelia Collections...');
            
            // Load products from JSON
            await initializeProducts();
            
            // Setup functionality
            setupFilters();
            setupSearch();
            setupNewsletter();
            
            console.log('Application ready!');
        });

        // Export for debugging (optional)
        window.AureliaApp = {
            newsletter,
            newArrivalsCollection,
            mostGiftedCollection,
            recommendedCollection,
            allProducts
        };