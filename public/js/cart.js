// Cart.js - Complete cart functionality with modals and saved for later

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
    
    // Load cart and saved items on page load
    loadCart();
    loadSavedForLater();
});

async function loadCart() {
    try {
        const response = await fetch('/api/cart');
        const data = await response.json();
        
        if (data.success && data.cart && data.cart.items.length > 0) {
            renderCart(data.cart.items, data.cart.totalAmount);
        } else {
            showEmptyCart();
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        const cartItems = document.getElementById('cartItems');
        if (cartItems) {
            cartItems.innerHTML = '<p style="color: #f44336; text-align: center; padding: 40px;">Error loading cart</p>';
        }
    }
}

async function loadSavedForLater() {
    try {
        const response = await fetch('/api/saved-for-later');
        const data = await response.json();
        
        if (data.success) {
            renderSavedForLater(data.products);
        }
    } catch (error) {
        console.error('Error loading saved items:', error);
    }
}

function renderCart(items, totalAmount) {
    const container = document.getElementById('cartItems');
    const emptyMessage = document.getElementById('emptyCartMessage');
    const cartHeader = document.getElementById('cartHeaderPrice');
    const subtotalBottom = document.getElementById('cartSubtotalBottom');
    const sidebar = document.getElementById('cartSummarySidebar');
    
    if (emptyMessage) emptyMessage.style.display = 'none';
    if (cartHeader) cartHeader.style.display = 'flex';
    if (subtotalBottom) subtotalBottom.style.display = 'block';
    if (sidebar) sidebar.style.display = 'block';
    
    let totalItems = 0;
    container.innerHTML = items.map(item => {
        totalItems += item.quantity;
        const product = item.product;
        const imageUrl = product.image || (product.images && product.images.length > 0 ? (product.images[0].url || product.images[0]) : '/images/placeholder.jpg');
        return `
            <div class="cart-item" data-product-id="${product._id}" data-price="${item.price}">
                <img src="${imageUrl}" alt="${product.name}" class="product-image" onerror="this.src='/images/placeholder.jpg'">
                <div class="product-details">
                    <div class="product-name">${product.name}</div>
                    <div class="product-description">${product.description || ''}</div>
                    <div class="item-price-quantity">
                        <div class="quantity-selector">
                            <button class="qty-btn" onclick="updateQuantity('${product._id}', ${item.quantity - 1})">-</button>
                            <span class="qty-display">${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity('${product._id}', ${item.quantity + 1})">+</button>
                        </div>
                        <div class="price">₹${(item.price * item.quantity).toLocaleString('en-IN')}</div>
                    </div>
                    <div class="item-actions">
                        <a href="#" class="action-link" onclick="event.preventDefault(); removeFromCart('${product._id}')">Delete</a> |
                        <a href="#" class="action-link" onclick="event.preventDefault(); saveForLater('${product._id}')">Save for later</a>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    const itemsCountBottom = document.getElementById('items-count-bottom');
    const itemsCountSidebar = document.getElementById('items-count-sidebar');
    const subtotalBottomEl = document.getElementById('subtotal-bottom');
    const subtotalSidebarEl = document.getElementById('subtotal-sidebar');
    
    if (itemsCountBottom) itemsCountBottom.textContent = totalItems;
    if (itemsCountSidebar) itemsCountSidebar.textContent = totalItems;
    if (subtotalBottomEl) subtotalBottomEl.textContent = '₹' + totalAmount.toLocaleString('en-IN');
    if (subtotalSidebarEl) subtotalSidebarEl.textContent = '₹' + totalAmount.toLocaleString('en-IN');
}

function renderSavedForLater(products) {
    const savedSection = document.getElementById('savedForLaterSection');
    const savedContainer = document.getElementById('savedItemsContainer');
    const emptyMessage = document.getElementById('emptySavedMessage');
    
    if (!savedSection || !savedContainer) return;
    
    if (!products || products.length === 0) {
        savedSection.style.display = 'block';
        if (emptyMessage) emptyMessage.style.display = 'flex';
        savedContainer.innerHTML = '';
        return;
    }
    
    savedSection.style.display = 'block';
    if (emptyMessage) emptyMessage.style.display = 'none';
    
    savedContainer.innerHTML = products.map(product => {
        const imageUrl = product.image || (product.images && product.images.length > 0 ? (product.images[0].url || product.images[0]) : '/images/placeholder.jpg');
        return `
            <div class="cart-item saved-item" data-product-id="${product._id}">
                <img src="${imageUrl}" alt="${product.name}" class="product-image" onerror="this.src='/images/placeholder.jpg'">
                <div class="product-details">
                    <div class="product-name">${product.name}</div>
                    <div class="product-description">${product.description || ''}</div>
                    <div class="item-price-quantity">
                        <div class="price">₹${product.price.toLocaleString('en-IN')}</div>
                    </div>
                    <div class="item-actions">
                        <a href="#" class="action-link" onclick="event.preventDefault(); moveToCart('${product._id}')">Move to Cart</a> |
                        <a href="#" class="action-link" onclick="event.preventDefault(); removeSaved('${product._id}')">Delete</a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function showEmptyCart() {
    const emptyMessage = document.getElementById('emptyCartMessage');
    const cartHeader = document.getElementById('cartHeaderPrice');
    const subtotalBottom = document.getElementById('cartSubtotalBottom');
    const sidebar = document.getElementById('cartSummarySidebar');
    const cartItems = document.getElementById('cartItems');
    
    if (emptyMessage) emptyMessage.style.display = 'flex';
    if (cartHeader) cartHeader.style.display = 'none';
    if (subtotalBottom) subtotalBottom.style.display = 'none';
    if (sidebar) sidebar.style.display = 'none';
    if (cartItems) cartItems.innerHTML = '';
}

async function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) return;
    
    try {
        const response = await fetch(`/api/cart/update/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: newQuantity })
        });
        
        if (response.ok) {
            await loadCart();
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
    }
}

async function removeFromCart(productId) {
    showConfirmModal('Remove Item', 'Are you sure you want to remove this item from your cart?', async () => {
        try {
            const response = await fetch(`/api/cart/remove/${productId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                await loadCart();
                showNotification('Item removed from cart');
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    });
}

async function saveForLater(productId) {
    try {
        const response = await fetch('/api/saved-for-later/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId })
        });
        
        if (response.ok) {
            const removeResponse = await fetch(`/api/cart/remove/${productId}`, {
                method: 'DELETE'
            });
            
            if (removeResponse.ok) {
                await loadCart();
                await loadSavedForLater();
                showNotification('Item saved for later');
            }
        }
    } catch (error) {
        console.error('Error saving for later:', error);
    }
}

async function moveToCart(productId) {
    try {
        const response = await fetch(`/api/saved-for-later/move-to-cart/${productId}`, {
            method: 'POST'
        });
        
        if (response.ok) {
            await loadCart();
            await loadSavedForLater();
            showNotification('Item moved to cart');
        }
    } catch (error) {
        console.error('Error moving to cart:', error);
    }
}

async function removeSaved(productId) {
    showConfirmModal('Remove Saved Item', 'Are you sure you want to permanently remove this item?', async () => {
        try {
            const response = await fetch(`/api/saved-for-later/remove/${productId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                await loadSavedForLater();
                showNotification('Item removed');
            }
        } catch (error) {
            console.error('Error removing saved item:', error);
        }
    });
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