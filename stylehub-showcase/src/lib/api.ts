import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken')
    const method = config.method?.toUpperCase() || 'GET'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log(`🔑 ${method} ${config.url} with token: ${token.substring(0, 20)}...`);
    } else {
      console.log(`⚠️ ${method} ${config.url} WITHOUT token`);
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toUpperCase() || 'GET'
    console.log(`✅ ${method} ${response.config.url} - Status: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    const method = error.config?.method?.toUpperCase() || 'GET'
    const url = error.config?.url || 'unknown'
    console.error(`❌ ${method} ${url} - Error:`, error.response?.status, error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      // Only redirect if not already on auth page
      const currentPath = window.location.pathname;
      if (currentPath !== '/auth') {
        console.log('401 Unauthorized - clearing auth and redirecting to login');
        localStorage.removeItem('authToken');
        localStorage.removeItem('stylehub_auth');
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error)
  }
)

export default api
