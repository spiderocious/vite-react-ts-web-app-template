/**
 * Feature Flags Configuration
 *
 * Centralized feature flag management for conditional functionality
 * across development, staging, and production environments.
 */

import { env } from './env';

// ================================
// Feature Flag Definitions
// ================================

export interface FeatureFlags {
  // Development & Testing
  useMockServices: boolean;
  enableDevtools: boolean;
  debugMode: boolean;
  strictMode: boolean;

  // External Services
  useSentry: boolean;
  useAnalytics: boolean;
  useHotjar: boolean;

  // UI Features
  darkModeToggle: boolean;
  animationsEnabled: boolean;
  betaFeatures: boolean;

  // Performance
  enableServiceWorker: boolean;
  enableCodeSplitting: boolean;
  enableLazyLoading: boolean;

  // Security
  enforceHttps: boolean;
  enableCSP: boolean;
  logSecurityEvents: boolean;
}

// ================================
// Environment-Based Configuration
// ================================

const developmentFlags: FeatureFlags = {
  // Development & Testing
  useMockServices: true,
  enableDevtools: true,
  debugMode: true,
  strictMode: true,

  // External Services
  useSentry: false,
  useAnalytics: false,
  useHotjar: false,

  // UI Features
  darkModeToggle: true,
  animationsEnabled: true,
  betaFeatures: true,

  // Performance
  enableServiceWorker: false,
  enableCodeSplitting: false,
  enableLazyLoading: false,

  // Security
  enforceHttps: false,
  enableCSP: false,
  logSecurityEvents: true,
};

const stagingFlags: FeatureFlags = {
  // Development & Testing
  useMockServices: false,
  enableDevtools: true,
  debugMode: true,
  strictMode: true,

  // External Services
  useSentry: true,
  useAnalytics: false,
  useHotjar: false,

  // UI Features
  darkModeToggle: true,
  animationsEnabled: true,
  betaFeatures: true,

  // Performance
  enableServiceWorker: true,
  enableCodeSplitting: true,
  enableLazyLoading: true,

  // Security
  enforceHttps: true,
  enableCSP: true,
  logSecurityEvents: true,
};

const productionFlags: FeatureFlags = {
  // Development & Testing
  useMockServices: false,
  enableDevtools: false,
  debugMode: false,
  strictMode: true,

  // External Services
  useSentry: true,
  useAnalytics: true,
  useHotjar: true,

  // UI Features
  darkModeToggle: true,
  animationsEnabled: true,
  betaFeatures: false,

  // Performance
  enableServiceWorker: true,
  enableCodeSplitting: true,
  enableLazyLoading: true,

  // Security
  enforceHttps: true,
  enableCSP: true,
  logSecurityEvents: true,
};

// ================================
// Feature Flag Resolution
// ================================

/**
 * Get base feature flags for current environment
 */
function getBaseFlags(): FeatureFlags {
  if (env.IS_PRODUCTION) return productionFlags;
  if (env.IS_STAGING) return stagingFlags;
  return developmentFlags;
}

/**
 * Override flags with environment variables where available
 */
function applyEnvironmentOverrides(baseFlags: FeatureFlags): FeatureFlags {
  return {
    ...baseFlags,

    // Allow environment variable overrides
    useMockServices: env.USE_MOCK,
    enableDevtools: env.ENABLE_DEVTOOLS,
    debugMode: env.DEBUG_MODE,
    strictMode: env.STRICT_MODE,
    useSentry: env.USE_SENTRY,
    useAnalytics: env.USE_ANALYTICS,
    useHotjar: Boolean(env.HOTJAR_ID),
  };
}

// ================================
// Exported Configuration
// ================================

export const features = applyEnvironmentOverrides(getBaseFlags());

// ================================
// Utility Functions
// ================================

/**
 * Check if a specific feature is enabled
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return features[feature];
}

/**
 * Get all enabled features (for debugging)
 */
export function getEnabledFeatures(): string[] {
  return Object.entries(features)
    .filter(([, enabled]) => enabled)
    .map(([feature]) => feature);
}

/**
 * Get feature flags as a plain object (for logging)
 */
export function getFeaturesSnapshot(): Record<string, boolean> {
  return { ...features };
}

/**
 * Conditional feature execution
 */
export function withFeature<T>(
  feature: keyof FeatureFlags,
  callback: () => T,
  fallback?: () => T
): T | undefined {
  if (isFeatureEnabled(feature)) {
    return callback();
  }
  return fallback?.();
}

// ================================
// Development Logging
// ================================

if (env.DEBUG_MODE) {
  console.log('🎛️  Feature Flags Configuration:', {
    environment: env.IS_PRODUCTION ? 'production' : env.IS_STAGING ? 'staging' : 'development',
    enabledFeatures: getEnabledFeatures(),
    totalFlags: Object.keys(features).length,
  });
}

export default {
  features,
  isFeatureEnabled,
  getEnabledFeatures,
  getFeaturesSnapshot,
  withFeature,
};
