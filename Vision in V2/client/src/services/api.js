import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach current user identity header
API.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('visionin_user');
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      if (parsed.id) {
        config.headers['x-user-id'] = parsed.id;
      }
    } catch (e) {
      console.warn('Failed parsing stored user state:', e);
    }
  }
  return config;
});

export default API;
