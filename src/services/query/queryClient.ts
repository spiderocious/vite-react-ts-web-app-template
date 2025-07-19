/**
 * React Query Configuration
 *
 * Configures TanStack Query with error handling, caching strategies,
 * and development tools integration.
 */

import type { DefaultOptions } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';

import { config } from '@/configs';
import type { ApiError } from '@/services/http/httpClient';

// ================================
// Query Client Configuration
// ================================

const queryConfig: DefaultOptions = {
  queries: {
    // Stale time: how long data is considered fresh
    staleTime: 5 * 60 * 1000, // 5 minutes

    // Cache time: how long data stays in cache after component unmounts
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

    // Retry configuration
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      const apiError = error as unknown as ApiError;
      if (apiError.code?.startsWith('4')) {
        return false;
      }

      // Retry up to 3 times for other errors
      return failureCount < 3;
    },

    // Retry delay with exponential backoff
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // Refetch on window focus (disable in development to reduce noise)
    refetchOnWindowFocus: config.isProduction,

    // Refetch on reconnect
    refetchOnReconnect: true,

    // Background refetch interval
    refetchInterval: false, // Disable by default, enable per query as needed
  },

  mutations: {
    // Retry failed mutations once
    retry: 1,

    // Retry delay for mutations
    retryDelay: 1000,
  },
};

// ================================
// Create Query Client
// ================================

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,

  // Global error handler
  // Note: Individual queries can override this with their own onError
});

// ================================
// Query Keys Factory
// ================================

/**
 * Centralized query key management for better cache invalidation
 * and type safety.
 */
export const queryKeys = {
  // Auth queries
  auth: {
    profile: () => ['auth', 'profile'] as const,
    permissions: () => ['auth', 'permissions'] as const,
  },

  // User queries
  users: {
    all: () => ['users'] as const,
    lists: () => [...queryKeys.users.all(), 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },

  // Post queries (example)
  posts: {
    all: () => ['posts'] as const,
    lists: () => [...queryKeys.posts.all(), 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.posts.lists(), filters] as const,
    details: () => [...queryKeys.posts.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.posts.details(), id] as const,
  },

  // Settings queries
  settings: {
    all: () => ['settings'] as const,
    user: () => [...queryKeys.settings.all(), 'user'] as const,
    app: () => [...queryKeys.settings.all(), 'app'] as const,
  },
} as const;

// ================================
// Cache Utilities
// ================================

/**
 * Invalidate queries for entities that have 'all' method
 */
export function invalidateEntity(entity: 'users' | 'posts' | 'settings'): void {
  queryClient.invalidateQueries({ queryKey: queryKeys[entity].all() });
}

/**
 * Remove cached data for entities that have 'all' method
 */
export function removeEntityCache(entity: 'users' | 'posts' | 'settings'): void {
  queryClient.removeQueries({ queryKey: queryKeys[entity].all() });
}

/**
 * Prefetch data for better UX
 */
export function prefetchQuery<T>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<T>,
  staleTime?: number
): void {
  queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime: staleTime || 5 * 60 * 1000,
  });
}

/**
 * Update cached data optimistically
 */
export function updateQueryData<T>(
  queryKey: readonly unknown[],
  updater: (oldData: T | undefined) => T | undefined
): void {
  queryClient.setQueryData(queryKey, updater);
}

/**
 * Get cached data without triggering a refetch
 */
export function getCachedData<T>(queryKey: readonly unknown[]): T | undefined {
  return queryClient.getQueryData<T>(queryKey);
}

// ================================
// Development Utilities
// ================================

if (config.env.DEBUG_MODE) {
  // Log query cache changes in development
  queryClient.getQueryCache().subscribe((event) => {
    console.log('🔄 Query Cache Event:', {
      type: event.type,
      query: event.query.queryKey,
      state: event.query.state.status,
    });
  });

  // Log mutation events in development
  queryClient.getMutationCache().subscribe((event) => {
    if (event.mutation) {
      console.log('🔄 Mutation Event:', {
        type: event.type,
        mutation: event.mutation.options.mutationKey,
        state: event.mutation.state.status,
      });
    }
  });
}

export default queryClient;
