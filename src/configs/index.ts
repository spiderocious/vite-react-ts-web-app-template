/**
 * Configuration Management
 *
 * Central export for all configuration modules.
 * Provides a single import point for environment variables,
 * API configuration, and feature flags.
 */

// Re-export all configuration modules
export { default as api, apiConfig, endpoints, featureFlags, mockConfig } from './api';
export { default as env, type EnvironmentConfig } from './env';
export { default as features, isFeatureEnabled, type FeatureFlags } from './features';

// ================================
// Convenience Exports
// ================================

import { apiConfig, endpoints, mockConfig } from './api';
import { env } from './env';
import { features, isFeatureEnabled } from './features';

/**
 * Complete application configuration
 */
export const config = {
  // Environment configuration
  env,

  // API configuration
  api: apiConfig,
  endpoints,
  mock: mockConfig,

  // Feature flags
  features,
  isFeatureEnabled,

  // Computed properties
  isDevelopment: env.IS_DEVELOPMENT,
  isProduction: env.IS_PRODUCTION,
  isStaging: env.IS_STAGING,
  useMocks: env.USE_MOCK,
} as const;

/**
 * Quick access to commonly used values
 */
export const { isDevelopment, isProduction, isStaging, useMocks } = config;

// ================================
// Configuration Validation
// ================================

/**
 * Validate configuration on startup
 */
export function validateConfiguration(): void {
  const errors: string[] = [];

  // Validate required production settings
  if (isProduction) {
    if (features.useSentry && !env.SENTRY_DSN) {
      errors.push('Sentry is enabled but SENTRY_DSN is not configured');
    }

    if (features.useAnalytics && !env.GA_TRACKING_ID) {
      errors.push('Analytics is enabled but GA_TRACKING_ID is not configured');
    }

    if (!env.API_BASE_URL.startsWith('https://')) {
      errors.push('Production API_BASE_URL should use HTTPS');
    }
  }

  // Validate API URLs
  try {
    new URL(env.API_BASE_URL);
  } catch {
    errors.push('Invalid API_BASE_URL format');
  }

  try {
    new URL(env.AUTH_BASE_URL);
  } catch {
    errors.push('Invalid AUTH_BASE_URL format');
  }

  // Log validation results
  if (errors.length > 0) {
    console.error('⚠️  Configuration Validation Errors:');
    errors.forEach((error) => {
      console.error(`   - ${error}`);
    });

    if (isProduction) {
      throw new Error('Configuration validation failed in production');
    }
  } else if (isDevelopment) {
    console.log('✅ Configuration validation passed');
  }
}

// Run validation on module load
validateConfiguration();

// ================================
// Default Export
// ================================

export default config;
