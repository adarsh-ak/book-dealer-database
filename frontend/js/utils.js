// Cart management (localStorage)
function getCart() {
    const cartStr = localStorage.getItem('cart');
    return cartStr ? JSON.parse(cartStr) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateHeader();
}

function addToCart(book) {
    const cart = getCart();
    const existing = cart.find(item => item._id === book._id);
    
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...book, quantity: 1 });
    }
    
    saveCart(cart);
    alert(`${book.title} added to cart!`);
}

function removeFromCart(bookId) {
    const cart = getCart();
    const updated = cart.filter(item => item._id !== bookId);
    saveCart(updated);
}

function updateQuantity(bookId, change) {
    const cart = getCart();
    const item = cart.find(item => item._id === bookId);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(bookId);
        } else {
            saveCart(cart);
        }
    }
}

function clearCart() {
    localStorage.removeItem('cart');
    updateHeader();
}

// Format currency
function formatCurrency(amount) {
    return `$${parseFloat(amount).toFixed(2)}`;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Show loading indicator
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="loading">Loading...</div>';
    }
}

// Show error message
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div class="error-message">${message}</div>`;
    }
}

// Show success message
function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div class="success-message">${message}</div>`;
    }
}

// Get URL parameters
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
