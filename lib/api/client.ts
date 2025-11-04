import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'
import { API_CONFIG } from './config'

/**
 * Create axios instance with default configuration
 * withCredentials: true is required for cookie-based authentication
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true, // Required for HTTP-only cookies (accessToken, refreshToken)
})

/**
 * Request Interceptor
 * Note: Backend uses HTTP-only cookies, so we don't need to manually add Authorization header
 * Cookies are automatically sent with withCredentials: true
 * But we can still add Authorization header as fallback if token exists in readable cookie
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get access token from cookie (if available as readable cookie)
    // Note: HTTP-only cookies can't be read by JavaScript, but backend sets both
    const token = Cookies.get('accessToken')
    
    // Add Authorization header if token exists (fallback for non-HTTP-only cookies)
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log request for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        withCredentials: config.withCredentials,
      })
    }
    
    return config
  },
  (error) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * Handles global error responses and token management
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log response for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      })
    }
    
    return response
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized - Clear auth cookies and redirect to login
    if (error.response?.status === 401) {
      // Clear any readable cookies (HTTP-only cookies are cleared by backend)
      Cookies.remove('accessToken', { path: '/' })
      Cookies.remove('refreshToken', { path: '/' })
      Cookies.remove('isAuthenticated', { path: '/' })
      
      // Only redirect if we're not already on the login page
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    
    // Log error for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('[API Response Error]', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
      })
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
export { API_CONFIG }

