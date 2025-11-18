// Get current user from localStorage
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Check if user is logged in
function isLoggedIn() {
    return !!localStorage.getItem('token');
}

// Check if user is admin
function isAdmin() {
    const user = getCurrentUser();
    return user && user.isAdmin;
}

// Save user data to localStorage
function saveUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

// Clear user data from localStorage
function clearUserData() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
}

// Login function
async function login(email, password) {
    try {
        const response = await api.auth.login(email, password);
        
        if (response.success) {
            saveUserData(response.token, response.user);
            
            // Redirect based on user type
            if (response.user.isAdmin) {
                window.location.href = '../pages/admin.html';
            } else {
                window.location.href = '../pages/explore.html';
            }
        }
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
}

// Register function - FIXED to accept role
async function register(name, email, password, role) {
    try {
        // Convert role string to boolean
        const isAdmin = (role === 'admin');
        
        console.log('Register data:', { name, email, isAdmin }); // Debug log
        
        // Send isAdmin as boolean along with other user info
        const response = await api.auth.register(name, email, password, isAdmin);
        
        if (response.success) {
            saveUserData(response.token, response.user);

            // Redirect based on user type
            if (response.user.isAdmin) {
                window.location.href = '../pages/admin.html';
            } else {
                window.location.href = '../pages/explore.html';
            }
        }
    } catch (error) {
        alert('Registration failed: ' + error.message);
    }
}

// Logout function
function logout() {
    clearUserData();
    window.location.href = '../public/index.html';
}

// Update header based on auth status
function updateHeader() {
    const cartIcon = document.getElementById('cartIcon');
    const cartBadge = document.getElementById('cartBadge');
    const authBtn = document.getElementById('authBtn');
    const exploreOrDashboard = document.getElementById('exploreOrDashboard');
    
    if (isLoggedIn()) {
        const user = getCurrentUser();
        
        // Show cart
        if (cartIcon) {
            cartIcon.style.display = 'block';
            const cart = getCart();
            if (cart.length > 0) {
                cartBadge.textContent = cart.length;
                cartBadge.style.display = 'flex';
            } else {
                cartBadge.style.display = 'none';
            }
        }
        
        // Update auth button
        if (authBtn) {
            authBtn.textContent = '👤 Account';
            authBtn.onclick = () => window.location.href = '../pages/account.html';
        }
        
        // Change Explore to Dashboard for admin
        if (exploreOrDashboard && user.isAdmin) {
            exploreOrDashboard.innerHTML = '<a href="../pages/admin.html">Dashboard</a>';
        }
    } else {
        if (cartIcon) cartIcon.style.display = 'none';
        if (authBtn) {
            authBtn.textContent = 'Login';
            authBtn.onclick = () => window.location.href = '../pages/login.html';
        }
    }
}

// Protect route (redirect if not logged in)
function protectRoute() {
    if (!isLoggedIn()) {
        window.location.href = '../pages/login.html';
    }
}

// Protect admin route
function protectAdminRoute() {
    if (!isLoggedIn() || !isAdmin()) {
        window.location.href = '../public/index.html';
    }
}