/**
 * HTTP Client Configuration
 *
 * Axios instance with interceptors for authentication, error handling,
 * and request/response transformation.
 */

import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

import { config } from '@/configs';

// ================================
// Types
// ================================

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ================================
// Token Management
// ================================

class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'access_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';

  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  static clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static isTokenExpired(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3 || !parts[1]) return true;

      const payload = JSON.parse(atob(parts[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}

// ================================
// HTTP Client Class
// ================================

class HttpClient {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: config.api.baseURL,
      timeout: config.api.timeout,
      headers: {
        ...config.api.defaultHeaders,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - attach auth token
    this.axiosInstance.interceptors.request.use(
      (requestConfig) => {
        const token = TokenManager.getAccessToken();
        if (token && !TokenManager.isTokenExpired(token)) {
          requestConfig.headers.Authorization = `Bearer ${token}`;
        }

        // Log requests in development
        if (config.env.DEBUG_MODE) {
          console.log('🌐 API Request:', {
            method: requestConfig.method?.toUpperCase(),
            url: requestConfig.url,
            data: requestConfig.data,
          });
        }

        return requestConfig;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle auth and errors
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log responses in development
        if (config.env.DEBUG_MODE) {
          console.log('✅ API Response:', {
            status: response.status,
            url: response.config.url,
            data: response.data,
          });
        }

        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Handle 401 - Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Queue the request while refreshing
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then((token) => {
              originalRequest.headers!.Authorization = `Bearer ${token}`;
              return this.axiosInstance(originalRequest);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = TokenManager.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            // Attempt token refresh
            const response = await this.refreshAccessToken(refreshToken);
            const { accessToken, refreshToken: newRefreshToken } = response.data;

            TokenManager.setTokens(accessToken, newRefreshToken);

            // Process queued requests
            this.failedQueue.forEach(({ resolve }) => {
              resolve(accessToken);
            });
            this.failedQueue = [];

            // Retry original request
            originalRequest.headers!.Authorization = `Bearer ${accessToken}`;
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            // Refresh failed - logout user
            this.failedQueue.forEach(({ reject }) => {
              reject(refreshError);
            });
            this.failedQueue = [];

            TokenManager.clearTokens();

            // Redirect to login or dispatch logout action
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login';
            }

            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle 403 - Forbidden
        if (error.response?.status === 403) {
          console.error('Access forbidden - insufficient permissions');
          if (typeof window !== 'undefined') {
            window.location.href = '/401';
          }
        }

        // Log errors in development
        if (config.env.DEBUG_MODE) {
          console.error('❌ API Error:', {
            status: error.response?.status,
            url: error.config?.url,
            message: error.message,
            data: error.response?.data,
          });
        }

        // Transform error for consistent handling
        const apiError: ApiError = {
          message:
            (error.response?.data as any)?.message ||
            error.message ||
            'An unexpected error occurred',
          code: (error.response?.data as any)?.code || error.code,
          details: (error.response?.data as any)?.details,
          timestamp: new Date().toISOString(),
        };

        return Promise.reject(apiError);
      }
    );
  }

  private async refreshAccessToken(refreshToken: string): Promise<AxiosResponse> {
    return axios.post(`${config.api.authURL}/auth/refresh`, {
      refreshToken,
    });
  }

  // ================================
  // HTTP Methods
  // ================================

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  // ================================
  // Utility Methods
  // ================================

  /**
   * Upload file with progress tracking
   */
  async uploadFile<T = any>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.axiosInstance.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data;
  }

  /**
   * Download file
   */
  async downloadFile(url: string, filename?: string): Promise<void> {
    const response = await this.axiosInstance.get(url, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  /**
   * Cancel all pending requests
   */
  cancelAllRequests(): void {
    // Implementation would depend on axios cancel token usage
    console.log('Cancelling all pending requests...');
  }

  /**
   * Get the underlying axios instance
   */
  getInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// ================================
// Export
// ================================

export const httpClient = new HttpClient();
export { TokenManager };
export default httpClient;
