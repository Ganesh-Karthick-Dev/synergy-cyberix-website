/**
 * API Configuration
 * Centralized configuration for API endpoints
 */

// Get API base URL - use production URL by default, fallback to localhost for development
export const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'https://backend.cyberixai.com'
}

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/register',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
    },
  },
  TIMEOUT: 10000, // 10 seconds
} as const

