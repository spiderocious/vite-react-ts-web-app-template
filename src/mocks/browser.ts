/**
 * MSW Browser Setup
 *
 * Setup Mock Service Worker for browser environment.
 */

import { setupWorker } from 'msw/browser';

import { handlers } from './handlers';

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers);

// Enable request interception in browser environment
export async function enableMocking() {
  if (typeof window === 'undefined') {
    console.warn('MSW browser setup called in non-browser environment');
    return;
  }

  // Start the worker
  await worker.start({
    onUnhandledRequest: 'warn',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });

  console.log('🔧 Mock Service Worker enabled');
}

// Disable request interception
export function disableMocking() {
  if (typeof window === 'undefined') {
    return;
  }

  worker.stop();
  console.log('🔧 Mock Service Worker disabled');
}

// Reset all handlers
export function resetHandlers() {
  worker.resetHandlers();
}

// Update runtime handlers
export function updateHandlers(newHandlers: Parameters<typeof worker.use>) {
  worker.use(...newHandlers);
}
