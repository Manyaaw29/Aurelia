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
        if (!this.cartBadge && cartIcon) {
            this.cartBadge = document.createElement('span');
            this.cartBadge.style.cssText = 'position: absolute; top: -8px; right: -8px; background: #D4AF37; color: #000; border-radius: 50%; width: 20px; height: 20px; font-size: 11px; display: flex; align-items: center; justify-content: center; font-weight: 700;';
            cartIcon.style.position = 'relative';
            cartIcon.appendChild(this.cartBadge);
        }
        
        if (this.cartBadge) {
            const totalItems = this.getTotalItems();
            this.cartBadge.textContent = totalItems;
            this.cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
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
}

// Initialize cart
const cart = new ShoppingCart();

// Get product ID from window object
const productId = window.productData ? window.productData.id : null;

// Helper function to get cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Review Modal Function
function showReviewModal() {
    // Remove any existing modal first
    const existingModal = document.getElementById('reviewModalOverlay');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'reviewModalOverlay';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); display: flex; justify-content: center; align-items: center; z-index: 10003; animation: fadeIn 0.3s ease;';
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = 'background: linear-gradient(135deg, #1A3D2E, #0D2818); padding: 40px; border-radius: 20px; box-shadow: 0 10px 40px rgba(212, 175, 55, 0.3); border: 2px solid #D4AF37; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto; animation: scaleIn 0.3s ease;';
    
    modalContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
            <h2 style="color: #D4AF37; font-family: 'Playfair Display', serif; font-size: 1.8rem; margin: 0;">Write a Review</h2>
            <button id="closeReviewModal" style="background: none; border: none; color: #fff; font-size: 28px; cursor: pointer; transition: transform 0.3s ease; line-height: 1;">&times;</button>
        </div>
        
        <form id="reviewForm" style="color: #fff;">
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #D4AF37;">Rating *</label>
                <div id="starRating" style="display: flex; gap: 5px;">
                    <span class="star" data-rating="1" style="font-size: 30px; color: #ccc; cursor: pointer; transition: color 0.3s ease;">★</span>
                    <span class="star" data-rating="2" style="font-size: 30px; color: #ccc; cursor: pointer; transition: color 0.3s ease;">★</span>
                    <span class="star" data-rating="3" style="font-size: 30px; color: #ccc; cursor: pointer; transition: color 0.3s ease;">★</span>
                    <span class="star" data-rating="4" style="font-size: 30px; color: #ccc; cursor: pointer; transition: color 0.3s ease;">★</span>
                    <span class="star" data-rating="5" style="font-size: 30px; color: #ccc; cursor: pointer; transition: color 0.3s ease;">★</span>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label for="reviewTitle" style="display: block; margin-bottom: 8px; font-weight: 600; color: #D4AF37;">Review Title (Optional)</label>
                <input type="text" id="reviewTitle" maxlength="200" style="width: 100%; padding: 12px; border: 2px solid rgba(212, 175, 55, 0.3); border-radius: 10px; background: rgba(255, 255, 255, 0.1); color: #fff; font-size: 1rem; transition: all 0.3s ease;" placeholder="Summarize your experience">
            </div>
            
            <div style="margin-bottom: 30px;">
                <label for="reviewText" style="display: block; margin-bottom: 8px; font-weight: 600; color: #D4AF37;">Your Review *</label>
                <textarea id="reviewText" required maxlength="1000" style="width: 100%; padding: 12px; border: 2px solid rgba(212, 175, 55, 0.3); border-radius: 10px; background: rgba(255, 255, 255, 0.1); color: #fff; font-size: 1rem; min-height: 120px; resize: vertical; transition: all 0.3s ease;" placeholder="Share your experience with this product..."></textarea>
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
    
    // Star rating functionality
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
    
    // Form submission
    const form = modalContent.querySelector('#reviewForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const titleInput = modalContent.querySelector('#reviewTitle');
        const reviewInput = modalContent.querySelector('#reviewText');
        const title = titleInput.value.trim();
        const reviewText = reviewInput.value.trim();
        
        // Clear previous errors
        const existingErrors = modalContent.querySelectorAll('.error-message');
        existingErrors.forEach(err => err.remove());
        
        reviewInput.style.borderColor = 'rgba(212, 175, 55, 0.3)';
        
        let hasError = false;
        
        // Validate rating
        if (selectedRating === 0) {
            const starRating = modalContent.querySelector('#starRating');
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.style.cssText = 'color: #ff4444; font-size: 0.9rem; margin-top: 5px; font-weight: 600;';
            errorMsg.textContent = 'Please select a rating';
            starRating.parentElement.appendChild(errorMsg);
            hasError = true;
        }
        
        // Validate review text
        if (!reviewText) {
            reviewInput.style.borderColor = '#ff4444';
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.style.cssText = 'color: #ff4444; font-size: 0.9rem; margin-top: 5px; font-weight: 600;';
            errorMsg.textContent = 'Please write your review';
            reviewInput.parentElement.appendChild(errorMsg);
            hasError = true;
        }
        
        if (hasError) return;
        
        // Check authentication
        const token = localStorage.getItem('authToken') || getCookie('token');
        if (!token) {
            cart.showNotification('Please login to submit a review');
            closeModal();
            setTimeout(() => window.location.href = '/signin', 1500);
            return;
        }
        
        // Disable submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        
        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    product: productId,
                    rating: selectedRating,
                    title: title || 'Product Review',
                    comment: reviewText
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                cart.showNotification('Thank you! Your review has been submitted successfully! ⭐');
                closeModal();
                // Reload page to show new review
                setTimeout(() => window.location.reload(), 1500);
            } else {
                throw new Error(data.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            cart.showNotification('Error submitting review: ' + error.message);
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
    
    // Focus on textarea
    setTimeout(() => {
        modalContent.querySelector('#reviewText').focus();
    }, 300);
}

// API Integration Functions
async function addToCart() {
    if (!productId) {
        cart.showNotification('Product information not available');
        return;
    }
    
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
    if (!productId) {
        cart.showNotification('Product information not available');
        return;
    }
    
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
    if (!productId) {
        cart.showNotification('Product information not available');
        return;
    }
    window.location.href = '/checkout?productId=' + productId;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Product page loaded, productId:', productId);
    
    // Add event listener to the review button
    const writeReviewBtn = document.getElementById('writeReviewBtn');
    if (writeReviewBtn) {
        console.log('Review button found, attaching event listener');
        writeReviewBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Review button clicked');
            showReviewModal();
        });
    } else {
        console.warn('Review button not found on page');
    }
    
    // Remove the old unused modal from DOM if it exists
    const oldModal = document.getElementById('reviewModal');
    if (oldModal) {
        oldModal.remove();
    }
});

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
    
    /* Input focus effects */
    #reviewText:focus,
    #reviewTitle:focus {
        outline: none;
        border-color: #D4AF37 !important;
        box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
    }
`;
document.head.appendChild(style);