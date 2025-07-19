/**
 * Local Storage Service
 *
 * Type-safe localStorage abstraction with JSON serialization,
 * error handling, and reactive updates.
 */

// ================================
// Types
// ================================

export interface StorageOptions {
  expiry?: number; // Expiry time in milliseconds
  encrypt?: boolean; // Whether to encrypt the data (future enhancement)
}

interface StorageItem<T> {
  data: T;
  timestamp: number;
  expiry?: number;
}

type StorageListener<T> = (newValue: T | null, oldValue: T | null, key: string) => void;

// ================================
// Storage Service Class
// ================================

class LocalStorageService {
  private listeners = new Map<string, Set<StorageListener<any>>>();
  private isSupported: boolean;

  constructor() {
    this.isSupported = this.checkSupport();

    // Listen for storage events from other tabs
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.handleStorageEvent.bind(this));
    }
  }

  /**
   * Check if localStorage is supported and available
   */
  private checkSupport(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }

      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, 'test');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Handle storage events from other tabs
   */
  private handleStorageEvent(event: StorageEvent): void {
    if (!event.key) return;

    const listeners = this.listeners.get(event.key);
    if (!listeners || listeners.size === 0) return;

    try {
      const oldValue = event.oldValue ? this.deserializeItem(event.oldValue) : null;
      const newValue = event.newValue ? this.deserializeItem(event.newValue) : null;

      listeners.forEach((listener) => {
        try {
          listener(newValue?.data || null, oldValue?.data || null, event.key!);
        } catch (error) {
          console.error('Error in storage listener:', error);
        }
      });
    } catch (error) {
      console.error('Error handling storage event:', error);
    }
  }

  /**
   * Serialize data with metadata
   */
  private serializeItem<T>(data: T, options?: StorageOptions): string {
    const item: StorageItem<T> = {
      data,
      timestamp: Date.now(),
    };

    if (options?.expiry) {
      item.expiry = Date.now() + options.expiry;
    }

    return JSON.stringify(item);
  }

  /**
   * Deserialize data and check expiry
   */
  private deserializeItem<T>(serialized: string): StorageItem<T> | null {
    try {
      const item: StorageItem<T> = JSON.parse(serialized);

      // Check if item has expired
      if (item.expiry && Date.now() > item.expiry) {
        return null;
      }

      return item;
    } catch {
      return null;
    }
  }

  /**
   * Set item in localStorage
   */
  setItem<T>(key: string, value: T, options?: StorageOptions): boolean {
    if (!this.isSupported) {
      console.warn('localStorage is not supported');
      return false;
    }

    try {
      const oldValue = this.getItem<T>(key);
      const serialized = this.serializeItem(value, options);

      window.localStorage.setItem(key, serialized);

      // Notify listeners
      this.notifyListeners(key, value, oldValue);

      return true;
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded');
        this.handleQuotaExceeded();
      } else {
        console.error('Error setting localStorage item:', error);
      }
      return false;
    }
  }

  /**
   * Get item from localStorage
   */
  getItem<T>(key: string): T | null {
    if (!this.isSupported) {
      return null;
    }

    try {
      const serialized = window.localStorage.getItem(key);
      if (!serialized) return null;

      const item = this.deserializeItem<T>(serialized);
      if (!item) {
        // Item expired or invalid, remove it
        this.removeItem(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.error('Error getting localStorage item:', error);
      return null;
    }
  }

  /**
   * Remove item from localStorage
   */
  removeItem(key: string): boolean {
    if (!this.isSupported) {
      return false;
    }

    try {
      const oldValue = this.getItem(key);
      window.localStorage.removeItem(key);

      // Notify listeners
      this.notifyListeners(key, null, oldValue);

      return true;
    } catch (error) {
      console.error('Error removing localStorage item:', error);
      return false;
    }
  }

  /**
   * Clear all localStorage items
   */
  clear(): boolean {
    if (!this.isSupported) {
      return false;
    }

    try {
      window.localStorage.clear();

      // Notify all listeners
      this.listeners.forEach((_, key) => {
        this.notifyListeners(key, null, null);
      });

      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  /**
   * Get all keys in localStorage
   */
  getAllKeys(): string[] {
    if (!this.isSupported) {
      return [];
    }

    try {
      return Object.keys(window.localStorage);
    } catch (error) {
      console.error('Error getting localStorage keys:', error);
      return [];
    }
  }

  /**
   * Get storage usage information
   */
  getUsageInfo(): { used: number; remaining: number } | null {
    if (!this.isSupported) {
      return null;
    }

    try {
      const totalSize = JSON.stringify(window.localStorage).length;
      const approximateLimit = 5 * 1024 * 1024; // 5MB typical limit

      return {
        used: totalSize,
        remaining: approximateLimit - totalSize,
      };
    } catch (error) {
      console.error('Error getting storage usage:', error);
      return null;
    }
  }

  /**
   * Subscribe to changes for a specific key
   */
  subscribe<T>(key: string, listener: StorageListener<T>): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }

    this.listeners.get(key)!.add(listener);

    // Return unsubscribe function
    return () => {
      const keyListeners = this.listeners.get(key);
      if (keyListeners) {
        keyListeners.delete(listener);
        if (keyListeners.size === 0) {
          this.listeners.delete(key);
        }
      }
    };
  }

  /**
   * Check if key exists in storage
   */
  hasItem(key: string): boolean {
    if (!this.isSupported) {
      return false;
    }

    try {
      return window.localStorage.getItem(key) !== null;
    } catch (error) {
      console.error('Error checking localStorage item:', error);
      return false;
    }
  }

  /**
   * Update item using a function
   */
  updateItem<T>(key: string, updater: (current: T | null) => T): boolean {
    const currentValue = this.getItem<T>(key);
    const newValue = updater(currentValue);
    return this.setItem(key, newValue);
  }

  /**
   * Notify listeners of changes
   */
  private notifyListeners<T>(key: string, newValue: T | null, oldValue: T | null): void {
    const listeners = this.listeners.get(key);
    if (!listeners || listeners.size === 0) return;

    listeners.forEach((listener) => {
      try {
        listener(newValue, oldValue, key);
      } catch (error) {
        console.error('Error in storage listener:', error);
      }
    });
  }

  /**
   * Handle quota exceeded error
   */
  private handleQuotaExceeded(): void {
    console.warn('localStorage quota exceeded, attempting cleanup...');

    // Strategy: Remove expired items
    const keys = this.getAllKeys();
    let cleanedUp = false;

    keys.forEach((key) => {
      try {
        const serialized = window.localStorage.getItem(key);
        if (serialized) {
          const item = this.deserializeItem(serialized);
          if (!item) {
            // Item expired or invalid
            window.localStorage.removeItem(key);
            cleanedUp = true;
          }
        }
      } catch {
        // Invalid item, remove it
        window.localStorage.removeItem(key);
        cleanedUp = true;
      }
    });

    if (cleanedUp) {
      console.log('Cleaned up expired localStorage items');
    } else {
      console.warn('No expired items found, localStorage may be genuinely full');
    }
  }

  /**
   * Check if localStorage is supported
   */
  get supported(): boolean {
    return this.isSupported;
  }
}

// ================================
// Export singleton instance
// ================================

export const localStorageService = new LocalStorageService();
export default localStorageService;
