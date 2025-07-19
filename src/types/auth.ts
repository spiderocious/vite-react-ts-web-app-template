/**
 * Authentication Types
 *
 * TypeScript definitions for authentication-related data structures.
 */

// ================================
// User Types
// ================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  permissions: Permission[];
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  phone?: string;
  timezone?: string;
  language?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisible: boolean;
    showActivity: boolean;
  };
}

// ================================
// Authentication Types
// ================================

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
  isFirstLogin?: boolean;
}

// ================================
// Authorization Types
// ================================

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'user' | 'guest';

export type Permission =
  | 'users.read'
  | 'users.write'
  | 'users.delete'
  | 'admin.access'
  | 'reports.read'
  | 'reports.write'
  | 'settings.read'
  | 'settings.write';

export interface RolePermissions {
  [key: string]: Permission[];
}

// ================================
// Auth State Types
// ================================

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole) => boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

// ================================
// Password Reset Types
// ================================

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ================================
// Session Types
// ================================

export interface SessionInfo {
  deviceId: string;
  userAgent: string;
  ipAddress: string;
  location?: string;
  lastActivity: string;
  isCurrent: boolean;
}

export interface ActiveSession extends SessionInfo {
  id: string;
  createdAt: string;
}

// ================================
// Auth Error Types
// ================================

export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_NOT_VERIFIED'
  | 'ACCOUNT_LOCKED'
  | 'PASSWORD_EXPIRED'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_INVALID'
  | 'REFRESH_TOKEN_EXPIRED'
  | 'INSUFFICIENT_PERMISSIONS'
  | 'EMAIL_ALREADY_EXISTS'
  | 'WEAK_PASSWORD'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR';

export interface AuthError {
  code: AuthErrorCode;
  message: string;
  details?: Record<string, any>;
}
