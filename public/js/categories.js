// Universal category page JavaScript (works for all categories: rings, earrings, necklaces, bracelets)

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

// Add to Wishlist functionality
document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const productName = btn.getAttribute('data-name');
        showNotification(`${productName} added to wishlist!`);
    });
});

// Add to Cart functionality
document.querySelectorAll('.cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const productName = btn.getAttribute('data-name');
        showNotification(`${productName} added to cart!`);
    });
});
