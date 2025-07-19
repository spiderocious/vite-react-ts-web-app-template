/**
 * Environment variable validation and parsing
 *
 * This module validates all environment variables at startup and provides
 * type-safe access to configuration values throughout the application.
 */

// ================================
// Type Definitions
// ================================

export interface EnvironmentConfig {
  // Feature flags
  USE_MOCK: boolean;
  USE_SENTRY: boolean;
  DISABLE_CONSOLE_LOG: boolean;
  ENABLE_DEVTOOLS: boolean;
  USE_ANALYTICS: boolean;

  // API configuration
  API_BASE_URL: string;
  AUTH_BASE_URL: string;
  WS_URL: string;
  CDN_URL: string;

  // Authentication
  TOKEN_EXPIRY: number; // minutes
  REFRESH_TOKEN_EXPIRY: number; // days

  // Monitoring & Analytics
  SENTRY_DSN: string;
  SENTRY_ENVIRONMENT: string;
  GA_TRACKING_ID: string;
  HOTJAR_ID: string;
  ANALYTICS_ENDPOINT: string;

  // UI Configuration
  APP_NAME: string;
  APP_VERSION: string;
  DEFAULT_THEME: 'light' | 'dark' | 'system';

  // Performance
  API_TIMEOUT: number; // milliseconds
  MOCK_DELAY: number; // milliseconds
  MAX_FILE_SIZE: number; // MB

  // Development
  DEBUG_MODE: boolean;
  STRICT_MODE: boolean;
  PORT: number;

  // Computed properties
  IS_DEVELOPMENT: boolean;
  IS_PRODUCTION: boolean;
  IS_STAGING: boolean;
}

// ================================
// Validation Helpers
// ================================

/**
 * Parse boolean from string with validation
 */
function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
}

/**
 * Parse number from string with validation
 */
function parseNumber(value: string | undefined, defaultValue: number): number {
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Parse string with fallback
 */
function parseString(value: string | undefined, defaultValue: string): string {
  return value?.trim() || defaultValue;
}

/**
 * Validate theme value
 */
function parseTheme(value: string | undefined): 'light' | 'dark' | 'system' {
  const validThemes = ['light', 'dark', 'system'] as const;
  return validThemes.includes(value as any) ? (value as any) : 'system';
}

/**
 * Validate URL format
 */
function validateUrl(url: string, name: string): string {
  try {
    new URL(url);
    return url;
  } catch {
    console.warn(`⚠️  Invalid URL for ${name}: ${url}`);
    return url; // Return as-is for development flexibility
  }
}

// ================================
// Environment Validation
// ================================

/**
 * Validate and parse all environment variables
 * Throws error if critical variables are missing or invalid
 */
function validateEnvironment(): EnvironmentConfig {
  const NODE_ENV = import.meta.env.MODE;
  const IS_DEVELOPMENT = NODE_ENV === 'development';
  const IS_PRODUCTION = NODE_ENV === 'production';
  const IS_STAGING = NODE_ENV === 'staging';

  // Feature flags
  const USE_MOCK = parseBoolean(import.meta.env['VITE_USE_MOCK'], IS_DEVELOPMENT);
  const USE_SENTRY = parseBoolean(import.meta.env['VITE_USE_SENTRY'], IS_PRODUCTION);
  const DISABLE_CONSOLE_LOG = parseBoolean(
    import.meta.env['VITE_DISABLE_CONSOLE_LOG'],
    IS_PRODUCTION
  );
  const ENABLE_DEVTOOLS = parseBoolean(import.meta.env['VITE_ENABLE_DEVTOOLS'], IS_DEVELOPMENT);
  const USE_ANALYTICS = parseBoolean(import.meta.env['VITE_USE_ANALYTICS'], IS_PRODUCTION);

  // API configuration
  const API_BASE_URL = validateUrl(
    parseString(import.meta.env['VITE_API_BASE_URL'], 'http://localhost:3000/api'),
    'VITE_API_BASE_URL'
  );
  const AUTH_BASE_URL = validateUrl(
    parseString(import.meta.env['VITE_AUTH_BASE_URL'], 'http://localhost:3000/auth'),
    'VITE_AUTH_BASE_URL'
  );
  const WS_URL = parseString(import.meta.env['VITE_WS_URL'], 'ws://localhost:3000/ws');
  const CDN_URL = validateUrl(
    parseString(import.meta.env['VITE_CDN_URL'], 'http://localhost:3000/assets'),
    'VITE_CDN_URL'
  );

  // Authentication
  const TOKEN_EXPIRY = parseNumber(import.meta.env['VITE_TOKEN_EXPIRY'], 60);
  const REFRESH_TOKEN_EXPIRY = parseNumber(import.meta.env['VITE_REFRESH_TOKEN_EXPIRY'], 7);

  // Monitoring & Analytics
  const SENTRY_DSN = parseString(import.meta.env['VITE_SENTRY_DSN'], '');
  const SENTRY_ENVIRONMENT = parseString(import.meta.env['VITE_SENTRY_ENVIRONMENT'], NODE_ENV);
  const GA_TRACKING_ID = parseString(import.meta.env['VITE_GA_TRACKING_ID'], '');
  const HOTJAR_ID = parseString(import.meta.env['VITE_HOTJAR_ID'], '');
  const ANALYTICS_ENDPOINT = parseString(import.meta.env['VITE_ANALYTICS_ENDPOINT'], '');

  // UI Configuration
  const APP_NAME = parseString(import.meta.env['VITE_APP_NAME'], 'Frontend Template');
  const APP_VERSION = parseString(import.meta.env['VITE_APP_VERSION'], '1.0.0');
  const DEFAULT_THEME = parseTheme(import.meta.env['VITE_DEFAULT_THEME']);

  // Performance
  const API_TIMEOUT = parseNumber(import.meta.env['VITE_API_TIMEOUT'], 10000);
  const MOCK_DELAY = parseNumber(import.meta.env['VITE_MOCK_DELAY'], 1000);
  const MAX_FILE_SIZE = parseNumber(import.meta.env['VITE_MAX_FILE_SIZE'], 10);

  // Development
  const DEBUG_MODE = parseBoolean(import.meta.env['VITE_DEBUG_MODE'], IS_DEVELOPMENT);
  const STRICT_MODE = parseBoolean(import.meta.env['VITE_STRICT_MODE'], true);
  const PORT = parseNumber(import.meta.env['VITE_PORT'], 3001);

  // Validation warnings for production
  if (IS_PRODUCTION) {
    if (USE_SENTRY && !SENTRY_DSN) {
      console.warn('⚠️  Sentry is enabled but VITE_SENTRY_DSN is not configured');
    }
    if (USE_ANALYTICS && !GA_TRACKING_ID) {
      console.warn('⚠️  Analytics is enabled but VITE_GA_TRACKING_ID is not configured');
    }
  }

  return {
    // Feature flags
    USE_MOCK,
    USE_SENTRY,
    DISABLE_CONSOLE_LOG,
    ENABLE_DEVTOOLS,
    USE_ANALYTICS,

    // API configuration
    API_BASE_URL,
    AUTH_BASE_URL,
    WS_URL,
    CDN_URL,

    // Authentication
    TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY,

    // Monitoring & Analytics
    SENTRY_DSN,
    SENTRY_ENVIRONMENT,
    GA_TRACKING_ID,
    HOTJAR_ID,
    ANALYTICS_ENDPOINT,

    // UI Configuration
    APP_NAME,
    APP_VERSION,
    DEFAULT_THEME,

    // Performance
    API_TIMEOUT,
    MOCK_DELAY,
    MAX_FILE_SIZE,

    // Development
    DEBUG_MODE,
    STRICT_MODE,
    PORT,

    // Computed properties
    IS_DEVELOPMENT,
    IS_PRODUCTION,
    IS_STAGING,
  };
}

// ================================
// Exports
// ================================

// Validate environment on module load
export const env = validateEnvironment();

// Log configuration in development
if (env.DEBUG_MODE) {
  console.log('🔧 Environment Configuration:', {
    NODE_ENV: import.meta.env.MODE,
    USE_MOCK: env.USE_MOCK,
    USE_SENTRY: env.USE_SENTRY,
    API_BASE_URL: env.API_BASE_URL,
    AUTH_BASE_URL: env.AUTH_BASE_URL,
  });
}

// Disable console.log in production if configured
if (env.DISABLE_CONSOLE_LOG && env.IS_PRODUCTION) {
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
  // Keep console.error for critical debugging
}

export default env;
