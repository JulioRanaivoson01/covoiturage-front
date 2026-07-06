import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
//const API_BASE_URL = __DEV__ 
 // ? 'http://localhost:3000/api' 
  //: 'https://your-api-domain.com/api';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.244:3000';
// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Skip adding token for public endpoints
      const url = config.url || '';
      const isPublicEndpoint = url.includes('/auth/login') || url.includes('/auth/register');
      
      if (!isPublicEndpoint) {
        const token = await AsyncStorage.getItem('authToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const url = error.config?.url || '';
      
      // Only clear token on 401 if it's not a register endpoint
      if (status === 401 && !url.includes('/auth/register')) {
        // Unauthorized - clear token and redirect to login
        AsyncStorage.removeItem('authToken');
        // You might want to trigger a navigation to login here
      } else if (status === 403) {
        console.error('Access forbidden');
      } else if (status === 500) {
        console.error('Server error');
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error - no response received');
    } else {
      // Error in request setup
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
