/**
 * Authentication Context
 *
 * React context for managing authentication state and operations.
 */

import { useQueryClient } from '@tanstack/react-query';
import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';

import { authService } from '@/services/auth/authService';
import { localStorageService } from '@/services/storage/localStorage';
import { sessionStorageService } from '@/services/storage/sessionStorage';
import type {
  AuthContextType,
  AuthState,
  AuthTokens,
  LoginCredentials,
  Permission,
  RegisterCredentials,
  User,
  UserProfile,
  UserRole,
} from '@/types/auth';

// ================================
// Storage Keys
// ================================

const STORAGE_KEYS = {
  TOKENS: 'auth_tokens',
  USER: 'auth_user',
  REMEMBER_ME: 'auth_remember_me',
} as const;

// ================================
// Auth Actions
// ================================

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; tokens: AuthTokens } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'UPDATE_TOKENS'; payload: AuthTokens };

// ================================
// Auth Reducer
// ================================

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'LOGOUT':
      return {
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };

    case 'UPDATE_TOKENS':
      return {
        ...state,
        tokens: action.payload,
      };

    default:
      return state;
  }
};

// ================================
// Initial State
// ================================

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// ================================
// Auth Context
// ================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ================================
// Auth Provider
// ================================

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const queryClient = useQueryClient();

  // ================================
  // Storage Helpers
  // ================================

  const getStorageService = useCallback(() => {
    const rememberMe = localStorageService.getItem<boolean>(STORAGE_KEYS.REMEMBER_ME) ?? false;
    return rememberMe ? localStorageService : sessionStorageService;
  }, []);

  const saveAuthData = useCallback((user: User, tokens: AuthTokens, rememberMe = false) => {
    const storageService = rememberMe ? localStorageService : sessionStorageService;

    // Save remember preference
    localStorageService.setItem(STORAGE_KEYS.REMEMBER_ME, rememberMe);

    // Save auth data
    storageService.setItem(STORAGE_KEYS.USER, user);
    storageService.setItem(STORAGE_KEYS.TOKENS, tokens, {
      expiry: tokens.expiresIn * 1000, // Convert seconds to milliseconds
    });
  }, []);

  const clearAuthData = useCallback(() => {
    // Clear from both storage types
    localStorageService.removeItem(STORAGE_KEYS.USER);
    localStorageService.removeItem(STORAGE_KEYS.TOKENS);
    localStorageService.removeItem(STORAGE_KEYS.REMEMBER_ME);
    sessionStorageService.removeItem(STORAGE_KEYS.USER);
    sessionStorageService.removeItem(STORAGE_KEYS.TOKENS);

    // Clear React Query cache
    queryClient.clear();
  }, [queryClient]);

  // ================================
  // Auth Operations
  // ================================

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        const response = await authService.login(credentials);

        // Save to storage
        saveAuthData(response.user, response.tokens, credentials.rememberMe);

        // Update state
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: response.user, tokens: response.tokens },
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed';
        dispatch({ type: 'SET_ERROR', payload: message });
        throw error;
      }
    },
    [saveAuthData]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        const response = await authService.register(credentials);

        // Save to storage (default to session)
        saveAuthData(response.user, response.tokens, false);

        // Update state
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: response.user, tokens: response.tokens },
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed';
        dispatch({ type: 'SET_ERROR', payload: message });
        throw error;
      }
    },
    [saveAuthData]
  );

  const logout = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Call logout endpoint if user is authenticated
      if (state.isAuthenticated && state.tokens) {
        await authService.logout();
      }
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      // Clear storage and state
      clearAuthData();
      dispatch({ type: 'LOGOUT' });
    }
  }, [state.isAuthenticated, state.tokens, clearAuthData]);

  const refreshToken = useCallback(async () => {
    try {
      const storageService = getStorageService();
      const currentTokens = storageService.getItem<AuthTokens>(STORAGE_KEYS.TOKENS);

      if (!currentTokens?.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authService.refreshToken(currentTokens.refreshToken);

      // Update storage
      storageService.setItem(STORAGE_KEYS.TOKENS, response.tokens, {
        expiry: response.tokens.expiresIn * 1000, // Convert seconds to milliseconds
      });

      // Update state
      dispatch({ type: 'UPDATE_TOKENS', payload: response.tokens });
    } catch (error) {
      // Refresh failed, logout user
      await logout();
      throw error;
    }
  }, [getStorageService, logout]);

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        const updatedUser = await authService.updateProfile(updates);

        // Update storage
        const storageService = getStorageService();
        storageService.setItem(STORAGE_KEYS.USER, updatedUser);

        // Update state
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Profile update failed';
        dispatch({ type: 'SET_ERROR', payload: message });
        throw error;
      }
    },
    [getStorageService]
  );

  // ================================
  // Permission Helpers
  // ================================

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      return state.user?.permissions.includes(permission) ?? false;
    },
    [state.user?.permissions]
  );

  const hasRole = useCallback(
    (role: UserRole): boolean => {
      return state.user?.role === role;
    },
    [state.user?.role]
  );

  // ================================
  // Utility Functions
  // ================================

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  // ================================
  // Initialize Auth State
  // ================================

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storageService = getStorageService();
        const savedUser = storageService.getItem<User>(STORAGE_KEYS.USER);
        const savedTokens = storageService.getItem<AuthTokens>(STORAGE_KEYS.TOKENS);

        if (savedUser && savedTokens) {
          // Validate token expiry
          const now = Date.now();
          const tokenExpiry = new Date(savedTokens.expiresIn * 1000).getTime();

          if (now < tokenExpiry) {
            // Token still valid
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: { user: savedUser, tokens: savedTokens },
            });
          } else {
            // Token expired, try to refresh
            try {
              await refreshToken();
            } catch {
              // Refresh failed, clear invalid data
              clearAuthData();
              dispatch({ type: 'LOGOUT' });
            }
          }
        } else {
          // No saved auth data
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        clearAuthData();
        dispatch({ type: 'LOGOUT' });
      }
    };

    initializeAuth();
  }, [getStorageService, refreshToken, clearAuthData]);

  // ================================
  // Context Value
  // ================================

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshToken,
    clearError,
    hasPermission,
    hasRole,
    updateProfile,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

// ================================
// Auth Hook
// ================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
