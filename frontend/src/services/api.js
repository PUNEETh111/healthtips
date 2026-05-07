// ============================================================
// API SERVICE - Axios instance with JWT interceptor
// Centralized HTTP client for all API calls
// ============================================================

import axios from 'axios';

// Create Axios instance with base configuration
const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Request Interceptor: Automatically attach JWT token
 * to every outgoing request if the user is logged in
 */
API.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem('healthhub_user');
    if (userData) {
      const { token } = JSON.parse(userData);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor: Handle 401 Unauthorized globally
 * If token is expired/invalid, redirect to login
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('healthhub_user');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ============================================================
// API FUNCTIONS - Organized by module
// ============================================================

// ---- AUTH ----
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

// ---- MEDICINES ----
export const medicineAPI = {
  getAll: (params) => API.get('/medicines', { params }),
  getById: (id) => API.get(`/medicines/${id}`),
  create: (data) => API.post('/medicines', data),
  update: (id, data) => API.put(`/medicines/${id}`, data),
  complete: (id) => API.patch(`/medicines/${id}/complete`),
  delete: (id) => API.delete(`/medicines/${id}`),
};

// ---- WATER ----
export const waterAPI = {
  log: (data) => API.post('/water', data),
  getToday: () => API.get('/water/today'),
  getWeekly: () => API.get('/water/weekly'),
  updateGoal: (data) => API.put('/water/goal', data),
  delete: (id) => API.delete(`/water/${id}`),
};

// ---- HEALTH TIPS ----
export const tipsAPI = {
  getDaily: () => API.get('/tips/daily'),
  getAll: (params) => API.get('/tips', { params }),
  getRandom: () => API.get('/tips/random'),
  create: (data) => API.post('/tips', data),
  update: (id, data) => API.put(`/tips/${id}`, data),
  delete: (id) => API.delete(`/tips/${id}`),
};

// ---- EXERCISES ----
export const exerciseAPI = {
  getAll: (params) => API.get('/exercises', { params }),
  create: (data) => API.post('/exercises', data),
  update: (id, data) => API.put(`/exercises/${id}`, data),
  complete: (id) => API.patch(`/exercises/${id}/complete`),
  delete: (id) => API.delete(`/exercises/${id}`),
};

// ---- DASHBOARD ----
export const dashboardAPI = {
  getStats: () => API.get('/dashboard/stats'),
  getWeekly: () => API.get('/dashboard/weekly'),
  getQuote: () => API.get('/dashboard/quote'),
};

export default API;
