import axios from 'axios';

// API URLs configuration - Railway as primary, Render as backup
const PRIMARY_API_URL = process.env.REACT_APP_PRIMARY_API_URL || 'https://expenses-app-production.up.railway.app';
const BACKUP_API_URL = process.env.REACT_APP_BACKUP_API_URL || 'https://expenses-app-agxa.onrender.com';
const LOCAL_API_URL = 'http://localhost:3001';

// Determine which API URL to use based on environment
const getApiUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return LOCAL_API_URL;
  }
  
  // In production, use PRIMARY_API_URL (Railway)
  return PRIMARY_API_URL;
};

const API_BASE_URL = getApiUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Keep track of API status
let isUsingBackup = false;

// Function to switch to backup API
const switchToBackupApi = () => {
  if (!isUsingBackup && process.env.NODE_ENV === 'production') {
    console.warn('Primary API (Railway) failed, switching to backup (Render)');
    apiClient.defaults.baseURL = BACKUP_API_URL;
    isUsingBackup = true;
    return true;
  }
  return false;
};

// Function to reset to primary API
const resetToPrimaryApi = () => {
  if (isUsingBackup && process.env.NODE_ENV === 'production') {
    console.log('Resetting to primary API (Railway)');
    apiClient.defaults.baseURL = PRIMARY_API_URL;
    isUsingBackup = false;
  }
};

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with failover logic
apiClient.interceptors.response.use(
  (response) => {
    // If we get a successful response and we're using backup, try to reset to primary on next request
    if (isUsingBackup && response.status === 200) {
      // Schedule a check to reset to primary API after some time
      setTimeout(() => {
        resetToPrimaryApi();
      }, 30000); // Wait 30 seconds before trying primary again
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Check if this is a network error or server error that might indicate API is down
    const isNetworkError = !error.response;
    const isServerError = error.response?.status >= 500;
    const isTimeoutError = error.code === 'ECONNABORTED';
    
    // If primary API fails and we haven't tried backup yet, try backup
    if ((isNetworkError || isServerError || isTimeoutError) && !originalRequest._retry && !isUsingBackup) {
      originalRequest._retry = true;
      
      if (switchToBackupApi()) {
        // Retry the request with backup API
        try {
          const response = await apiClient.request(originalRequest);
          return response;
        } catch (backupError) {
          console.error('Both primary (Railway) and backup (Render) APIs failed:', {
            primary: error.message,
            backup: backupError instanceof Error ? backupError.message : 'Unknown backup error'
          });
          return Promise.reject(backupError);
        }
      }
    }
    
    // Log the error with context about which API failed
    const apiSource = isUsingBackup ? 'Backup (Render)' : 'Primary (Railway)';
    console.error(`${apiSource} API Error:`, {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data || error.message,
      isUsingBackup
    });
    
    return Promise.reject(error);
  }
);
