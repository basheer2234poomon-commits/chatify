import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// User APIs
export const userAPI = {
  searchUsers: (query) => api.get('/users/search', { params: { query } }),
  getContacts: () => api.get('/users/contacts'),
  addContact: (contactId) => api.post('/users/contacts', { contactId }),
  updateProfile: (data) => api.put('/users/profile', data),
  getUserById: (userId) => api.get(`/users/${userId}`),
};

// Message APIs
export const messageAPI = {
  getMessages: (conversationId) => api.get(`/messages/${conversationId}`),
  markAsRead: (conversationId) => api.post('/messages/read', { conversationId }),
};

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
