// Wishlist.js - Complete wishlist functionality

// Confirmation Modal Functions
let confirmCallback = null;

function showConfirmModal(title, message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    if (!modal) return;
    document.getElementById('confirmModalTitle').textContent = title;
    document.getElementById('confirmModalMessage').textContent = message;
    confirmCallback = onConfirm;
    modal.style.display = 'flex';
}

function closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) modal.style.display = 'none';
    confirmCallback = null;
}

// Modal event listeners - Setup after DOM loads
document.addEventListener('DOMContentLoaded', () => {
    const confirmCancelBtn = document.getElementById('confirmCancelBtn');
    const confirmOkBtn = document.getElementById('confirmOkBtn');
    
    if (confirmCancelBtn) {
        confirmCancelBtn.addEventListener('click', closeConfirmModal);
    }
    
    if (confirmOkBtn) {
        confirmOkBtn.addEventListener('click', () => {
            if (confirmCallback) confirmCallback();
            closeConfirmModal();
        });
    }
    
    window.onclick = function(event) {
        const modal = document.getElementById('confirmModal');
        if (event.target == modal) {
            closeConfirmModal();
        }
    };
    
    // Load wishlist on page load
    loadWishlist();
});

async function loadWishlist() {
    const loadingMessage = document.getElementById('loadingMessage');
    const emptyMessage = document.getElementById('emptyMessage');
    const wishlistGrid = document.getElementById('wishlistGrid');
    const wishlistCount = document.getElementById('wishlistCount');
    
    try {
        const response = await fetch('/api/wishlist');
        const data = await response.json();
        
        if (loadingMessage) loadingMessage.style.display = 'none';
        
        if (data.success && data.products && data.products.length > 0) {
            renderWishlist(data.products);
        } else {
            if (emptyMessage) emptyMessage.style.display = 'block';
            if (wishlistCount) wishlistCount.textContent = '0 items';
            if (wishlistGrid) wishlistGrid.innerHTML = '';
        }
    } catch (error) {
        console.error('Error loading wishlist:', error);
        if (loadingMessage) loadingMessage.style.display = 'none';
        if (emptyMessage) emptyMessage.style.display = 'block';
    }
}

function renderWishlist(products) {
    const emptyMessage = document.getElementById('emptyMessage');
    const wishlistGrid = document.getElementById('wishlistGrid');
    const wishlistCount = document.getElementById('wishlistCount');
    
    if (emptyMessage) emptyMessage.style.display = 'none';
    if (wishlistCount) wishlistCount.textContent = `${products.length} ${products.length === 1 ? 'item' : 'items'}`;
    
    if (!wishlistGrid) return;
    
    wishlistGrid.innerHTML = products.map(product => {
        const imageUrl = product.image || (product.images && product.images.length > 0 ? (product.images[0].url || product.images[0]) : '/images/placeholder.jpg');
        const inStock = product.stockQuantity > 0;
        
        return `
            <div class="wishlist-item" data-product-id="${product._id}">
                <button class="remove-btn" onclick="removeFromWishlist('${product._id}')" title="Remove from wishlist">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="product-image" style="background-image: url('${imageUrl}');"></div>
                
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">₹${product.price.toLocaleString('en-IN')}</div>
                </div>
                
                <div class="product-actions">
                    <button class="btn-add-to-cart" onclick="addToCartFromWishlist('${product._id}', event)" ${!inStock ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // Add action buttons if there are items
    if (products.length > 0) {
        const buttonsDiv = document.createElement('div');
        buttonsDiv.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 30px 20px; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;';
        buttonsDiv.innerHTML = `
            <button onclick="addAllToCart()" style="background: #D4AF37; color: #000; border: none; padding: 14px 35px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; font-size: 15px;">
                <i class="fas fa-shopping-cart"></i> Add All to Cart
            </button>
            <button onclick="clearWishlist()" style="background: #D4AF37; color: #000; border: none; padding: 14px 35px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; font-size: 15px;">
                <i class="fas fa-trash"></i> Clear Wishlist
            </button>
        `;
        wishlistGrid.appendChild(buttonsDiv);
    }
}

async function addAllToCart() {
    try {
        const response = await fetch('/api/wishlist/add-all-to-cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showNotification(data.message || 'All items added to cart!');
            // Reload wishlist to update UI (items remain in wishlist)
            await loadWishlist();
        } else {
            showNotification(data.message || 'Error adding items to cart');
        }
    } catch (error) {
        console.error('Error adding all to cart:', error);
        showNotification('Error adding items to cart');
    }
}

async function removeFromWishlist(productId) {
    showConfirmModal('Remove Item', 'Are you sure you want to remove this item from your wishlist?', async () => {
        try {
            const response = await fetch(`/api/wishlist/remove/${productId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                await loadWishlist();
                showNotification('Item removed from wishlist');
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            showNotification('Error removing item');
        }
    });
}

async function clearWishlist() {
    showConfirmModal('Clear Wishlist', 'Are you sure you want to clear your entire wishlist? This action cannot be undone.', async () => {
        try {
            const response = await fetch('/api/wishlist/clear', {
                method: 'DELETE'
            });
            
            if (response.ok) {
                await loadWishlist();
                showNotification('Wishlist cleared successfully');
            }
        } catch (error) {
            console.error('Error clearing wishlist:', error);
            showNotification('Error clearing wishlist');
        }
    });
}

async function addToCartFromWishlist(productId, event) {
    event.preventDefault();
    event.stopPropagation();
    
    try {
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, quantity: 1 })
        });
        
        if (response.ok) {
            showNotification('Item added to cart!');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Error adding to cart');
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = 'position: fixed; top: 100px; right: 20px; background: #D4AF37; color: #000; padding: 15px 25px; border-radius: 10px; font-weight: 600; z-index: 10001; animation: slideIn 0.3s ease;';
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}