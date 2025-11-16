import apiClient from './client'
import { API_CONFIG } from './config'
import type { LoginCredentials, LoginResponse, RegisterPayload, RegisterResponse } from './types'
import Cookies from 'js-cookie'
import { cleanupFCM } from '@/lib/firebase/fcm'

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
    // Log the login payload (safely, without password)
    // Always include fcmToken in log (even if null/undefined)
    const safePayload: any = {
      email: credentials.email,
      password: '***', // Don't log actual password
      fcmToken: credentials.fcmToken 
        ? `${credentials.fcmToken.substring(0, 20)}...` 
        : (credentials.fcmToken === null ? null : undefined), // Preserve null vs undefined
    }
    console.log('[Auth] Login API Payload:', {
      endpoint: API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      fullUrl: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`,
      method: 'POST',
      payload: safePayload,
      hasDeviceInfo: !!credentials.deviceInfo,
      hasFcmToken: !!credentials.fcmToken,
    })
    console.log('[Auth] Full Login Payload (password hidden, FCM token partial):', JSON.stringify(safePayload, null, 2))
    
    const response = await apiClient.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials
    )
    
    console.log('[Auth] Login API Response:', {
      status: response.status,
      data: response.data,
    })
    
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
 * We clear readable cookies locally and remove FCM token
 */
export const logoutUser = async (): Promise<void> => {
  try {
    // IMPORTANT: Remove FCM token BEFORE calling logout endpoint
    // This ensures user is still authenticated for the FCM token removal API call
    console.log('[Auth] Starting logout process...')
    
    try {
      console.log('[Auth] Step 1: Removing FCM token...')
      await cleanupFCM()
      console.log('[Auth] ✅ FCM token removed successfully')
    } catch (error: any) {
      console.error('[Auth] ❌ FCM cleanup failed:', error)
      console.error('[Auth] Error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
      })
      // Continue with logout even if FCM cleanup fails
    }
    
    // Call logout endpoint - backend will clear HTTP-only cookies
    console.log('[Auth] Step 2: Calling logout endpoint...')
    await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT)
    console.log('[Auth] ✅ Logout successful - backend cleared HTTP-only cookies')
  } catch (error: any) {
    console.error('[Auth] ❌ Logout endpoint failed:', error)
    console.error('[Auth] Error details:', {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
    })
  } finally {
    // Always clear readable cookies regardless of API call result
    console.log('[Auth] Step 3: Clearing local cookies...')
    Cookies.remove('accessToken', { path: '/' })
    Cookies.remove('refreshToken', { path: '/' })
    Cookies.remove('isAuthenticated', { path: '/' })
    Cookies.remove('userEmail', { path: '/' })
    Cookies.remove('userName', { path: '/' })
    console.log('[Auth] ✅ All readable auth cookies cleared')
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

