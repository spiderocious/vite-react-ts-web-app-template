/**
 * Base Service Interfaces
 *
 * TypeScript interfaces for all application services.
 */

import type {
  ActiveSession,
  AuthResponse,
  AuthTokens,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordRequest,
  User,
  UserProfile,
} from '@/types/auth';

// ================================
// Base Service Interface
// ================================

export interface BaseServiceConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  delay?: number; // For mock services
}

// ================================
// Auth Service Interface
// ================================

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(credentials: RegisterCredentials): Promise<AuthResponse>;
  logout(): Promise<void>;
  refreshToken(refreshToken: string): Promise<{ tokens: AuthTokens }>;
  getProfile(): Promise<UserProfile>;
  updateProfile(updates: Partial<UserProfile>): Promise<User>;
  changePassword(data: ChangePasswordRequest): Promise<void>;
  forgotPassword(data: ForgotPasswordRequest): Promise<void>;
  resetPassword(data: ResetPasswordRequest): Promise<void>;
  verifyEmail(token: string): Promise<void>;
  resendVerification(): Promise<void>;
  getSessions(): Promise<ActiveSession[]>;
  revokeSession(sessionId: string): Promise<void>;
  revokeAllOtherSessions(): Promise<void>;
  checkEmailAvailability(email: string): Promise<{ available: boolean }>;
  validatePassword(password: string): Promise<{
    valid: boolean;
    score: number;
    feedback: string[];
  }>;
}

// ================================
// User Service Interface
// ================================

export interface UserListOptions {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'pending';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IUserService {
  getUsers(options?: UserListOptions): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
  }>;
  getUserById(id: string): Promise<User>;
  createUser(userData: Partial<User>): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
  toggleUserStatus(id: string): Promise<User>;
  resetUserPassword(id: string): Promise<void>;
}

// ================================
// Settings Service Interface
// ================================

export interface AppSettings {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    supportEmail: string;
  };
  features: {
    registration: boolean;
    emailVerification: boolean;
    twoFactorAuth: boolean;
    socialLogin: boolean;
  };
  security: {
    passwordMinLength: number;
    passwordRequireSpecialChar: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
  };
  notifications: {
    emailEnabled: boolean;
    pushEnabled: boolean;
    smsEnabled: boolean;
  };
}

export interface ISettingsService {
  getSettings(): Promise<AppSettings>;
  updateSettings(updates: Partial<AppSettings>): Promise<AppSettings>;
  resetToDefaults(): Promise<AppSettings>;
}

// ================================
// File Upload Service Interface
// ================================

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  type: string;
  id: string;
}

export interface IFileService {
  uploadFile(
    file: File,
    options?: {
      folder?: string;
      isPublic?: boolean;
    }
  ): Promise<UploadResponse>;
  deleteFile(id: string): Promise<void>;
  getFileUrl(id: string): Promise<string>;
  getFiles(folder?: string): Promise<UploadResponse[]>;
}

// ================================
// Analytics Service Interface
// ================================

export interface AnalyticsData {
  pageViews: {
    total: number;
    unique: number;
    trend: number; // percentage change
  };
  users: {
    total: number;
    active: number;
    new: number;
    trend: number;
  };
  sessions: {
    total: number;
    avgDuration: number;
    bounceRate: number;
  };
}

export interface IAnalyticsService {
  getDashboardStats(): Promise<AnalyticsData>;
  getPageViews(dateRange: { start: Date; end: Date }): Promise<
    {
      date: string;
      views: number;
    }[]
  >;
  getUserActivity(dateRange: { start: Date; end: Date }): Promise<
    {
      date: string;
      activeUsers: number;
    }[]
  >;
}

// ================================
// Notification Service Interface
// ================================

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

export interface INotificationService {
  getNotifications(options?: { page?: number; limit?: number; unreadOnly?: boolean }): Promise<{
    notifications: Notification[];
    total: number;
    unreadCount: number;
  }>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(): Promise<void>;
  deleteNotification(id: string): Promise<void>;
  getUnreadCount(): Promise<number>;
}

// ================================
// Service Factory Interface
// ================================

export interface IServiceFactory {
  auth: IAuthService;
  user: IUserService;
  settings: ISettingsService;
  file: IFileService;
  analytics: IAnalyticsService;
  notification: INotificationService;
}

// ================================
// Mock Service Configuration
// ================================

export interface MockServiceConfig extends BaseServiceConfig {
  enableErrors?: boolean;
  errorRate?: number; // 0-1, probability of errors
  networkDelay?: {
    min: number;
    max: number;
  };
  generateData?: boolean; // Whether to generate fake data
}
