// ============================================================
// API SERVICE - Axios instance with mock data fallback
// In demo mode (no backend), uses mock data automatically
// ============================================================

import axios from 'axios';
import { mockAPI } from './mockData';

// Check if we're in demo mode (no backend available)
// On Vercel/static deployment, there's no /api backend
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true' ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost');

// Create Axios instance with base configuration
const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Request Interceptor: Automatically attach JWT token
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
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('healthhub_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ============================================================
// API FUNCTIONS — Uses mock data in demo mode, real API otherwise
// ============================================================

// ---- AUTH ----
export const authAPI = DEMO_MODE ? {
  register: (data) => mockAPI.auth.register(data),
  login: (data) => mockAPI.auth.login(data),
  getProfile: () => mockAPI.auth.getProfile(),
  updateProfile: (data) => mockAPI.auth.updateProfile(data),
} : {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

// ---- MEDICINES ----
export const medicineAPI = DEMO_MODE ? {
  getAll: (params) => mockAPI.medicines.getAll(params),
  getById: (id) => mockAPI.medicines.getAll().then(r => ({ data: { data: r.data.data.find(m => m._id === id) } })),
  create: (data) => mockAPI.medicines.create(data),
  update: (id, data) => mockAPI.medicines.update(id, data),
  complete: (id) => mockAPI.medicines.complete(id),
  delete: (id) => mockAPI.medicines.delete(id),
} : {
  getAll: (params) => API.get('/medicines', { params }),
  getById: (id) => API.get(`/medicines/${id}`),
  create: (data) => API.post('/medicines', data),
  update: (id, data) => API.put(`/medicines/${id}`, data),
  complete: (id) => API.patch(`/medicines/${id}/complete`),
  delete: (id) => API.delete(`/medicines/${id}`),
};

// ---- WATER ----
export const waterAPI = DEMO_MODE ? {
  log: (data) => mockAPI.water.log(data),
  getToday: () => mockAPI.water.getToday(),
  getWeekly: () => mockAPI.water.getWeekly(),
  updateGoal: (data) => mockAPI.water.updateGoal(data),
  delete: (id) => mockAPI.water.delete(id),
} : {
  log: (data) => API.post('/water', data),
  getToday: () => API.get('/water/today'),
  getWeekly: () => API.get('/water/weekly'),
  updateGoal: (data) => API.put('/water/goal', data),
  delete: (id) => API.delete(`/water/${id}`),
};

// ---- HEALTH TIPS ----
export const tipsAPI = DEMO_MODE ? {
  getDaily: () => mockAPI.tips.getDaily(),
  getAll: (params) => mockAPI.tips.getAll(params),
  getRandom: () => mockAPI.tips.getRandom(),
  create: (data) => mockAPI.tips.create(data),
  update: (id, data) => mockAPI.tips.update(id, data),
  delete: (id) => mockAPI.tips.delete(id),
} : {
  getDaily: () => API.get('/tips/daily'),
  getAll: (params) => API.get('/tips', { params }),
  getRandom: () => API.get('/tips/random'),
  create: (data) => API.post('/tips', data),
  update: (id, data) => API.put(`/tips/${id}`, data),
  delete: (id) => API.delete(`/tips/${id}`),
};

// ---- EXERCISES ----
export const exerciseAPI = DEMO_MODE ? {
  getAll: (params) => mockAPI.exercises.getAll(params),
  create: (data) => mockAPI.exercises.create(data),
  update: (id, data) => mockAPI.exercises.update(id, data),
  complete: (id) => mockAPI.exercises.complete(id),
  delete: (id) => mockAPI.exercises.delete(id),
} : {
  getAll: (params) => API.get('/exercises', { params }),
  create: (data) => API.post('/exercises', data),
  update: (id, data) => API.put(`/exercises/${id}`, data),
  complete: (id) => API.patch(`/exercises/${id}/complete`),
  delete: (id) => API.delete(`/exercises/${id}`),
};

// ---- DASHBOARD ----
export const dashboardAPI = DEMO_MODE ? {
  getStats: () => mockAPI.dashboard.getStats(),
  getWeekly: () => mockAPI.dashboard.getWeekly(),
  getQuote: () => mockAPI.dashboard.getQuote(),
} : {
  getStats: () => API.get('/dashboard/stats'),
  getWeekly: () => API.get('/dashboard/weekly'),
  getQuote: () => API.get('/dashboard/quote'),
};

export default API;
