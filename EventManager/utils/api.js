import axios from 'axios';
import { tokenManager } from './tokenManager';

const API_BASE_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to attach token and handle FormData
axiosInstance.interceptors.request.use((config) => {
  const token = tokenManager.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Don't set Content-Type for FormData - browser will set it automatically with boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  } else {
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
});

export const authApi = {
  login: (email, password, role) =>
    axiosInstance.post('/auth/login', { email, password, role }),

  register: (userData) =>
    axiosInstance.post('/auth/signup', { ...userData }),

  verifyToken: () =>
    axiosInstance.get('/auth/verify-token') 
};

export const eventsApi = {
  getEvents: () => axiosInstance.get('/events'),

  getEventById: (id) => axiosInstance.get(`/events/${id}`),

  createEvent: (eventData) => {
    // If eventData is FormData, send as-is
    if (eventData instanceof FormData) {
      return axiosInstance.post('/events/create', eventData);
    }
    // Otherwise send as JSON
    return axiosInstance.post('/events/create', eventData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },

  updateEvent: (id, eventData) => {
    if (eventData instanceof FormData) {
      return axiosInstance.put(`/events/${id}`, eventData);
    }
    return axiosInstance.put(`/events/${id}`, eventData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },

  deleteEvent: (id) => axiosInstance.delete(`/events/${id}`),

  // Optional: Specific method for FormData uploads
  createEventWithImage: (formData) => {
    return axiosInstance.post('/events/create', formData);
  }
};