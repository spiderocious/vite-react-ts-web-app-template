/**
 * Auth Hooks Barrel Export
 */

export {
  authQueryKeys,
  useAuthError,
  useAuthStatus,
  useChangePassword,
  useCurrentUser,
  useEmailAvailability,
  useForgotPassword,
  useIsAuthenticated,
  useLogin,
  useLogout,
  usePasswordValidation,
  usePermissions,
  useProfile,
  useRefreshToken,
  useRegister,
  useResendVerification,
  useResetPassword,
  useRevokeAllOtherSessions,
  useRevokeSession,
  useSessions,
  useUpdateProfile,
  useVerifyEmail,
} from './useAuth';

// Re-export context hook
export { useAuth } from '@/contexts/AuthContext';
