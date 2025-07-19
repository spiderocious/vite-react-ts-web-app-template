/**
 * Session Storage Service
 *
 * Type-safe sessionStorage abstraction with JSON serialization
 * and error handling. Similar to localStorage but data persists
 * only for the session (tab/window).
 */

// ================================
// Types
// ================================

interface SessionStorageItem<T> {
  data: T;
  timestamp: number;
}

type SessionStorageListener<T> = (newValue: T | null, oldValue: T | null, key: string) => void;

// ================================
// Session Storage Service Class
// ================================

class SessionStorageService {
  private listeners = new Map<string, Set<SessionStorageListener<any>>>();
  private isSupported: boolean;

  constructor() {
    this.isSupported = this.checkSupport();
  }

  /**
   * Check if sessionStorage is supported and available
   */
  private checkSupport(): boolean {
    try {
      if (typeof window === 'undefined' || !window.sessionStorage) {
        return false;
      }

      const testKey = '__session_storage_test__';
      window.sessionStorage.setItem(testKey, 'test');
      window.sessionStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Serialize data with metadata
   */
  private serializeItem<T>(data: T): string {
    const item: SessionStorageItem<T> = {
      data,
      timestamp: Date.now(),
    };

    return JSON.stringify(item);
  }

  /**
   * Deserialize data
   */
  private deserializeItem<T>(serialized: string): SessionStorageItem<T> | null {
    try {
      const item: SessionStorageItem<T> = JSON.parse(serialized);
      return item;
    } catch {
      return null;
    }
  }

  /**
   * Set item in sessionStorage
   */
  setItem<T>(key: string, value: T): boolean {
    if (!this.isSupported) {
      console.warn('sessionStorage is not supported');
      return false;
    }

    try {
      const oldValue = this.getItem<T>(key);
      const serialized = this.serializeItem(value);

      window.sessionStorage.setItem(key, serialized);

      // Notify listeners
      this.notifyListeners(key, value, oldValue);

      return true;
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('sessionStorage quota exceeded');
      } else {
        console.error('Error setting sessionStorage item:', error);
      }
      return false;
    }
  }

  /**
   * Get item from sessionStorage
   */
  getItem<T>(key: string): T | null {
    if (!this.isSupported) {
      return null;
    }

    try {
      const serialized = window.sessionStorage.getItem(key);
      if (!serialized) return null;

      const item = this.deserializeItem<T>(serialized);
      if (!item) {
        // Invalid item, remove it
        this.removeItem(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.error('Error getting sessionStorage item:', error);
      return null;
    }
  }

  /**
   * Remove item from sessionStorage
   */
  removeItem(key: string): boolean {
    if (!this.isSupported) {
      return false;
    }

    try {
      const oldValue = this.getItem(key);
      window.sessionStorage.removeItem(key);

      // Notify listeners
      this.notifyListeners(key, null, oldValue);

      return true;
    } catch (error) {
      console.error('Error removing sessionStorage item:', error);
      return false;
    }
  }

  /**
   * Clear all sessionStorage items
   */
  clear(): boolean {
    if (!this.isSupported) {
      return false;
    }

    try {
      window.sessionStorage.clear();

      // Notify all listeners
      this.listeners.forEach((_, key) => {
        this.notifyListeners(key, null, null);
      });

      return true;
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
      return false;
    }
  }

  /**
   * Get all keys in sessionStorage
   */
  getAllKeys(): string[] {
    if (!this.isSupported) {
      return [];
    }

    try {
      return Object.keys(window.sessionStorage);
    } catch (error) {
      console.error('Error getting sessionStorage keys:', error);
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
      const totalSize = JSON.stringify(window.sessionStorage).length;
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
  subscribe<T>(key: string, listener: SessionStorageListener<T>): () => void {
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
      return window.sessionStorage.getItem(key) !== null;
    } catch (error) {
      console.error('Error checking sessionStorage item:', error);
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
        console.error('Error in sessionStorage listener:', error);
      }
    });
  }

  /**
   * Check if sessionStorage is supported
   */
  get supported(): boolean {
    return this.isSupported;
  }
}

// ================================
// Export singleton instance
// ================================

export const sessionStorageService = new SessionStorageService();
export default sessionStorageService;
