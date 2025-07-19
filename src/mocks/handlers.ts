/**
 * MSW Handlers
 *
 * Mock Service Worker handlers for intercepting API requests.
 */

import { http, HttpResponse } from 'msw';

import {
  generateAuthTokens,
  generateSessions,
  generateUser,
  generateUserProfile,
  generateUsers,
  withRandomDelay,
  withRandomError,
} from './generators';

import type {
  AuthResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordRequest,
  User,
} from '@/types/auth';

// ================================
// Configuration
// ================================

const config = {
  baseUrl: 'http://localhost:3000',
  enableErrors: true,
  errorRate: 0.1,
  networkDelay: { min: 200, max: 1000 },
};

// ================================
// Mock Database
// ================================

class MockDatabase {
  private users: User[] = [];
  private currentUser: User | null = null;

  constructor() {
    // Initialize with some default users
    this.users = generateUsers(10);
    // Add a default admin user
    this.users.push(
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
      })
    );
    // Add a default regular user
    this.users.push(
      generateUser({
        email: 'user@example.com',
        firstName: 'Regular',
        lastName: 'User',
        role: 'user',
        permissions: ['users.read'],
        emailVerified: true,
      })
    );
  }

  findUserByEmail(email: string) {
    return this.users.find((user) => user.email === email);
  }

  findUserById(id: string) {
    return this.users.find((user) => user.id === id);
  }

  setCurrentUser(user: User | null) {
    this.currentUser = user;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  updateUser(id: string, updates: Partial<User>) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      const existingUser = this.users[userIndex]!;
      this.users[userIndex] = { ...existingUser, ...updates };
      if (this.currentUser?.id === id) {
        this.currentUser = this.users[userIndex]!;
      }
      return this.users[userIndex];
    }
    return null;
  }

  addUser(user: User) {
    this.users.push(user);
    return user;
  }

  deleteUser(id: string) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }

  getUsers(options: { page?: number; limit?: number; search?: string } = {}) {
    let filteredUsers = [...this.users];

    if (options.search) {
      const search = options.search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.email.toLowerCase().includes(search) ||
          user.firstName.toLowerCase().includes(search) ||
          user.lastName.toLowerCase().includes(search)
      );
    }

    const page = options.page || 1;
    const limit = options.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      users: filteredUsers.slice(startIndex, endIndex),
      total: filteredUsers.length,
      page,
      limit,
    };
  }
}

const db = new MockDatabase();

// ================================
// Auth Handlers
// ================================

export const authHandlers = [
  // Login
  http.post(`${config.baseUrl}/auth/login`, async ({ request }) => {
    const credentials = (await request.json()) as LoginCredentials;

    return withRandomError(
      withRandomDelay({}, config.networkDelay.min, config.networkDelay.max),
      config.enableErrors ? config.errorRate : 0
    )
      .then(() => {
        const user = db.findUserByEmail(credentials.email);

        if (!user || credentials.password !== 'password123') {
          return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const tokens = generateAuthTokens();
        db.setCurrentUser(user);

        const response: AuthResponse = {
          user,
          tokens,
          isFirstLogin: false,
        };

        return HttpResponse.json(response);
      })
      .catch((error) => {
        return HttpResponse.json({ message: error.message }, { status: 500 });
      });
  }),

  // Register
  http.post(`${config.baseUrl}/auth/register`, async ({ request }) => {
    const credentials = (await request.json()) as RegisterCredentials;

    return withRandomError(
      withRandomDelay({}, config.networkDelay.min, config.networkDelay.max),
      config.enableErrors ? config.errorRate : 0
    )
      .then(() => {
        const existingUser = db.findUserByEmail(credentials.email);

        if (existingUser) {
          return HttpResponse.json({ message: 'Email already exists' }, { status: 400 });
        }

        const newUser = generateUser({
          email: credentials.email,
          firstName: credentials.firstName,
          lastName: credentials.lastName,
          role: 'user',
          permissions: ['users.read'],
          emailVerified: false,
        });

        db.addUser(newUser);
        db.setCurrentUser(newUser);

        const tokens = generateAuthTokens();

        const response: AuthResponse = {
          user: newUser,
          tokens,
          isFirstLogin: true,
        };

        return HttpResponse.json(response);
      })
      .catch((error) => {
        return HttpResponse.json({ message: error.message }, { status: 500 });
      });
  }),

  // Logout
  http.post(`${config.baseUrl}/auth/logout`, async () => {
    return withRandomDelay({}, 100, 300).then(() => {
      db.setCurrentUser(null);
      return new HttpResponse(null, { status: 204 });
    });
  }),

  // Refresh Token
  http.post(`${config.baseUrl}/auth/refresh`, async ({ request }) => {
    const { refreshToken } = (await request.json()) as { refreshToken: string };

    return withRandomError(
      withRandomDelay({}, config.networkDelay.min, config.networkDelay.max),
      config.enableErrors ? config.errorRate * 0.5 : 0 // Lower error rate for refresh
    )
      .then(() => {
        if (!refreshToken || refreshToken.length < 10) {
          return HttpResponse.json({ message: 'Invalid refresh token' }, { status: 401 });
        }

        const tokens = generateAuthTokens();
        return HttpResponse.json({ tokens });
      })
      .catch((error) => {
        return HttpResponse.json({ message: error.message }, { status: 500 });
      });
  }),

  // Get Profile
  http.get(`${config.baseUrl}/auth/profile`, async () => {
    return withRandomError(
      withRandomDelay({}, config.networkDelay.min, config.networkDelay.max),
      config.enableErrors ? config.errorRate : 0
    )
      .then(() => {
        const currentUser = db.getCurrentUser();

        if (!currentUser) {
          return HttpResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }

        const profile = generateUserProfile(currentUser);
        return HttpResponse.json(profile);
      })
      .catch((error) => {
        return HttpResponse.json({ message: error.message }, { status: 500 });
      });
  }),

  // Update Profile
  http.patch(`${config.baseUrl}/auth/profile`, async ({ request }) => {
    const updates = (await request.json()) as Partial<User>;

    return withRandomError(
      withRandomDelay({}, config.networkDelay.min, config.networkDelay.max),
      config.enableErrors ? config.errorRate : 0
    )
      .then(() => {
        const currentUser = db.getCurrentUser();

        if (!currentUser) {
          return HttpResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }

        const updatedUser = db.updateUser(currentUser.id, {
          ...updates,
          updatedAt: new Date().toISOString(),
        });

        return HttpResponse.json(updatedUser);
      })
      .catch((error) => {
        return HttpResponse.json({ message: error.message }, { status: 500 });
      });
  }),

  // Change Password
  http.post(`${config.baseUrl}/auth/change-password`, async ({ request }) => {
    const data = (await request.json()) as ChangePasswordRequest;

    return withRandomError(
      withRandomDelay({}, config.networkDelay.min, config.networkDelay.max),
      config.enableErrors ? config.errorRate : 0
    )
      .then(() => {
        const currentUser = db.getCurrentUser();

        if (!currentUser) {
          return HttpResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }

        if (data.currentPassword !== 'password123') {
          return HttpResponse.json({ message: 'Current password is incorrect' }, { status: 400 });
        }

        if (data.newPassword !== data.confirmPassword) {
          return HttpResponse.json(
            { message: 'Password confirmation does not match' },
            { status: 400 }
          );
        }

        return new HttpResponse(null, { status: 204 });
      })
      .catch((error) => {
        return HttpResponse.json({ message: error.message }, { status: 500 });
      });
  }),

  // Forgot Password
  http.post(`${config.baseUrl}/auth/forgot-password`, async ({ request }) => {
    (await request.json()) as ForgotPasswordRequest;

    return withRandomDelay({}, config.networkDelay.min, config.networkDelay.max).then(() => {
      // Always return success for security (don't reveal if email exists)
      return new HttpResponse(null, { status: 204 });
    });
  }),

  // Reset Password
  http.post(`${config.baseUrl}/auth/reset-password`, async ({ request }) => {
    const data = (await request.json()) as ResetPasswordRequest;

    return withRandomError(
      withRandomDelay({}, config.networkDelay.min, config.networkDelay.max),
      config.enableErrors ? config.errorRate : 0
    )
      .then(() => {
        if (data.token !== 'valid-reset-token') {
          return HttpResponse.json({ message: 'Invalid or expired reset token' }, { status: 400 });
        }

        if (data.password !== data.confirmPassword) {
          return HttpResponse.json(
            { message: 'Password confirmation does not match' },
            { status: 400 }
          );
        }

        return new HttpResponse(null, { status: 204 });
      })
      .catch((error) => {
        return HttpResponse.json({ message: error.message }, { status: 500 });
      });
  }),

  // Get Sessions
  http.get(`${config.baseUrl}/auth/sessions`, async () => {
    return withRandomDelay({}, config.networkDelay.min, config.networkDelay.max).then(() => {
      const currentUser = db.getCurrentUser();

      if (!currentUser) {
        return HttpResponse.json({ message: 'Not authenticated' }, { status: 401 });
      }

      const sessions = generateSessions(3);
      return HttpResponse.json(sessions);
    });
  }),

  // Check Email Availability
  http.get(`${config.baseUrl}/auth/check-email`, async ({ request }) => {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    return withRandomDelay({}, 200, 500).then(() => {
      if (!email) {
        return HttpResponse.json({ message: 'Email parameter is required' }, { status: 400 });
      }

      const user = db.findUserByEmail(email);
      return HttpResponse.json({ available: !user });
    });
  }),

  // Validate Password
  http.post(`${config.baseUrl}/auth/validate-password`, async ({ request }) => {
    const { password } = (await request.json()) as { password: string };

    return withRandomDelay({}, 100, 300).then(() => {
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

      return HttpResponse.json({
        valid: feedback.length === 0,
        score,
        feedback,
      });
    });
  }),
];

// ================================
// Export All Handlers
// ================================

export const handlers = [
  ...authHandlers,
  // Add other handlers here as we create them
];
