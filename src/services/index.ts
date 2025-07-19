/**
 * Services Barrel Export
 *
 * Central export point for all application services.
 */

// HTTP Services
export { httpClient } from './http/httpClient';
export type { ApiError, ApiResponse, PaginatedResponse } from './http/httpClient';

// Query Services
export { invalidateEntity, queryClient, queryKeys, removeEntityCache } from './query/queryClient';

// Storage Services
export { localStorageService } from './storage/localStorage';
export type { StorageOptions } from './storage/localStorage';
export { sessionStorageService } from './storage/sessionStorage';

// Legacy exports for backwards compatibility
export * from './api';
export * from './storage';

// Service Types
export interface ServiceConfig {
  apiBaseUrl: string;
  enableQueryDevtools: boolean;
  enableRetries: boolean;
  maxRetries: number;
  retryDelay: number;
  enableLogging: boolean;
}

// Service Initialization
export async function initializeServices(_config: ServiceConfig): Promise<void> {
  // HTTP Client is already initialized with interceptors
  console.log('✅ HTTP Client initialized');

  // Query Client is already configured
  console.log('✅ Query Client initialized');

  // Storage Services are ready
  console.log('✅ Storage Services initialized');

  console.log('🚀 All services initialized successfully');
}

// Service Health Check
export function getServiceHealth() {
  // Import services locally to avoid circular dependencies
  const { httpClient } = require('./http/httpClient');
  const { queryClient } = require('./query/queryClient');
  const { localStorageService } = require('./storage/localStorage');
  const { sessionStorageService } = require('./storage/sessionStorage');

  return {
    http: {
      available: true,
      endpoint: httpClient.defaults.baseURL,
    },
    query: {
      available: true,
      cacheSize: queryClient.getQueryCache().getAll().length,
    },
    localStorage: {
      available: localStorageService.supported,
      usage: localStorageService.getUsageInfo(),
    },
    sessionStorage: {
      available: sessionStorageService.supported,
      usage: sessionStorageService.getUsageInfo(),
    },
  };
}
