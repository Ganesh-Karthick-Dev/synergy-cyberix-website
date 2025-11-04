import apiClient from './client'
import { API_CONFIG } from './config'
import type { LoginCredentials, LoginResponse, RegisterPayload, RegisterResponse } from './types'
import Cookies from 'js-cookie'

/**
 * Authentication API Functions
 */

/**
 * Login user with email and password
 * Saves access token and refresh token to cookies
 */
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials
    )
    
    const data = response.data
    
    // Extract and save access token to cookies
    const accessToken = data.accessToken || data.access_token || data.token
    if (accessToken) {
      Cookies.set('accessToken', accessToken, {
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      })
      console.log('[Auth] Access token saved to cookie')
    } else {
      console.warn('[Auth] No access token found in response:', data)
    }
    
    // Extract and save refresh token to cookies (if provided)
    const refreshToken = data.refreshToken || data.refresh_token
    if (refreshToken) {
      Cookies.set('refreshToken', refreshToken, {
        expires: 30, // 30 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      })
      console.log('[Auth] Refresh token saved to cookie')
    }
    
    // Save user info to cookies for profile display
    if (data.user) {
      if (data.user.email) {
        Cookies.set('userEmail', data.user.email, {
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
        })
      }
      if (data.user.firstName || data.user.lastName) {
        const fullName = `${data.user.firstName || ''} ${data.user.lastName || ''}`.trim()
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
    
    return data
  } catch (error) {
    console.error('[Auth] Login error:', error)
    throw error
  }
}

/**
 * Register new user
 */
export const registerUser = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>(
    API_CONFIG.ENDPOINTS.AUTH.REGISTER,
    payload
  )
  return response.data
}

/**
 * Logout user (clears tokens from cookies)
 */
export const logoutUser = async (): Promise<void> => {
  try {
    // Call logout endpoint if available
    await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT)
  } catch (error) {
    console.warn('[Auth] Logout endpoint failed, clearing cookies locally:', error)
  } finally {
    // Always clear cookies regardless of API call result
    Cookies.remove('accessToken', { path: '/' })
    Cookies.remove('refreshToken', { path: '/' })
    Cookies.remove('userEmail', { path: '/' })
    Cookies.remove('userName', { path: '/' })
    console.log('[Auth] All auth cookies cleared')
  }
}

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (): Promise<LoginResponse> => {
  const refreshToken = Cookies.get('refreshToken')
  
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }
  
  const response = await apiClient.post<LoginResponse>(API_CONFIG.ENDPOINTS.AUTH.REFRESH, {
    refreshToken,
  })
  
  const data = response.data
  const accessToken = data.accessToken || data.access_token || data.token
  
  if (accessToken) {
    Cookies.set('accessToken', accessToken, {
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    })
    console.log('[Auth] Access token refreshed and saved to cookie')
  }
  
  return data
}

