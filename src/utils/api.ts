import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import CONSTANTS from './constants';
import { useUserStore } from '../store/useUserStore';

// ============================================
// Safe helper to get auth token
// ============================================
const getAuthToken = (): string | null => {
  try {
    const storedUser = localStorage.getItem(CONSTANTS.AUTHENTICATED_USER_STORAGE_KEY);

    if (!storedUser) {
      return null;
    }

    const user = JSON.parse(storedUser);

    // Validate structure
    if (!user || typeof user !== 'object' || !user.token) {
      console.warn('Invalid user data in localStorage');
      localStorage.removeItem(CONSTANTS.AUTHENTICATED_USER_STORAGE_KEY);
      return null;
    }

    return user.token;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    // Clear corrupted data
    localStorage.removeItem(CONSTANTS.AUTHENTICATED_USER_STORAGE_KEY);
    return null;
  }
};

// ============================================
// Create axios instance
// ============================================
const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// ============================================
// Request interceptor - Add auth token
// ============================================
api.interceptors.request.use(
  config => {
    const token = getAuthToken();

    if (token) {
      // Set Authorization header (standard way)
      config.headers.Authorization = `Bearer ${token}`;
      // Also set custom header if your backend needs it
      config.headers['x-access-token'] = token;
    }

    return config;
  },
  error => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ============================================
// Response interceptor - Handle errors
// ============================================
api.interceptors.response.use(
  response => {
    // Successful response, just return it
    return response.data;
  },
  error => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;

      switch (status) {
        case 401: {
          // Unauthorized - clear user data and redirect to login
          console.warn('Unauthorized access - logging out');
          const { removeAuthenticatedUser } = useUserStore.getState();
          removeAuthenticatedUser();

          // Optional: redirect to login page
          if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        }

        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;

        case 404:
          // Not found
          console.error('Resource not found');
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          console.error('Server error:', error.response.data);
          break;

        default:
          console.error('API error:', error.response.data);
      }
    } else if (error.request) {
      // Request was made but no response received (network error)
      console.error('Network error - no response received:', error.message);
    } else {
      // Something else happened
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

// ============================================
// Type-safe API response interface
// ============================================
export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  status?: number;
}

// ============================================
// Wrapper function for type-safe API calls
// ============================================
export async function http<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<T> = await api(config);

    return {
      data: response.data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    const axiosError = error as AxiosError<any>;

    // Extract error message
    let errorMessage = 'An unexpected error occurred';

    if (axiosError.response) {
      // Server responded with error
      errorMessage =
        axiosError.response.data?.message ||
        axiosError.response.data?.error ||
        axiosError.response.statusText ||
        `Server error: ${axiosError.response.status}`;
    } else if (axiosError.request) {
      // No response received
      errorMessage = 'Network error - please check your connection';
    } else {
      // Request setup error
      errorMessage = axiosError.message || errorMessage;
    }

    return {
      data: null,
      error: errorMessage,
      status: axiosError.response?.status,
    };
  }
}

// ============================================
// Convenience methods for common HTTP verbs
// ============================================
export const apiClient = {
  get: <T>(url: string, config?: AxiosRequestConfig) => http<T>({ ...config, method: 'GET', url }),

  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    http<T>({ ...config, method: 'POST', url, data }),

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    http<T>({ ...config, method: 'PUT', url, data }),

  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    http<T>({ ...config, method: 'PATCH', url, data }),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    http<T>({ ...config, method: 'DELETE', url }),
};

export default api;
