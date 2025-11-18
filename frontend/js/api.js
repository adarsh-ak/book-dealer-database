const API_URL = 'http://localhost:5000/api';

// API Helper Functions
const api = {
    // Get auth token
    getToken() {
        return localStorage.getItem('token');
    },

    // Set auth headers
    getHeaders() {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    },

    // Generic fetch wrapper
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers: this.getHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Auth endpoints
    auth: {
        async login(email, password) {
            return await api.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
        },

        async register(name, email, password, isAdmin) {
            console.log('API register called with:', { name, email, isAdmin, type: typeof isAdmin }); // Debug
            return await api.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ 
                    name, 
                    email, 
                    password, 
                    isAdmin: Boolean(isAdmin) // Ensure it's boolean
                })
            });
        },

        async getMe() {
            return await api.request('/auth/me');
        }
    },

    // Book endpoints
    books: {
        async getAll(category = '', search = '') {
            const params = new URLSearchParams();
            if (category && category !== 'All') params.append('category', category);
            if (search) params.append('search', search);
            
            return await api.request(`/books?${params.toString()}`);
        },

        async getOne(id) {
            return await api.request(`/books/${id}`);
        },

        async create(bookData) {
            return await api.request('/books', {
                method: 'POST',
                body: JSON.stringify(bookData)
            });
        },

        async update(id, bookData) {
            return await api.request(`/books/${id}`, {
                method: 'PUT',
                body: JSON.stringify(bookData)
            });
        },

        async delete(id) {
            return await api.request(`/books/${id}`, {
                method: 'DELETE'
            });
        },

        async getStats() {
            return await api.request('/books/stats');
        }
    },

    // Order endpoints
    orders: {
        async create(orderData) {
            return await api.request('/orders', {
                method: 'POST',
                body: JSON.stringify(orderData)
            });
        },

        async getMyOrders() {
            return await api.request('/orders');
        },

        async getAllOrders() {
            return await api.request('/orders/all');
        }
    }
};