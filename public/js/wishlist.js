// ========== NOTIFICATION FUNCTION (FIRST THING) ==========
        function showNotification(message) {
            console.log('Notification triggered:', message); // Debug log
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }

        // Modal function (ONLY for confirmations with buttons)
        function showCustomModal(title, message, icon, buttonsConfig) {
            const modal = document.getElementById('appModal');
            const buttonsContainer = document.getElementById('modalButtons');

            document.getElementById('modalTitle').textContent = title;
            document.getElementById('modalMessage').textContent = message;
            document.getElementById('modalIcon').textContent = icon;
            buttonsContainer.innerHTML = '';

            buttonsConfig.forEach(config => {
                const btn = document.createElement('button');
                btn.className = config.className || 'modal-btn modal-btn-ok';
                btn.textContent = config.text;
                btn.onclick = () => {
                    modal.style.display = 'none';
                    if (config.callback) {
                        config.callback();
                    }
                };
                buttonsContainer.appendChild(btn);
            });

            modal.style.display = 'block';
        }

        // Redirect to homepage
        function redirectToHomepage() {
            const modal = document.getElementById('appModal');
            const buttonsContainer = document.getElementById('modalButtons');

            document.getElementById('modalTitle').textContent = 'Redirecting...';
            document.getElementById('modalMessage').textContent = 'Taking you to our main shop page in 3 seconds...';
            document.getElementById('modalIcon').textContent = '🛍️';
            buttonsContainer.innerHTML = '';

            modal.style.display = 'block';

            setTimeout(() => {
                window.location.href = 'homepage.html';
            }, 3000);
        }

        // Close modal on outside click
        window.onclick = function (event) {
            if (event.target == document.getElementById('appModal')) {
                document.getElementById('appModal').style.display = 'none';
            }
        }

        // ========== WISHLIST ITEM CLASS ==========
        class WishlistItem {
            constructor(data) {
                this.id = data.id;
                this.name = data.name;
                this.description = data.description;
                this.price = data.price;
                this.image = data.image;
                this.category = data.category;
                this.inStock = data.inStock;
                this.addedDate = data.addedDate;
            }

            getFormattedPrice() {
                return `₹${this.price.toLocaleString('en-IN')}`;
            }

            getStockBadge() {
                if (this.inStock) {
                    return '<span class="stock-badge">In Stock</span>';
                } else {
                    return '<span class="stock-badge out-of-stock">Out of Stock</span>';
                }
            }

            renderHTML() {
                const cartButtonHTML = this.inStock
                    ? `<button class="add-to-cart-btn" data-id="${this.id}">Add to Cart</button>`
                    : `<button class="add-to-cart-btn" disabled>Out of Stock</button>`;

                return `
            <div class="wishlist-item" data-id="${this.id}">
                <div class="item-image" style="background-image: url('${this.image}');">
                    <button class="remove-btn" data-id="${this.id}">×</button>
                    ${this.getStockBadge()}
                </div>
                <div class="item-details">
                    <div class="item-name">${this.name}</div>
                    <p class="item-description">${this.description}</p>
                    <div class="item-price">${this.getFormattedPrice()}</div>
                    <div class="item-actions">
                        ${cartButtonHTML}
                        <button class="view-details-btn" data-id="${this.id}">View</button>
                    </div>
                </div>
            </div>
        `;
            }
        }

        // ========== WISHLIST CLASS ==========
        class Wishlist {
            constructor() {
                this.items = [];
            }

            addItems(itemsData) {
                this.items = itemsData.map(data => new WishlistItem(data));
            }

            getItemCount() {
                return this.items.length;
            }

            getInStockItems() {
                return this.items.filter(item => item.inStock);
            }

            getTotalValue() {
                return this.items.reduce((total, item) => total + item.price, 0);
            }

            getFormattedTotalValue() {
                return `₹${this.getTotalValue().toLocaleString('en-IN')}`;
            }

            getTotalInStockValue() {
                return this.getInStockItems().reduce((total, item) => total + item.price, 0);
            }

            getFormattedTotalInStockValue() {
                return `₹${this.getTotalInStockValue().toLocaleString('en-IN')}`;
            }

            removeItem(itemId) {
                const index = this.items.findIndex(item => item.id === itemId);
                if (index > -1) {
                    const removedItem = this.items.splice(index, 1)[0];
                    return removedItem;
                }
                return null;
            }

            clearAll() {
                this.items = [];
            }

            render(containerId) {
                const container = document.getElementById(containerId);
                if (!container) return;

                if (this.items.length === 0) {
                    container.innerHTML = this.renderEmptyState();
                    return;
                }

                const gridHTML = `
            <div class="wishlist-grid">
                ${this.items.map(item => item.renderHTML()).join('')}
            </div>
            <div class="wishlist-actions">
                <button class="action-button" id="addAllToCartBtn">Add All to Cart</button>
                <button class="action-button" id="clearWishlistBtn">Clear Wishlist</button>
            </div>
        `;
                container.innerHTML = gridHTML;

                this.attachEventListeners();
            }

            renderEmptyState() {
                return `
            <div class="empty-wishlist">
                <div class="empty-icon">💎</div>
                <div class="empty-text">Your Wishlist is Empty</div>
                <p class="empty-subtext">Start adding your favorite jewelry pieces to your wishlist</p>
                <button class="shop-button" onclick="redirectToHomepage()">Continue Shopping</button>
            </div>
        `;
            }

            attachEventListeners() {
                // Remove item - CONFIRMATION MODAL, then NOTIFICATION
                document.querySelectorAll('.remove-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const itemId = parseInt(e.target.closest('.remove-btn').dataset.id);
                        const item = this.items.find(i => i.id === itemId);

                        if (item) {
                            showCustomModal(
                                'Confirm Removal',
                                `Do you want to remove "${item.name}" from your wishlist?`,
                                '🤔',
                                [
                                    {
                                        text: 'Cancel',
                                        className: 'modal-btn modal-btn-cancel'
                                    },
                                    {
                                        text: 'Remove',
                                        className: 'modal-btn modal-btn-ok',
                                        callback: () => {
                                            this.removeItem(itemId);
                                            showNotification(`${item.name} removed from wishlist!`);
                                            this.updateUI();
                                        }
                                    }
                                ]
                            );
                        }
                    });
                });

                // Add to cart - NOTIFICATION ONLY
                document.querySelectorAll('.add-to-cart-btn:not(:disabled)').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const itemId = parseInt(e.target.dataset.id);
                        const item = this.items.find(i => i.id === itemId);
                        if (item) {
                            console.log('Add to cart clicked for:', item.name); // Debug
                            showNotification(`${item.name} added to cart!`);
                        }
                    });
                });

                // View details - MODAL (to show info)
                document.querySelectorAll('.view-details-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const itemId = parseInt(e.target.dataset.id);
                        const item = this.items.find(i => i.id === itemId);
                        if (item) {
                            const detailsMessage =
                                `Price: ${item.getFormattedPrice()}\n` +
                                `Category: ${item.category}\n` +
                                `In Stock: ${item.inStock ? 'Yes' : 'No'}\n`;
                            
                            showCustomModal(
                                `Details: ${item.name}`,
                                detailsMessage,
                                '✨',
                                [{
                                    text: 'OK',
                                    className: 'modal-btn modal-btn-ok'
                                }]
                            );
                        }
                    });
                });

                // Add all to cart - NOTIFICATION ONLY
                const addAllBtn = document.getElementById('addAllToCartBtn');
                if (addAllBtn) {
                    addAllBtn.addEventListener('click', () => {
                        const inStockCount = this.getInStockItems().length;
                        if (inStockCount > 0) {
                            console.log('Add all to cart clicked'); // Debug
                            showNotification(`${inStockCount} items added to cart! Total: ${this.getFormattedTotalInStockValue()}`);
                        } else {
                            showNotification('No items currently in stock');
                        }
                    });
                }

                // Clear wishlist - CONFIRMATION MODAL, then NOTIFICATION
                const clearBtn = document.getElementById('clearWishlistBtn');
                if (clearBtn) {
                    clearBtn.addEventListener('click', () => {
                        showCustomModal(
                            'Confirm Clear Wishlist',
                            'Are you sure you want to clear your entire wishlist?',
                            '⚠️',
                            [
                                {
                                    text: 'Cancel',
                                    className: 'modal-btn modal-btn-cancel'
                                },
                                {
                                    text: 'Clear All',
                                    className: 'modal-btn modal-btn-ok',
                                    callback: () => {
                                        this.clearAll();
                                        this.updateUI();
                                        showNotification('Your wishlist has been cleared!');
                                    }
                                }
                            ]
                        );
                    });
                }
            }

            updateUI() {
                this.render('wishlistContent');
                this.updateCount();
            }

            updateCount() {
                const countEl = document.getElementById('wishlistCount');
                if (countEl) {
                    const count = this.getItemCount();
                    const total = this.getFormattedTotalValue();
                    countEl.textContent = `${count} items • Total: ${total}`;
                }
            }
        }

        // ========== INITIALIZATION ==========
        const userWishlist = new Wishlist();

        async function fetchWishlistData() {
            try {
                const response = await fetch('/api/wishlist');

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                return data.products || [];
            } catch (error) {
                console.error("Error fetching wishlist data:", error);

                const container = document.getElementById('wishlistContent');
                container.innerHTML = `<div class="error-message">
            <p>⚠️ Error loading your wishlist data.</p>
            <p>Please refresh the page or try again later.</p>
        </div>`;

                return [];
            }
        }

        async function initWishlist() {
            const wishlistItems = await fetchWishlistData();

            // Convert API response to match expected format
            const formattedItems = wishlistItems.map(product => ({
                id: product._id,
                name: product.name,
                description: product.description || '',
                price: product.price,
                image: product.image || (product.images && product.images[0] && (product.images[0].url || product.images[0])) || '',
                category: product.category || '',
                inStock: product.stockQuantity > 0,
                addedDate: product.createdAt || new Date().toISOString()
            }));

            userWishlist.addItems(formattedItems);
            userWishlist.render('wishlistContent');
            userWishlist.updateCount();

            // Newsletter
            const form = document.getElementById('newsletterForm');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    document.getElementById('newsletterMessage').textContent = 'Thank you for subscribing!';
                    document.getElementById('newsletterEmail').value = '';
                    setTimeout(() => {
                        document.getElementById('newsletterMessage').textContent = '';
                    }, 3000);
                });
            }
        }

        document.addEventListener('DOMContentLoaded', initWishlist);