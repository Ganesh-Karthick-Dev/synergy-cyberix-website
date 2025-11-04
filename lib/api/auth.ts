import apiClient from './client'
import { API_CONFIG } from './config'
import type { LoginCredentials, LoginResponse, RegisterPayload, RegisterResponse } from './types'
import Cookies from 'js-cookie'

/**
 * Authentication API Functions
 */

/**
 * Login user with email and password
 * Backend sets accessToken and refreshToken as HTTP-only cookies automatically
 * We only need to save user info to readable cookies for display purposes
 */
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials
    )
    
    const data = response.data
    
    // Note: Backend sets accessToken and refreshToken as HTTP-only cookies
    // These cannot be read by JavaScript, but they are automatically sent with requests
    // We can check if authentication was successful by checking the isAuthenticated cookie
    
    // Save user info to readable cookies for profile display (optional)
    if (data.data?.user) {
      const user = data.data.user
      if (user.email) {
        Cookies.set('userEmail', user.email, {
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
        })
      }
      if (user.firstName || user.lastName) {
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim()
        if (fullName) {
          Cookies.set('userName', fullName, {
            expires: 7,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
          })
        }
      }
      console.log('[Auth] User info saved to cookies')
    }
    
    console.log('[Auth] Login successful - tokens set as HTTP-only cookies by backend')
    return data
  } catch (error) {
    console.error('[Auth] Login error:', error)
    throw error
  }
}

/**
 * Register new user
 * Backend sends registration confirmation and user data
 */
export const registerUser = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  try {
    const response = await apiClient.post<RegisterResponse>(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      payload
    )
    console.log('[Auth] Registration successful')
    return response.data
  } catch (error) {
    console.error('[Auth] Registration error:', error)
    throw error
  }
}

/**
 * Logout user
 * Backend clears HTTP-only cookies (accessToken, refreshToken)
 * We clear readable cookies locally
 */
export const logoutUser = async (): Promise<void> => {
  try {
    // Call logout endpoint - backend will clear HTTP-only cookies
    await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT)
    console.log('[Auth] Logout successful - backend cleared HTTP-only cookies')
  } catch (error) {
    console.warn('[Auth] Logout endpoint failed, clearing local cookies:', error)
  } finally {
    // Always clear readable cookies regardless of API call result
    Cookies.remove('accessToken', { path: '/' })
    Cookies.remove('refreshToken', { path: '/' })
    Cookies.remove('isAuthenticated', { path: '/' })
    Cookies.remove('userEmail', { path: '/' })
    Cookies.remove('userName', { path: '/' })
    console.log('[Auth] All readable auth cookies cleared')
  }
}

/**
 * Refresh access token using refresh token
 * Backend handles token refresh via HTTP-only cookies
 */
export const refreshAccessToken = async (): Promise<LoginResponse> => {
  try {
    // Backend reads refreshToken from HTTP-only cookie automatically
    // We don't need to send it in the request body
    const response = await apiClient.post<LoginResponse>(API_CONFIG.ENDPOINTS.AUTH.REFRESH)
    
    console.log('[Auth] Access token refreshed - backend set new tokens as HTTP-only cookies')
    return response.data
  } catch (error) {
    console.error('[Auth] Token refresh error:', error)
    throw error
  }
}

/**
 * Check if user is authenticated
 * Checks for isAuthenticated cookie set by backend
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false
  return Cookies.get('isAuthenticated') === 'true'
}

/**
 * Get user email from cookie (if available)
 */
export const getUserEmail = (): string | undefined => {
  return Cookies.get('userEmail')
}

/**
 * Get user name from cookie (if available)
 */
export const getUserName = (): string | undefined => {
  return Cookies.get('userName')
}

