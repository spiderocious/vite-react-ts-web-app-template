/**
 * MSW Node Setup
 *
 * Setup Mock Service Worker for Node.js environment (testing).
 */

import { setupServer } from 'msw/node';

import { handlers } from './handlers';

// This configures a request interception layer for Node.js
export const server = setupServer(...handlers);

// Setup for tests - call this in your test setup file
export function setupMSW() {
  // This should be called in a test setup file where beforeAll, afterEach, afterAll are available
  // Example usage in vitest.setup.ts or jest.setup.ts:
  /*
  import { setupMSW } from '@/mocks/node';
  setupMSW();
  */

  const globalThis = global as any;

  if (globalThis.beforeAll && globalThis.afterEach && globalThis.afterAll) {
    // Enable request interception before all tests
    globalThis.beforeAll(() => {
      server.listen({
        onUnhandledRequest: 'warn',
      });
    });

    // Reset handlers after each test `important for test isolation`
    globalThis.afterEach(() => {
      server.resetHandlers();
    });

    // Disable request interception after all tests
    globalThis.afterAll(() => {
      server.close();
    });
  } else {
    console.warn(
      'MSW setup called outside of test environment. Use startMockServer() and stopMockServer() manually.'
    );
  }
}

// Manual server controls for specific test scenarios
export function startMockServer() {
  server.listen({
    onUnhandledRequest: 'warn',
  });
  console.log('🔧 Mock server started for Node.js');
}

export function stopMockServer() {
  server.close();
  console.log('🔧 Mock server stopped');
}

export function resetMockHandlers() {
  server.resetHandlers();
}

export function updateMockHandlers(newHandlers: Parameters<typeof server.use>) {
  server.use(...newHandlers);
}
