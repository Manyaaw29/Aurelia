// Search functionality for Aurelia Jewelry

// Debounce function to limit API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Search state
let searchResults = [];
let isSearching = false;

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput') || document.querySelector('input[type="search"]');
    const searchButton = document.getElementById('searchButton');
    const searchResultsContainer = document.getElementById('searchResults');
    
    if (!searchInput) {
        console.warn('Search input not found');
        return;
    }

    // Create search results dropdown if it doesn't exist
    if (!searchResultsContainer) {
        createSearchResultsContainer(searchInput);
    }

    // Add event listeners
    searchInput.addEventListener('input', debounce(handleSearchInput, 300));
    searchInput.addEventListener('focus', handleSearchFocus);
    searchInput.addEventListener('keypress', handleSearchKeypress);
    
    if (searchButton) {
        searchButton.addEventListener('click', handleSearchButtonClick);
    }

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        const resultsContainer = document.getElementById('searchResults');
        if (resultsContainer && !searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.style.display = 'none';
        }
    });
}

// Create search results dropdown container
function createSearchResultsContainer(searchInput) {
    const container = document.createElement('div');
    container.id = 'searchResults';
    container.className = 'search-results-dropdown';
    container.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #1A3D2E;
        border: 2px solid #D4AF37;
        border-top: none;
        border-radius: 0 0 15px 15px;
        max-height: 400px;
        overflow-y: auto;
        display: none;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
        margin-top: -1px;
    `;
    
    // Find the parent container of search input
    const searchContainer = searchInput.closest('.search-container') || searchInput.parentElement;
    if (searchContainer) {
        searchContainer.style.position = 'relative';
        searchContainer.appendChild(container);
    }
}

// Handle search input changes
async function handleSearchInput(e) {
    const query = e.target.value.trim();
    const resultsContainer = document.getElementById('searchResults');
    
    if (!resultsContainer) return;

    // Hide results if query is too short
    if (query.length < 2) {
        resultsContainer.style.display = 'none';
        return;
    }

    // Show loading state
    resultsContainer.innerHTML = `
        <div style="padding: 20px; text-align: center; color: #D4AF37;">
            <i class="fas fa-spinner fa-spin"></i> Searching...
        </div>
    `;
    resultsContainer.style.display = 'block';

    try {
        // Search products
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.success && data.data.length > 0) {
            displaySearchResults(data.data, query);
        } else {
            displayNoResults(query);
        }
    } catch (error) {
        console.error('Search error:', error);
        resultsContainer.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #ff6b6b;">
                <i class="fas fa-exclamation-circle"></i> Error searching products
            </div>
        `;
    }
}

// Display search results
function displaySearchResults(products, query) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;

    searchResults = products;

    let html = `
        <div style="padding: 15px; border-bottom: 1px solid rgba(212, 175, 55, 0.2); color: #D4AF37; font-weight: 600;">
            Found ${products.length} result${products.length !== 1 ? 's' : ''} for "${query}"
        </div>
    `;

    products.slice(0, 8).forEach(product => {
        const imageUrl = product.images && product.images.length > 0 
            ? (product.images[0].url || product.images[0]) 
            : '/images/placeholder.jpg';
        
        const price = product.price ? `₹${product.price.toLocaleString('en-IN')}` : 'N/A';
        
        html += `
            <a href="/product/${product._id}" class="search-result-item" style="
                display: flex;
                align-items: center;
                padding: 12px 15px;
                text-decoration: none;
                color: #fff;
                border-bottom: 1px solid rgba(212, 175, 55, 0.1);
                transition: all 0.3s ease;
            " onmouseover="this.style.background='rgba(212, 175, 55, 0.1)'" onmouseout="this.style.background='transparent'">
                <img src="${imageUrl}" alt="${product.name}" style="
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 8px;
                    margin-right: 15px;
                    border: 1px solid rgba(212, 175, 55, 0.2);
                ">
                <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 4px; color: #fff;">${product.name}</div>
                    <div style="font-size: 0.9rem; color: #D4AF37; font-weight: 600;">${price}</div>
                    <div style="font-size: 0.85rem; color: #ccc; margin-top: 2px;">${product.category || ''}</div>
                </div>
                <i class="fas fa-chevron-right" style="color: #D4AF37; font-size: 0.9rem;"></i>
            </a>
        `;
    });

    if (products.length > 8) {
        html += `
            <div style="padding: 15px; text-align: center;">
                <button onclick="viewAllResults('${query}')" style="
                    background: linear-gradient(135deg, #D4AF37, #F4D03F);
                    color: #000;
                    border: none;
                    padding: 10px 25px;
                    border-radius: 25px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                    View All ${products.length} Results
                </button>
            </div>
        `;
    }

    resultsContainer.innerHTML = html;
    resultsContainer.style.display = 'block';
}

// Display no results message
function displayNoResults(query) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = `
        <div style="padding: 30px; text-align: center;">
            <i class="fas fa-search" style="font-size: 3rem; color: #D4AF37; margin-bottom: 15px;"></i>
            <div style="color: #fff; font-size: 1.1rem; margin-bottom: 8px;">No products found for "${query}"</div>
            <div style="color: #ccc; font-size: 0.9rem; margin-bottom: 20px;">Try different keywords or browse our collections</div>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                <a href="/rings" style="background: rgba(212, 175, 55, 0.1); color: #D4AF37; padding: 8px 16px; border-radius: 20px; text-decoration: none; font-size: 0.9rem; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(212, 175, 55, 0.2)'" onmouseout="this.style.background='rgba(212, 175, 55, 0.1)'">Rings</a>
                <a href="/earrings" style="background: rgba(212, 175, 55, 0.1); color: #D4AF37; padding: 8px 16px; border-radius: 20px; text-decoration: none; font-size: 0.9rem; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(212, 175, 55, 0.2)'" onmouseout="this.style.background='rgba(212, 175, 55, 0.1)'">Earrings</a>
                <a href="/necklaces" style="background: rgba(212, 175, 55, 0.1); color: #D4AF37; padding: 8px 16px; border-radius: 20px; text-decoration: none; font-size: 0.9rem; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(212, 175, 55, 0.2)'" onmouseout="this.style.background='rgba(212, 175, 55, 0.1)'">Necklaces</a>
                <a href="/bracelets" style="background: rgba(212, 175, 55, 0.1); color: #D4AF37; padding: 8px 16px; border-radius: 20px; text-decoration: none; font-size: 0.9rem; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(212, 175, 55, 0.2)'" onmouseout="this.style.background='rgba(212, 175, 55, 0.1)'">Bracelets</a>
            </div>
        </div>
    `;
    resultsContainer.style.display = 'block';
}

// Handle search focus
function handleSearchFocus(e) {
    const query = e.target.value.trim();
    if (query.length >= 2 && searchResults.length > 0) {
        document.getElementById('searchResults').style.display = 'block';
    }
}

// Handle Enter key press
function handleSearchKeypress(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const query = e.target.value.trim();
        if (query.length >= 2) {
            viewAllResults(query);
        }
    }
}

// Handle search button click
function handleSearchButtonClick() {
    const searchInput = document.getElementById('searchInput') || document.querySelector('input[type="search"]');
    if (searchInput) {
        const query = searchInput.value.trim();
        if (query.length >= 2) {
            viewAllResults(query);
        }
    }
}

// View all search results on a dedicated page
function viewAllResults(query) {
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSearch);
} else {
    initializeSearch();
}

// Add custom scrollbar styles for search results
const style = document.createElement('style');
style.textContent = `
    #searchResults::-webkit-scrollbar {
        width: 8px;
    }
    
    #searchResults::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 10px;
    }
    
    #searchResults::-webkit-scrollbar-thumb {
        background: #D4AF37;
        border-radius: 10px;
    }
    
    #searchResults::-webkit-scrollbar-thumb:hover {
        background: #F4D03F;
    }
`;
document.head.appendChild(style);