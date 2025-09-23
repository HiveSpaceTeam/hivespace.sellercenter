import { getCurrentUser, login } from '@/auth/user-manager'
import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios'
import { useAppStore } from '@/stores/app'
import { config } from '@/config'
import i18n from '@/i18n'

// Extended request config for retry functionality
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
  _retryCount?: number
}

// API configuration interface
interface ApiConfig {
  readonly baseURL: string
  readonly timeout: number
  readonly retries: number
  readonly retryDelay: number
  readonly headers: Record<string, string>
}

// Default API configuration
const defaultConfig: ApiConfig = {
  baseURL: new URL('/api', config.api.baseUrl).toString(),
  timeout: config.api.timeout,
  retries: 3,
  retryDelay: 1000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
}

// Create axios instance with optimized configuration
const apiClient: AxiosInstance = axios.create({
  ...defaultConfig,
  validateStatus: (status) => status >= 200 && status < 300,
})

// Simple correlation ID generator
const generateCorrelationId = (): string =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// Simple retry utility
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

// Request interceptor with better error handling
apiClient.interceptors.request.use(
  async (requestConfig) => {
    try {
      const currentUser = await getCurrentUser()

      // Add authorization if available
      if (currentUser?.access_token) {
        requestConfig.headers.Authorization = `Bearer ${currentUser.access_token}`
      }

      // Add tracing headers
      requestConfig.headers['X-Correlation-ID'] = generateCorrelationId()
      requestConfig.headers['X-Request-Timestamp'] = new Date().toISOString()

      if (config.features.enableDebug) {
        console.log(`API Request: ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`)
      }

      return requestConfig
    } catch (error) {
      console.error('Request interceptor error:', error)
      return requestConfig
    }
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  },
)

// Response interceptor with better error handling and retry logic
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (config.features.enableDebug) {
      console.log(`API Response: ${response.status} ${response.config.url}`)
    }
    return response
  },
  async (error: AxiosError) => {
    const appStore = useAppStore()
    const originalRequest = error.config as ExtendedAxiosRequestConfig

    // Retry logic for network errors and 5xx errors
    if (originalRequest && !originalRequest._retry && shouldRetry(error)) {
      const retryCount = (originalRequest._retryCount || 0) + 1

      if (retryCount <= defaultConfig.retries) {
        originalRequest._retry = true
        originalRequest._retryCount = retryCount

        const delay = defaultConfig.retryDelay * Math.pow(2, retryCount - 1) // Exponential backoff
        await sleep(delay)

        console.log(
          `Retrying request (${retryCount}/${defaultConfig.retries}):`,
          originalRequest.url,
        )
        return apiClient(originalRequest)
      }
    }

    // Handle specific HTTP errors
    if (error.response) {
      handleHttpError(error.response.status, appStore)
      // Return only the ErrorResponse data that components care about
      return Promise.reject(error.response.data)
    } else if (error.request) {
      const title = i18n.global.t('errors.CONNECTION_ERROR.title')
      const message = i18n.global.t('errors.CONNECTION_ERROR.message')
      appStore.notifyError(title, message)
      return Promise.reject({ message })
    } else {
      const title = i18n.global.t('errors.REQUEST_ERROR.title')
      const message = i18n.global.t('errors.REQUEST_ERROR.message')
      appStore.notifyError(title, message)
      return Promise.reject({ message })
    }
  },
)

// Helper function to determine if request should be retried
const shouldRetry = (error: AxiosError): boolean => {
  if (!error.response) return true // Network error

  const status = error.response.status
  return status >= 500 || status === 408 || status === 429 // Server errors, timeout, rate limit
}

// Centralized HTTP error handling
const handleHttpError = (status: number, appStore: ReturnType<typeof useAppStore>): void => {
  switch (status) {
    case 401:
      login() // Redirect to login
      break
    case 403:
      appStore.notifyError(
        i18n.global.t('errors.ACCESS_DENIED.title'),
        i18n.global.t('errors.ACCESS_DENIED.message')
      )
      break
    case 429:
      appStore.notifyError(
        i18n.global.t('errors.TOO_MANY_REQUESTS.title'),
        i18n.global.t('errors.TOO_MANY_REQUESTS.message')
      )
      break
    case 500:
      appStore.notifyError(
        i18n.global.t('errors.SERVER_ERROR.title'),
        i18n.global.t('errors.SERVER_ERROR.message')
      )
      break
    case 502:
    case 503:
    case 504:
      appStore.notifyError(
        i18n.global.t('errors.SERVICE_UNAVAILABLE.title'),
        i18n.global.t('errors.SERVICE_UNAVAILABLE.message')
      )
      break
  }
}

// Optimized API service class
class ApiService {
  private client: AxiosInstance

  constructor(client: AxiosInstance) {
    this.client = client
  }

  // Generic request method with better error handling
  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.client(config)
    return response.data
  }

  // HTTP method implementations
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url })
  }

  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data })
  }

  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data })
  }

  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data })
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url })
  }

  // File operations with better error handling
  async uploadFile<T = unknown>(
    url: string,
    file: File,
    onUploadProgress?: (progress: number) => void,
  ): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    return this.request<T>({
      url,
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onUploadProgress
        ? (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onUploadProgress(progress)
          }
        }
        : undefined,
    })
  }

  async downloadFile(url: string, filename?: string): Promise<void> {
    const response = await this.client.get(url, { responseType: 'blob' })

    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()

    // Cleanup
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  }

  // Health check utility
  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health')
      return true
    } catch {
      return false
    }
  }
}

// Create and export the API service instance
export const apiService = new ApiService(apiClient)

// Export the axios instance for direct use if needed
export { apiClient }

// Export types
export type { ApiConfig }
