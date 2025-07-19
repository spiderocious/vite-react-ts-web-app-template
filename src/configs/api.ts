/**
 * API Configuration Module
 *
 * Centralizes API-related configuration including base URLs,
 * timeout settings, and service endpoints.
 */

import { env } from './env';

// ================================
// API Base Configuration
// ================================

export const apiConfig = {
  // Base URLs
  baseURL: env.API_BASE_URL,
  authURL: env.AUTH_BASE_URL,
  wsURL: env.WS_URL,
  cdnURL: env.CDN_URL,

  // Request configuration
  timeout: env.API_TIMEOUT,
  retryAttempts: 3,
  retryDelay: 1000, // milliseconds

  // Headers
  defaultHeaders: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },

  // File upload
  maxFileSize: env.MAX_FILE_SIZE * 1024 * 1024, // Convert MB to bytes
  allowedFileTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/csv',
    'application/json',
  ],
} as const;

// ================================
// API Endpoints
// ================================

export const endpoints = {
  // Authentication
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/auth/register',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
  },

  // User management
  users: {
    list: '/users',
    create: '/users',
    get: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
    avatar: (id: string) => `/users/${id}/avatar`,
  },

  // File management
  files: {
    upload: '/files/upload',
    download: (id: string) => `/files/${id}`,
    delete: (id: string) => `/files/${id}`,
  },

  // Example resources (customize for your app)
  posts: {
    list: '/posts',
    create: '/posts',
    get: (id: string) => `/posts/${id}`,
    update: (id: string) => `/posts/${id}`,
    delete: (id: string) => `/posts/${id}`,
  },

  // System
  health: '/health',
  version: '/version',
} as const;

// ================================
// Mock Configuration
// ================================

export const mockConfig = {
  enabled: env.USE_MOCK,
  delay: env.MOCK_DELAY,

  // Error simulation rates (0-1)
  errorRates: {
    network: 0.05, // 5% network errors
    server: 0.02, // 2% server errors
    auth: 0.01, // 1% auth errors
  },

  // Mock data configuration
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
} as const;

// ================================
// Feature Flag Configuration
// ================================

export const featureFlags = {
  useMockServices: env.USE_MOCK,
  enableDevtools: env.ENABLE_DEVTOOLS,
  useAnalytics: env.USE_ANALYTICS,
  useSentry: env.USE_SENTRY,
  debugMode: env.DEBUG_MODE,
} as const;

// ================================
// Computed Configuration
// ================================

/**
 * Get the complete API URL for an endpoint
 */
export function getApiUrl(endpoint: string): string {
  return `${apiConfig.baseURL}${endpoint}`;
}

/**
 * Get the complete auth URL for an endpoint
 */
export function getAuthUrl(endpoint: string): string {
  return `${apiConfig.authURL}${endpoint}`;
}

/**
 * Get CDN URL for an asset
 */
export function getCdnUrl(assetPath: string): string {
  return `${apiConfig.cdnURL}/${assetPath.replace(/^\//, '')}`;
}

/**
 * Check if we're in development mode with specific feature enabled
 */
export function isFeatureEnabled(feature: keyof typeof featureFlags): boolean {
  return featureFlags[feature];
}

export default {
  api: apiConfig,
  endpoints,
  mock: mockConfig,
  features: featureFlags,
  getApiUrl,
  getAuthUrl,
  getCdnUrl,
  isFeatureEnabled,
};
