/**
 * Authentication Service
 *
 * Service for handling authentication operations with the API.
 */

import { httpClient } from '@/services/http/httpClient';
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
import type { IAuthService } from '@/types/services';

// ================================
// Auth Service Implementation
// ================================

class AuthService implements IAuthService {
  private readonly baseUrl = '/auth';

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(`${this.baseUrl}/login`, {
      email: credentials.email,
      password: credentials.password,
      rememberMe: credentials.rememberMe,
    });

    return response.data;
  }

  /**
   * Register a new user
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(`${this.baseUrl}/register`, {
      email: credentials.email,
      password: credentials.password,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      acceptTerms: credentials.acceptTerms,
    });

    return response.data;
  }

  /**
   * Logout current session
   */
  async logout(): Promise<void> {
    await httpClient.post(`${this.baseUrl}/logout`);
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<{ tokens: AuthTokens }> {
    const response = await httpClient.post<{ tokens: AuthTokens }>(`${this.baseUrl}/refresh`, {
      refreshToken,
    });

    return response.data;
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await httpClient.get<UserProfile>(`${this.baseUrl}/profile`);
    return response.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<UserProfile>): Promise<User> {
    const response = await httpClient.patch<User>(`${this.baseUrl}/profile`, updates);
    return response.data;
  }

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await httpClient.post(`${this.baseUrl}/change-password`, data);
  }

  /**
   * Request password reset
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    await httpClient.post(`${this.baseUrl}/forgot-password`, data);
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await httpClient.post(`${this.baseUrl}/reset-password`, data);
  }

  /**
   * Verify email address
   */
  async verifyEmail(token: string): Promise<void> {
    await httpClient.post(`${this.baseUrl}/verify-email`, { token });
  }

  /**
   * Resend email verification
   */
  async resendVerification(): Promise<void> {
    await httpClient.post(`${this.baseUrl}/resend-verification`);
  }

  /**
   * Get active sessions
   */
  async getSessions(): Promise<ActiveSession[]> {
    const response = await httpClient.get<ActiveSession[]>(`${this.baseUrl}/sessions`);
    return response.data;
  }

  /**
   * Revoke a specific session
   */
  async revokeSession(sessionId: string): Promise<void> {
    await httpClient.delete(`${this.baseUrl}/sessions/${sessionId}`);
  }

  /**
   * Revoke all other sessions (keep current)
   */
  async revokeAllOtherSessions(): Promise<void> {
    await httpClient.post(`${this.baseUrl}/sessions/revoke-all`);
  }

  /**
   * Check if email is available for registration
   */
  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    const response = await httpClient.get<{ available: boolean }>(`${this.baseUrl}/check-email`, {
      params: { email },
    });
    return response.data;
  }

  /**
   * Validate password strength
   */
  async validatePassword(password: string): Promise<{
    valid: boolean;
    score: number;
    feedback: string[];
  }> {
    const response = await httpClient.post<{
      valid: boolean;
      score: number;
      feedback: string[];
    }>(`${this.baseUrl}/validate-password`, { password });
    return response.data;
  }
}

// ================================
// Export Singleton
// ================================

export const authService = new AuthService();
