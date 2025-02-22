import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import { store } from '../store/store';
import { setLogout } from '../store/authslice';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get token from storage
    const token = await AsyncStorage.getItem('token');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear storage and logout
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user_details');
      await AsyncStorage.removeItem('unit_id');
      
      // Dispatch logout action
      store.dispatch(setLogout());

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;