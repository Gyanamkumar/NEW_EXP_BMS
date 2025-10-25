// src/services/api.js
import axios from 'axios';

// 1. YOUR BACKEND TEAM'S CODE (WITH 2 FIXES)
// ===========================================
const BACKEND_URL = 'https://723pdrnt-8000.inc1.devtunnels.ms/';
const apiClient = axios.create({
  // FIX 1: Use Vite's 'import.meta.env' instead of 'process.env'
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  
  // FIX 2: Removed 'Content-Type': 'multipart/form-data'.
  // Axios is smart and will add this header *automatically*
  // when you send FormData. Setting it here can break
  // your other JSON requests (like GET /stats).
  
  timeout: 30000, // 30 seconds
});

// Request interceptor (for logging)
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (for error handling)
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response; // Pass on the successful response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error); // Pass on the error
  }
);

// 2. HELPER FUNCTIONS FROM YOUR PREVIOUS API
// ==========================================
// These functions now use the 'apiClient' you just configured.

// Health check
export const healthCheck = async () => {
  const response = await apiClient.get('/api/health');
  return response.data; // Interceptor already gives us 'response'
};

// Enroll user
export const enrollUser = async (userId, audioFile) => {
  const formData = new FormData();
  formData.append('user_id', userId);
  formData.append('file', audioFile);

  // apiClient will automatically set Content-Type to multipart/form-data
  const response = await apiClient.post('/api/auth/enroll', formData);
  return response.data;
};

// Verify user
export const verifyUser = async (userId, audioFile) => {
  const formData = new FormData();
  formData.append('user_id', userId);
  formData.append('file', audioFile);

  const response = await apiClient.post('/api/auth/verify', formData);
  return response.data;
};

// Log alert
export const logAlert = async (userId, alertType, message = null) => {
  const formData = new FormData();
  formData.append('user_id', userId);
  formData.append('alert_type', alertType);
  if (message) formData.append('message', message);

  const response = await apiClient.post('/api/alerts', formData);
  return response.data;
};


// 3. EXPORT THE 'apiClient' AS THE DEFAULT
// =========================================
// This ensures your Dashboard.jsx (which uses `import api from '...'`)
// will work without any changes.
export default apiClient;