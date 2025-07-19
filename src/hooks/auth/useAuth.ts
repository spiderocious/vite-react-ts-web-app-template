/**
 * Authentication Hooks
 *
 * Custom React hooks for authentication operations and status.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth/authService';
import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '@/types/auth';

// ================================
// Query Keys
// ================================

export const authQueryKeys = {
  profile: ['auth', 'profile'] as const,
  sessions: ['auth', 'sessions'] as const,
  emailCheck: (email: string) => ['auth', 'email-check', email] as const,
  passwordValidation: (password: string) => ['auth', 'password-validation', password] as const,
};

// ================================
// Authentication Status Hooks
// ================================

/**
 * Hook for getting authentication status and user info
 */
export function useAuthStatus() {
  const { user, isAuthenticated, isLoading, error } = useAuth();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isGuest: !isAuthenticated,
    isVerified: user?.emailVerified ?? false,
  };
}

/**
 * Hook for checking user permissions
 */
export function usePermissions() {
  const { hasPermission, hasRole, user } = useAuth();

  return {
    hasPermission,
    hasRole,
    permissions: user?.permissions ?? [],
    role: user?.role,
    can: hasPermission, // Alias for more natural usage
    is: hasRole, // Alias for more natural usage
  };
}

// ================================
// Authentication Operations
// ================================

/**
 * Hook for login functionality
 */
export function useLogin() {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: authQueryKeys.profile });
    },
  });
}

/**
 * Hook for registration functionality
 */
export function useRegister() {
  const { register } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: authQueryKeys.profile });
    },
  });
}

/**
 * Hook for logout functionality
 */
export function useLogout() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
    },
  });
}

// ================================
// Profile Management Hooks
// ================================

/**
 * Hook for fetching user profile
 */
export function useProfile() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: authQueryKeys.profile,
    queryFn: authService.getProfile,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for updating user profile
 */
export function useUpdateProfile() {
  const { updateProfile } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authQueryKeys.profile });
    },
  });
}

// ================================
// Password Management Hooks
// ================================

/**
 * Hook for changing password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => authService.changePassword(data),
  });
}

/**
 * Hook for password reset request
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authService.forgotPassword(data),
  });
}

/**
 * Hook for password reset with token
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
  });
}

/**
 * Hook for password validation
 */
export function usePasswordValidation(password: string, enabled = true) {
  return useQuery({
    queryKey: authQueryKeys.passwordValidation(password),
    queryFn: () => authService.validatePassword(password),
    enabled: enabled && password.length > 0,
    staleTime: 30 * 1000, // 30 seconds
  });
}

// ================================
// Email Verification Hooks
// ================================

/**
 * Hook for email verification
 */
export function useVerifyEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authQueryKeys.profile });
    },
  });
}

/**
 * Hook for resending email verification
 */
export function useResendVerification() {
  return useMutation({
    mutationFn: authService.resendVerification,
  });
}

/**
 * Hook for checking email availability
 */
export function useEmailAvailability(email: string, enabled = true) {
  return useQuery({
    queryKey: authQueryKeys.emailCheck(email),
    queryFn: () => authService.checkEmailAvailability(email),
    enabled: enabled && email.includes('@'),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// ================================
// Session Management Hooks
// ================================

/**
 * Hook for fetching active sessions
 */
export function useSessions() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: authQueryKeys.sessions,
    queryFn: authService.getSessions,
    enabled: isAuthenticated,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook for revoking a session
 */
export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => authService.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authQueryKeys.sessions });
    },
  });
}

/**
 * Hook for revoking all other sessions
 */
export function useRevokeAllOtherSessions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.revokeAllOtherSessions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authQueryKeys.sessions });
    },
  });
}

// ================================
// Token Management Hook
// ================================

/**
 * Hook for manual token refresh
 */
export function useRefreshToken() {
  const { refreshToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refreshToken,
    onSuccess: () => {
      // Invalidate all queries to refetch with new token
      queryClient.invalidateQueries();
    },
  });
}

// ================================
// Utility Hooks
// ================================

/**
 * Hook for checking authentication state reactively
 */
export function useIsAuthenticated() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

/**
 * Hook for getting current user reactively
 */
export function useCurrentUser() {
  const { user } = useAuth();
  return user;
}

/**
 * Hook for authentication error handling
 */
export function useAuthError() {
  const { error, clearError } = useAuth();

  return {
    error,
    clearError,
    hasError: !!error,
  };
}
