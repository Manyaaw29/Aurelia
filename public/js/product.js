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
        if (cartIcon && !this.cartBadge) {
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

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `position: fixed; top: 100px; right: 20px; background: ${type === 'success' ? '#D4AF37' : '#ff4444'}; color: ${type === 'success' ? '#000' : '#fff'}; padding: 15px 25px; border-radius: 10px; font-weight: 600; z-index: 10001; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);`;
        document.body.appendChild(notification);

        notification.style.animation = 'slideInRight 0.3s ease';
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Get product ID - try multiple methods
// Use var to avoid conflicts with inline scripts, or use window.productId
function getProductId() {
    // Method 1: From window.productData
    if (window.productData && window.productData.id) {
        return window.productData.id;
    }
    
    // Method 2: From script tag with product data
    const productDataScript = document.querySelector('script:not([src])');
    if (productDataScript) {
        const match = productDataScript.textContent.match(/id:\s*['"]([^'"]+)['"]/);
        if (match) return match[1];
    }
    
    // Method 3: From URL
    const urlMatch = window.location.pathname.match(/\/product\/([a-f0-9]{24})/i);
    if (urlMatch) return urlMatch[1];
    
    return null;
}

// Helper function to get cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Helper function to get auth token
function getAuthToken() {
    const localToken = localStorage.getItem('authToken');
    const cookieToken = getCookie('token');
    const token = localToken || cookieToken;
    
    console.log('🔑 Auth token found:', token ? 'Yes' : 'No');
    return token;
}

// ============ REVIEW MODAL FUNCTIONS ============

// Create New Review Modal
function showReviewModal() {
    console.log('🎯 showReviewModal called');
    
    // Get product ID
    const currentProductId = window.reviewProductId || getProductId();
    console.log('📦 Product ID:', currentProductId);
    
    if (!currentProductId) {
        cart.showNotification('Error: Product ID not found', 'error');
        console.error('❌ Product ID is missing!');
        return;
    }
    
    // Check authentication first
    const token = getAuthToken();
    if (!token) {
        console.log('❌ No auth token found');
        cart.showNotification('Please login to write a review', 'error');
        setTimeout(() => {
            window.location.href = '/signin';
        }, 2000);
        return;
    }
    
    console.log('✅ Auth token verified, creating modal...');
    
    // Remove any existing modal first
    const existingModal = document.getElementById('reviewModalOverlay');
    if (existingModal) {
        existingModal.remove();
        console.log('🗑️ Removed existing modal');
    }
    
    const modal = document.createElement('div');
    modal.id = 'reviewModalOverlay';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.85); display: flex; justify-content: center; align-items: center; z-index: 10003; animation: fadeIn 0.3s ease;';
    
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
    
    console.log('✅ Modal created and added to DOM');
    
    setupReviewModal(modal, modalContent, currentProductId);
}

// Setup review modal functionality
function setupReviewModal(modal, modalContent, productId) {
    console.log('⚙️ Setting up review modal functionality');
    
    const closeBtn = modalContent.querySelector('#closeReviewModal');
    const cancelBtn = modalContent.querySelector('#cancelReview');
    
    const closeModal = () => {
        console.log('🚪 Closing modal');
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
    
    console.log('⭐ Star elements found:', stars.length);
    
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            selectedRating = index + 1;
            console.log('⭐ Rating selected:', selectedRating);
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
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('📝 Form submitted');
        
        const titleInput = modalContent.querySelector('#reviewTitle');
        const reviewInput = modalContent.querySelector('#reviewText');
        const title = titleInput.value.trim();
        const reviewText = reviewInput.value.trim();
        
        console.log('Form data:', { title, reviewText, rating: selectedRating, productId });
        
        // Clear previous errors
        const existingErrors = modalContent.querySelectorAll('.error-message');
        existingErrors.forEach(err => err.remove());
        
        reviewInput.style.borderColor = 'rgba(212, 175, 55, 0.3)';
        
        let hasError = false;
        
        // Validate rating
        if (selectedRating === 0) {
            console.log('❌ Validation error: No rating selected');
            const starRating = modalContent.querySelector('#starRating');
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.style.cssText = 'color: #ff4444; font-size: 0.9rem; margin-top: 5px; font-weight: 600;';
            errorMsg.textContent = '⚠️ Please select a rating';
            starRating.parentElement.appendChild(errorMsg);
            hasError = true;
        }
        
        // Validate review text
        if (!reviewText) {
            console.log('❌ Validation error: No review text');
            reviewInput.style.borderColor = '#ff4444';
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.style.cssText = 'color: #ff4444; font-size: 0.9rem; margin-top: 5px; font-weight: 600;';
            errorMsg.textContent = '⚠️ Please write your review';
            reviewInput.parentElement.appendChild(errorMsg);
            hasError = true;
        }
        
        if (hasError) {
            console.log('❌ Form has validation errors, stopping submission');
            return;
        }
        
        // Get auth token
        const token = getAuthToken();
        if (!token) {
            console.log('❌ No auth token found during submission');
            cart.showNotification('Please login to submit a review', 'error');
            closeModal();
            setTimeout(() => window.location.href = '/signin', 1500);
            return;
        }
        
        console.log('✅ Validation passed, submitting to API...');
        
        // Disable submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        
        try {
            const requestBody = {
                product: productId,
                rating: selectedRating,
                title: title || 'Product Review',
                comment: reviewText
            };
            
            console.log('🚀 Sending request to: /api/reviews');
            console.log('📦 Request body:', requestBody);
            console.log('🔐 Auth token:', token.substring(0, 20) + '...');
            
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestBody)
            });
            
            console.log('📡 Response status:', response.status);
            
            const data = await response.json();
            console.log('📦 Response data:', data);
            
            if (data.success) {
                console.log('✅ Review submitted successfully!');
                cart.showNotification('Thank you! Your review has been submitted successfully! ⭐');
                closeModal();
                setTimeout(() => {
                    console.log('🔄 Reloading page...');
                    window.location.reload();
                }, 1500);
            } else {
                throw new Error(data.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('❌ Error submitting review:', error);
            cart.showNotification(`Error: ${error.message}`, 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
    
    // Focus on review text area
    setTimeout(() => {
        modalContent.querySelector('#reviewText').focus();
    }, 300);
    
    console.log('✅ Modal setup complete');
}

// ============ INITIALIZE ON DOM LOAD ============
console.log('🚀 Script loaded');

// Declare productId globally but safely
window.reviewProductId = window.reviewProductId || null;

// Wait for DOM to be fully loaded
function initializeReviewButton() {
    console.log('🎬 Initializing review button');
    console.log('📄 Document ready state:', document.readyState);
    
    // Get product ID early and store it
    window.reviewProductId = getProductId();
    console.log('📦 Initial Product ID:', window.reviewProductId);
    
    const writeReviewBtn = document.getElementById('writeReviewBtn');
    console.log('🔍 Looking for review button...');
    console.log('🔍 Button found:', writeReviewBtn ? 'YES ✅' : 'NO ❌');
    
    if (writeReviewBtn) {
        // Remove existing listeners by cloning the button
        const newBtn = writeReviewBtn.cloneNode(true);
        writeReviewBtn.parentNode.replaceChild(newBtn, writeReviewBtn);
        
        // Add click event listener
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🖱️ REVIEW BUTTON CLICKED!');
            showReviewModal();
        });
        
        console.log('✅ Review button event listener attached successfully!');
        
        // Add visual feedback
        newBtn.style.cursor = 'pointer';
        newBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        newBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    } else {
        console.log('⚠️ Review button not found in DOM');
        console.log('Available buttons:', Array.from(document.querySelectorAll('button')).map(b => b.id || b.className));
    }
}

// Multiple initialization attempts to ensure it works
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeReviewButton);
} else {
    // DOM already loaded, initialize immediately
    initializeReviewButton();
}

// Backup initialization after a delay
setTimeout(initializeReviewButton, 500);
setTimeout(initializeReviewButton, 1000);

// Also try after window fully loads
window.addEventListener('load', initializeReviewButton);

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
    
    #writeReviewBtn {
        cursor: pointer !important;
        transition: all 0.3s ease !important;
    }
    
    #writeReviewBtn:hover {
        transform: scale(1.1) rotate(5deg) !important;
    }
    
    #writeReviewBtn:active {
        transform: scale(0.95) rotate(0deg) !important;
    }
    
    .fa-spinner {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(style);

console.log('✅ Styles injected');
console.log('✅ Script initialization complete');