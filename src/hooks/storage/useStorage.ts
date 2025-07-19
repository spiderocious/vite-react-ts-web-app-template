/**
 * Storage Hooks
 *
 * React hooks for reactive storage updates with type safety.
 */

import { useCallback, useEffect, useState } from 'react';

import type { StorageOptions } from '@/services/storage/localStorage';
import { localStorageService } from '@/services/storage/localStorage';
import { sessionStorageService } from '@/services/storage/sessionStorage';

// ================================
// localStorage Hook
// ================================

/**
 * React hook for localStorage with reactive updates
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options?: StorageOptions
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Initialize state with value from localStorage or default
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = localStorageService.getItem<T>(key);
    return item !== null ? item : defaultValue;
  });

  // Setter function that updates both state and localStorage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Allow value to be a function for functional updates
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Update state
        setStoredValue(valueToStore);

        // Update localStorage
        localStorageService.setItem(key, valueToStore, options);
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue, options]
  );

  // Remove function
  const removeValue = useCallback(() => {
    try {
      localStorageService.removeItem(key);
      setStoredValue(defaultValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, defaultValue]);

  // Subscribe to storage changes
  useEffect(() => {
    const unsubscribe = localStorageService.subscribe<T>(key, (newValue) => {
      setStoredValue(newValue !== null ? newValue : defaultValue);
    });

    return unsubscribe;
  }, [key, defaultValue]);

  return [storedValue, setValue, removeValue];
}

// ================================
// sessionStorage Hook
// ================================

/**
 * React hook for sessionStorage with reactive updates
 */
export function useSessionStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Initialize state with value from sessionStorage or default
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = sessionStorageService.getItem<T>(key);
    return item !== null ? item : defaultValue;
  });

  // Setter function that updates both state and sessionStorage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Allow value to be a function for functional updates
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Update state
        setStoredValue(valueToStore);

        // Update sessionStorage
        sessionStorageService.setItem(key, valueToStore);
      } catch (error) {
        console.error(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove function
  const removeValue = useCallback(() => {
    try {
      sessionStorageService.removeItem(key);
      setStoredValue(defaultValue);
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, defaultValue]);

  // Subscribe to storage changes
  useEffect(() => {
    const unsubscribe = sessionStorageService.subscribe<T>(key, (newValue) => {
      setStoredValue(newValue !== null ? newValue : defaultValue);
    });

    return unsubscribe;
  }, [key, defaultValue]);

  return [storedValue, setValue, removeValue];
}

// ================================
// Storage State Hook
// ================================

/**
 * Hook for managing state that can persist to either localStorage or sessionStorage
 */
export function useStorageState<T>(
  key: string,
  defaultValue: T,
  storageType: 'local' | 'session' = 'local',
  options?: StorageOptions
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  if (storageType === 'session') {
    return useSessionStorage(key, defaultValue);
  }

  return useLocalStorage(key, defaultValue, options);
}

// ================================
// Storage Info Hook
// ================================

/**
 * Hook for getting storage usage information
 */
export function useStorageInfo(storageType: 'local' | 'session' = 'local') {
  const [usageInfo, setUsageInfo] = useState<{ used: number; remaining: number } | null>(null);

  useEffect(() => {
    const updateUsageInfo = () => {
      const service = storageType === 'local' ? localStorageService : sessionStorageService;
      setUsageInfo(service.getUsageInfo());
    };

    updateUsageInfo();

    // Update every 5 seconds
    const interval = setInterval(updateUsageInfo, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [storageType]);

  return usageInfo;
}

// ================================
// Utility Hooks
// ================================

/**
 * Hook for checking if storage is supported
 */
export function useStorageSupport() {
  return {
    localStorage: localStorageService.supported,
    sessionStorage: sessionStorageService.supported,
  };
}

/**
 * Hook for managing a list in storage
 */
export function useStorageList<T>(
  key: string,
  storageType: 'local' | 'session' = 'local'
): {
  items: T[];
  addItem: (item: T) => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, item: T) => void;
  clearItems: () => void;
  removeValue: () => void;
} {
  const [items, setItems, removeValue] = useStorageState<T[]>(key, [], storageType);

  const addItem = useCallback(
    (item: T) => {
      setItems((prev) => [...prev, item]);
    },
    [setItems]
  );

  const removeItem = useCallback(
    (index: number) => {
      setItems((prev) => prev.filter((_, i) => i !== index));
    },
    [setItems]
  );

  const updateItem = useCallback(
    (index: number, item: T) => {
      setItems((prev) => prev.map((existingItem, i) => (i === index ? item : existingItem)));
    },
    [setItems]
  );

  const clearItems = useCallback(() => {
    setItems([]);
  }, [setItems]);

  return {
    items,
    addItem,
    removeItem,
    updateItem,
    clearItems,
    removeValue,
  };
}

/**
 * Hook for managing a set in storage
 */
export function useStorageSet<T>(
  key: string,
  storageType: 'local' | 'session' = 'local'
): {
  items: Set<T>;
  hasItem: (item: T) => boolean;
  addItem: (item: T) => void;
  removeItem: (item: T) => void;
  toggleItem: (item: T) => void;
  clearItems: () => void;
  removeValue: () => void;
} {
  const [itemsArray, setItemsArray, removeValue] = useStorageState<T[]>(key, [], storageType);

  const items = new Set(itemsArray);

  const hasItem = useCallback(
    (item: T) => {
      return items.has(item);
    },
    [items]
  );

  const addItem = useCallback(
    (item: T) => {
      if (!items.has(item)) {
        setItemsArray((prev) => [...prev, item]);
      }
    },
    [items, setItemsArray]
  );

  const removeItem = useCallback(
    (item: T) => {
      setItemsArray((prev) => prev.filter((i) => i !== item));
    },
    [setItemsArray]
  );

  const toggleItem = useCallback(
    (item: T) => {
      if (items.has(item)) {
        removeItem(item);
      } else {
        addItem(item);
      }
    },
    [items, addItem, removeItem]
  );

  const clearItems = useCallback(() => {
    setItemsArray([]);
  }, [setItemsArray]);

  return {
    items,
    hasItem,
    addItem,
    removeItem,
    toggleItem,
    clearItems,
    removeValue,
  };
}
