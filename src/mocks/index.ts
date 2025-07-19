/**
 * MSW Configuration
 *
 * Main configuration for Mock Service Worker.
 */

import { config } from '@/configs';

// ================================
// MSW Configuration
// ================================

export const mswConfig = {
  enabled: config.isDevelopment || process.env['NODE_ENV'] === 'test',
  baseUrl: config.api.baseURL,
  enableErrors: config.isDevelopment,
  errorRate: 0.1, // 10% error rate for testing error handling
  networkDelay: {
    min: config.isDevelopment ? 200 : 100,
    max: config.isDevelopment ? 1000 : 300,
  },
  scenarios: {
    // Different mock scenarios for testing
    default: 'normal',
    available: ['normal', 'slow', 'errors', 'offline'] as const,
  },
};

// ================================
// Mock Scenarios
// ================================

export type MockScenario = (typeof mswConfig.scenarios.available)[number];

export function setMockScenario(scenario: MockScenario) {
  switch (scenario) {
    case 'normal':
      // Default behavior
      break;
    case 'slow':
      // Simulate slow network
      mswConfig.networkDelay.min = 2000;
      mswConfig.networkDelay.max = 5000;
      break;
    case 'errors':
      // Increase error rate
      mswConfig.errorRate = 0.5;
      break;
    case 'offline':
      // Simulate offline mode
      mswConfig.errorRate = 1.0;
      break;
  }

  console.log(`🔧 MSW scenario set to: ${scenario}`);
}

// ================================
// Browser MSW Setup
// ================================

export async function initializeMSW() {
  if (!mswConfig.enabled) {
    console.log('🔧 MSW is disabled');
    return;
  }

  if (typeof window !== 'undefined') {
    // Browser environment
    const { enableMocking } = await import('./browser');
    await enableMocking();
  } else {
    // Node.js environment (for SSR)
    console.log('🔧 MSW not initialized in Node.js environment');
  }
}

// ================================
// Development Tools
// ================================

if (typeof window !== 'undefined' && config.isDevelopment) {
  // Add MSW controls to window for debugging
  (window as any).msw = {
    async enable() {
      const { enableMocking } = await import('./browser');
      await enableMocking();
    },
    async disable() {
      const { disableMocking } = await import('./browser');
      disableMocking();
    },
    setScenario: setMockScenario,
    config: mswConfig,
  };

  console.log('🔧 MSW development tools available at window.msw');
}
