import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import { store } from '../store/store';
import { setLogout } from '../store/authslice';
import { CommonActions } from '@react-navigation/native';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to log the request URL during debug
// axiosInstance.interceptors.request.use(
//   (config) => {
//     console.log('Request URLss:', config.baseURL + config.url); // Log the full URL
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Navigation ref to be set from App.js
let navigationRef = null;

export const setNavigationRef = (ref) => {
  navigationRef = ref;
};

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

      // Navigate to auth screen if navigation ref is set
      if (navigationRef) {
        navigationRef.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Auth' }],
          })
        );
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;