import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { NextRequest } from 'next/server'
import { getApiBaseUrl } from './config'

/**
 * Server-side Axios client for Next.js API routes
 * This client is used in server-side API route handlers
 * It can forward cookies from Next.js requests to the backend
 */
export const createServerApiClient = (request?: NextRequest): AxiosInstance => {
  const client = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000,
    withCredentials: true,
  })

  // Request interceptor to forward cookies and auth headers
  client.interceptors.request.use(
    (config) => {
      // Forward cookies from Next.js request if available
      if (request) {
        const cookieHeader = request.headers.get('cookie')
        if (cookieHeader) {
          config.headers.Cookie = cookieHeader
        }

        // Get access token from cookies if available
        const cookies = request.cookies
        const accessToken = cookies.get('accessToken')?.value
        if (accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${accessToken}`
        }
      }

      return config
    },
    (error) => {
      console.error('[Server API Request Error]', error)
      return Promise.reject(error)
    }
  )

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      console.error('[Server API Response Error]', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
      })
      return Promise.reject(error)
    }
  )

  return client
}

/**
 * Helper function to make API requests from Next.js API routes
 * Automatically handles cookies and error responses
 */
export const serverApiRequest = async <T = any>(
  request: NextRequest,
  config: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const client = createServerApiClient(request)
  return client.request<T>(config)
}

