/**
 * Mock Authentication Service
 *
 * Mock implementation of the authentication service for testing and development.
 */

import {
  generateAuthTokens,
  generateSessions,
  generateUser,
  generateUserProfile,
  randomDelay,
  withRandomError,
} from '@/mocks/generators';
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
import type { IAuthService, MockServiceConfig } from '@/types/services';

// ================================
// Mock Auth Service Implementation
// ================================

export class MockAuthService implements IAuthService {
  private currentUser: User | null = null;
  private users: User[] = [];
  private config: MockServiceConfig;

  constructor(config: MockServiceConfig = { baseUrl: '', delay: 500 }) {
    this.config = config;
    this.initializeUsers();
  }

  private initializeUsers() {
    // Create default users for testing
    this.users = [
      generateUser({
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        permissions: [
          'users.read',
          'users.write',
          'users.delete',
          'admin.access',
          'reports.read',
          'reports.write',
          'settings.read',
          'settings.write',
        ],
        emailVerified: true,
      }),
      generateUser({
        email: 'user@example.com',
        firstName: 'Regular',
        lastName: 'User',
        role: 'user',
        permissions: ['users.read'],
        emailVerified: true,
      }),
    ];
  }

  private async delay(): Promise<void> {
    const delayTime = this.config.delay || 500;
    const min = typeof delayTime === 'number' ? delayTime : 200;
    const max = typeof delayTime === 'number' ? delayTime : 1000;

    if (this.config.enableErrors) {
      await withRandomError(undefined, this.config.errorRate || 0.1);
    }

    await randomDelay(min, max);
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await this.delay();

    const user = this.users.find((u) => u.email === credentials.email);

    if (!user || credentials.password !== 'password123') {
      throw new Error('Invalid credentials');
    }

    this.currentUser = user;

    return {
      user,
      tokens: generateAuthTokens(),
      isFirstLogin: false,
    };
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    await this.delay();

    const existingUser = this.users.find((u) => u.email === credentials.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const newUser = generateUser({
      email: credentials.email,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      role: 'user',
      permissions: ['users.read'],
      emailVerified: false,
    });

    this.users.push(newUser);
    this.currentUser = newUser;

    return {
      user: newUser,
      tokens: generateAuthTokens(),
      isFirstLogin: true,
    };
  }

  async logout(): Promise<void> {
    await this.delay();
    this.currentUser = null;
  }

  async refreshToken(refreshToken: string): Promise<{ tokens: AuthTokens }> {
    await this.delay();

    if (!refreshToken || refreshToken.length < 10) {
      throw new Error('Invalid refresh token');
    }

    return {
      tokens: generateAuthTokens(),
    };
  }

  async getProfile(): Promise<UserProfile> {
    await this.delay();

    if (!this.currentUser) {
      throw new Error('Not authenticated');
    }

    return generateUserProfile(this.currentUser);
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<User> {
    await this.delay();

    if (!this.currentUser) {
      throw new Error('Not authenticated');
    }

    // Update the current user
    this.currentUser = { ...this.currentUser, ...updates };

    // Update in users array
    const userIndex = this.users.findIndex((u) => u.id === this.currentUser!.id);
    if (userIndex !== -1) {
      this.users[userIndex] = this.currentUser;
    }

    return this.currentUser;
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await this.delay();

    if (!this.currentUser) {
      throw new Error('Not authenticated');
    }

    if (data.currentPassword !== 'password123') {
      throw new Error('Current password is incorrect');
    }

    if (data.newPassword !== data.confirmPassword) {
      throw new Error('Password confirmation does not match');
    }

    // In a real implementation, you'd hash and save the new password
  }

  async forgotPassword(_data: ForgotPasswordRequest): Promise<void> {
    await this.delay();
    // Always succeeds for security (don't reveal if email exists)
  }

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await this.delay();

    if (data.token !== 'valid-reset-token') {
      throw new Error('Invalid or expired reset token');
    }

    if (data.password !== data.confirmPassword) {
      throw new Error('Password confirmation does not match');
    }
  }

  async verifyEmail(token: string): Promise<void> {
    await this.delay();

    if (token !== 'valid-verification-token') {
      throw new Error('Invalid verification token');
    }

    if (this.currentUser) {
      this.currentUser.emailVerified = true;
    }
  }

  async resendVerification(): Promise<void> {
    await this.delay();

    if (!this.currentUser) {
      throw new Error('Not authenticated');
    }
  }

  async getSessions(): Promise<ActiveSession[]> {
    await this.delay();

    if (!this.currentUser) {
      throw new Error('Not authenticated');
    }

    return generateSessions(3);
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.delay();

    if (!this.currentUser) {
      throw new Error('Not authenticated');
    }

    // Mock implementation - just validate sessionId format
    if (!sessionId || sessionId.length < 5) {
      throw new Error('Invalid session ID');
    }
  }

  async revokeAllOtherSessions(): Promise<void> {
    await this.delay();

    if (!this.currentUser) {
      throw new Error('Not authenticated');
    }
  }

  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    await randomDelay(200, 500);

    const exists = this.users.some((u) => u.email === email);
    return { available: !exists };
  }

  async validatePassword(password: string): Promise<{
    valid: boolean;
    score: number;
    feedback: string[];
  }> {
    await randomDelay(100, 300);

    const score = Math.min(Math.max(password.length - 4, 0), 4);
    const feedback = [];

    if (password.length < 8) {
      feedback.push('Password should be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      feedback.push('Password should contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      feedback.push('Password should contain at least one lowercase letter');
    }
    if (!/\d/.test(password)) {
      feedback.push('Password should contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      feedback.push('Password should contain at least one special character');
    }

    return {
      valid: feedback.length === 0,
      score,
      feedback,
    };
  }
}
