/**
 * API Type Definitions
 */

// Backend API Response Format
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: {
    message: string
    statusCode?: number
    code?: string
    details?: any
  }
}

// Authentication Types
export interface LoginCredentials {
  email: string
  password: string
  deviceInfo?: string
}

export interface User {
  id: string
  email: string
  role?: string
  isActive?: boolean
  firstName?: string
  lastName?: string
}

export interface LoginResponseData {
  user: User
}

export interface LoginResponse extends ApiResponse<LoginResponseData> {
  data: LoginResponseData
  // Note: accessToken and refreshToken are set as HTTP-only cookies by backend
  // They are not included in the response body
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  phone: string
  subscriptionType: 'FREE' | 'PRO' | 'ENTERPRISE'
}

export interface RegisterResponseData {
  user?: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    subscriptionType: string
    status: string
  }
  message?: string
}

export interface RegisterResponse extends ApiResponse<RegisterResponseData> {
  data: RegisterResponseData
}

// Error Types
export interface ApiError {
  message: string
  errors?: Record<string, string | string[]>
  field?: string
  status?: number
  statusCode?: number
  code?: string
}

