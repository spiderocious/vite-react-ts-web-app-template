/**
 * Utility functions index
 */

// Export all utility modules
export * from './common';
export * from './css';
export * from './date';
export * from './dom';
export * from './formatting';
export * from './performance';
export * from './validation';

// Re-export commonly used functions with shorter names
export { cn } from './css';
export { formatCurrency, formatNumber, formatFileSize } from './formatting';
export { formatDate, formatTime, formatRelativeTime } from './date';
export { debounce, throttle, generateId, sleep } from './common';
