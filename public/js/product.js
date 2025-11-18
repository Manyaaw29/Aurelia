// Product Class - Represents a jewelry product
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
}

// CartItem Class - Represents an item in the cart
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
}

// ShoppingCart Class - Manages the shopping cart
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
        
        this.updateCartBadge();
        this.showNotification(`${product.name} added to cart!`);
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

    updateCartBadge() {
        const cartIcon = document.querySelector('a[href="/cart"]');
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

    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = 'position: fixed; top: 100px; right: 20px; background: #D4AF37; color: #000; padding: 15px 25px; border-radius: 10px; font-weight: 600; z-index: 10001; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);';
        document.body.appendChild(notification);

        notification.style.animation = 'slideInRight 0.3s ease';
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    showBuyNowModal(product) {
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); display: flex; justify-content: center; align-items: center; z-index: 10002; animation: fadeIn 0.2s ease;';
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = 'background: linear-gradient(135deg, #1A3D2E, #0D2818); padding: 40px; border-radius: 20px; text-align: center; box-shadow: 0 10px 40px rgba(212, 175, 55, 0.3); border: 2px solid #D4AF37; max-width: 450px; animation: scaleIn 0.3s ease;';
        
        modalContent.innerHTML = `
            <div class="jewel-icon">
                <img src="https://i.pinimg.com/originals/2e/8b/30/2e8b30e34db9d62f6b4f936f38ab7723.gif" alt="Gem Stone" style="width: 80px; height: 80px; mix-blend-mode: screen; border-radius: 50%;">
            </div>
            <h2 style="color: #D4AF37; font-family: 'Playfair Display', serif; font-size: 1.8rem; margin-bottom: 20px;">Proceeding to Checkout</h2>
            <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 15px; margin-bottom: 20px; border: 1px solid rgba(212, 175, 55, 0.3);">
                <p style="color: #fff; font-size: 1.1rem; margin-bottom: 8px; font-weight: 600;">${product.name}</p>
                <p style="color: #D4AF37; font-size: 1.4rem; font-weight: 700;">${product.getFormattedPrice()}</p>
            </div>
            <div style="margin-top: 20px; color: #ccc; font-size: 0.9rem;">
                <div style="display: inline-block; animation: spin 1s linear infinite;">⏳</div>
                Redirecting...
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        return modal;
    }
}

// Initialize cart with current product data from window
const currentProduct = window.productData ? new Product(
    window.productData.id,
    window.productData.name,
    window.productData.price,
    window.productData.images[0],
    window.productData.category
) : null;

const cart = new ShoppingCart();

// API Integration Functions
const productId = window.productData ? window.productData.id : null;

async function addToCart() {
    if (!productId) return;
    
    const btn = document.getElementById('addToCartBtn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
    }
    
    try {
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, quantity: 1 })
        });
        
        const data = await response.json();
        if (data.success) {
            if (btn) {
                btn.innerHTML = '<i class="fas fa-check"></i> Added!';
            }
            cart.showNotification('Product added to cart successfully!');
            setTimeout(() => {
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = 'Add to Cart';
                }
            }, 2000);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        if (btn) {
            btn.innerHTML = 'Add to Cart';
            btn.disabled = false;
        }
        cart.showNotification('Error adding to cart: ' + error.message);
    }
}

async function addToWishlist() {
    if (!productId) return;
    
    const btn = document.getElementById('addToWishlistBtn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
    }
    
    try {
        const response = await fetch('/api/wishlist/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId })
        });
        
        const data = await response.json();
        if (data.success) {
            if (btn) {
                btn.innerHTML = '<i class="fas fa-heart"></i> Added!';
            }
            cart.showNotification('Product added to wishlist!');
            setTimeout(() => {
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fas fa-heart"></i> Wishlist';
                }
            }, 2000);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        if (btn) {
            btn.innerHTML = '<i class="fas fa-heart"></i> Wishlist';
            btn.disabled = false;
        }
        cart.showNotification('Error adding to wishlist: ' + error.message);
    }
}

function buyNow() {
    addToCart().then(() => {
        setTimeout(() => window.location.href = '/cart', 1000);
    });
}

// Add functionality to buttons
document.addEventListener('DOMContentLoaded', function() {
    if (!currentProduct) return;

    const buyNowBtn = document.querySelector('.btn-primary');
    const addToCartBtn = document.querySelector('.btn-secondary');

    // Review button functionality
    const writeReviewBtn = document.getElementById('writeReviewBtn');
    if (writeReviewBtn) {
        writeReviewBtn.addEventListener('click', showReviewModal);
    }
});

// Review Modal Function
function showReviewModal() {
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); display: flex; justify-content: center; align-items: center; z-index: 10003; animation: fadeIn 0.3s ease;';
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = 'background: linear-gradient(135deg, #1A3D2E, #0D2818); padding: 40px; border-radius: 20px; box-shadow: 0 10px 40px rgba(212, 175, 55, 0.3); border: 2px solid #D4AF37; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto; animation: scaleIn 0.3s ease;';
    
    modalContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
            <h2 style="color: #D4AF37; font-family: 'Playfair Display', serif; font-size: 1.8rem; margin: 0;">Write a Review</h2>
            <button id="closeReviewModal" style="background: none; border: none; color: #fff; font-size: 24px; cursor: pointer; transition: transform 0.3s ease;">&times;</button>
        </div>
        
        <form id="reviewForm" style="color: #fff;">
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #D4AF37;">Your Name</label>
                <input type="text" id="reviewerName" required style="width: 100%; padding: 12px; border: 2px solid rgba(212, 175, 55, 0.3); border-radius: 10px; background: rgba(255, 255, 255, 0.1); color: #fff; font-size: 1rem; transition: all 0.3s ease;" placeholder="Enter your name">
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #D4AF37;">Rating</label>
                <div id="starRating" style="display: flex; gap: 5px;">
                    <span class="star" data-rating="1" style="font-size: 24px; color: #ccc; cursor: pointer; transition: color 0.3s ease;">★</span>
                    <span class="star" data-rating="2" style="font-size: 24px; color: #ccc; cursor: pointer; transition: color 0.3s ease;">★</span>
                    <span class="star" data-rating="3" style="font-size: 24px; color: #ccc; cursor: pointer; transition: color 0.3s ease;">★</span>
                    <span class="star" data-rating="4" style="font-size: 24px; color: #ccc; cursor: pointer; transition: color 0.3s ease;">★</span>
                    <span class="star" data-rating="5" style="font-size: 24px; color: #ccc; cursor: pointer; transition: color 0.3s ease;">★</span>
                </div>
            </div>
            
            <div style="margin-bottom: 30px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #D4AF37;">Your Review</label>
                <textarea id="reviewText" required style="width: 100%; padding: 12px; border: 2px solid rgba(212, 175, 55, 0.3); border-radius: 10px; background: rgba(255, 255, 255, 0.1); color: #fff; font-size: 1rem; min-height: 120px; resize: vertical; transition: all 0.3s ease;" placeholder="Share your experience with this product..."></textarea>
            </div>
            
            <div style="display: flex; gap: 15px; justify-content: flex-end;">
                <button type="button" id="cancelReview" style="padding: 12px 24px; background: rgba(255, 255, 255, 0.1); color: #fff; border: 2px solid rgba(212, 175, 55, 0.3); border-radius: 25px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">Cancel</button>
                <button type="submit" style="padding: 12px 24px; background: linear-gradient(135deg, #D4AF37, #F4D03F); color: #000; border: none; border-radius: 25px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);">Submit Review</button>
            </div>
        </form>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    const closeBtn = modalContent.querySelector('#closeReviewModal');
    const cancelBtn = modalContent.querySelector('#cancelReview');
    
    const closeModal = () => {
        modal.style.animation = 'fadeOut 0.3s ease';
        modalContent.style.animation = 'scaleOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    };
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    let selectedRating = 0;
    const stars = modalContent.querySelectorAll('.star');
    
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            selectedRating = index + 1;
            stars.forEach((s, i) => {
                s.style.color = i < selectedRating ? '#D4AF37' : '#ccc';
            });
        });
        
        star.addEventListener('mouseenter', () => {
            stars.forEach((s, i) => {
                s.style.color = i <= index ? '#D4AF37' : '#ccc';
            });
        });
        
        star.addEventListener('mouseleave', () => {
            stars.forEach((s, i) => {
                s.style.color = i < selectedRating ? '#D4AF37' : '#ccc';
            });
        });
    });
    
    const form = modalContent.querySelector('#reviewForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameInput = modalContent.querySelector('#reviewerName');
        const reviewInput = modalContent.querySelector('#reviewText');
        const name = nameInput.value.trim();
        const review = reviewInput.value.trim();
        
        const existingErrors = modalContent.querySelectorAll('.error-message');
        existingErrors.forEach(err => err.remove());
        
        nameInput.style.borderColor = 'rgba(212, 175, 55, 0.3)';
        reviewInput.style.borderColor = 'rgba(212, 175, 55, 0.3)';
        
        let hasError = false;
        
        if (!name) {
            nameInput.style.borderColor = '#ff4444';
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.style.cssText = 'color: #ff4444; font-size: 0.9rem; margin-top: 5px; font-weight: 600;';
            errorMsg.textContent = 'Please enter your name';
            nameInput.parentElement.appendChild(errorMsg);
            hasError = true;
        }
        
        if (selectedRating === 0) {
            const starRating = modalContent.querySelector('#starRating');
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.style.cssText = 'color: #ff4444; font-size: 0.9rem; margin-top: 5px; font-weight: 600;';
            errorMsg.textContent = 'Please select a rating';
            starRating.parentElement.appendChild(errorMsg);
            hasError = true;
        }
        
        if (!review) {
            reviewInput.style.borderColor = '#ff4444';
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.style.cssText = 'color: #ff4444; font-size: 0.9rem; margin-top: 5px; font-weight: 600;';
            errorMsg.textContent = 'Please write your review';
            reviewInput.parentElement.appendChild(errorMsg);
            hasError = true;
        }
        
        if (hasError) return;
        
        const reviewsSection = document.querySelector('.customer-reviews');
        const newReview = document.createElement('div');
        newReview.className = 'review-item';
        newReview.style.animation = 'slideInRight 0.5s ease';
        
        const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        const starsText = '★'.repeat(selectedRating) + '☆'.repeat(5 - selectedRating);
        
        newReview.innerHTML = `
            <div class="review-stars">${starsText}</div>
            <div class="review-name">${name} - ${currentDate}</div>
            <div class="review-text">${review}</div>
        `;
        
        const reviewTitle = reviewsSection.querySelector('h2').parentElement;
        reviewTitle.insertAdjacentElement('afterend', newReview);
        
        const reviewCount = reviewsSection.querySelector('h2');
        const match = reviewCount.textContent.match(/[0-9]+/);
        if (match) {
            const currentCount = parseInt(match[0]);
            reviewCount.textContent = `Customer Reviews (${currentCount + 1})`;
        }
        
        cart.showNotification('Thank you! Your review has been added successfully! ⭐');
        closeModal();
    });
    
    setTimeout(() => {
        modalContent.querySelector('#reviewerName').focus();
    }, 300);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes scaleIn {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    @keyframes scaleOut {
        from { transform: scale(1); opacity: 1; }
        to { transform: scale(0.8); opacity: 0; }
    }
`;
document.head.appendChild(style);
