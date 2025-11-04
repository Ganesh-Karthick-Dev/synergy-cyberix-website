/**
 * API Type Definitions
 */

// Authentication Types
export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken?: string
  access_token?: string
  token?: string
  refreshToken?: string
  refresh_token?: string
  user?: {
    id: string
    email: string
    firstName?: string
    lastName?: string
  }
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  phone: string
  subscriptionType: 'FREE' | 'PRO' | 'ENTERPRISE'
}

export interface RegisterResponse {
  message?: string
  user?: {
    id: string
    email: string
    firstName: string
    lastName: string
  }
}

// Error Types
export interface ApiError {
  message: string
  errors?: Record<string, string | string[]>
  field?: string
  status?: number
}

