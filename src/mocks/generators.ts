/**
 * Mock Data Generators
 *
 * Utilities for generating realistic mock data for testing and development.
 */

import type {
  ActiveSession,
  AuthTokens,
  Permission,
  User,
  UserProfile,
  UserRole,
} from '@/types/auth';
import type { AnalyticsData, AppSettings, Notification, UploadResponse } from '@/types/services';

// ================================
// Utility Functions
// ================================

function randomId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString();
}

function randomFromArray<T>(array: readonly T[]): T {
  if (array.length === 0) {
    throw new Error('Array cannot be empty');
  }
  return array[Math.floor(Math.random() * array.length)]!;
}

function randomBoolean(probability = 0.5): boolean {
  return Math.random() < probability;
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ================================
// Name Generators
// ================================

const firstNames = [
  'Alex',
  'Jordan',
  'Taylor',
  'Morgan',
  'Casey',
  'Riley',
  'Avery',
  'Quinn',
  'Emma',
  'Liam',
  'Olivia',
  'Noah',
  'Ava',
  'William',
  'Sophia',
  'James',
  'Isabella',
  'Benjamin',
  'Charlotte',
  'Mason',
  'Amelia',
  'Ethan',
  'Mia',
  'Alexander',
  'Harper',
  'Henry',
  'Evelyn',
  'Sebastian',
  'Abigail',
  'Jack',
];

const lastNames = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Hernandez',
  'Lopez',
  'Gonzalez',
  'Wilson',
  'Anderson',
  'Thomas',
  'Taylor',
  'Moore',
  'Jackson',
  'Martin',
  'Lee',
  'Perez',
  'Thompson',
  'White',
  'Harris',
  'Sanchez',
  'Clark',
];

const domains = [
  'example.com',
  'test.com',
  'demo.org',
  'sample.net',
  'mock.io',
  'placeholder.dev',
  'fake.co',
  'dummy.biz',
];

// ================================
// Auth Data Generators
// ================================

export function generateUser(overrides: Partial<User> = {}): User {
  const firstName = randomFromArray(firstNames);
  const lastName = randomFromArray(lastNames);
  const domain = randomFromArray(domains);

  return {
    id: randomId(),
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
    firstName,
    lastName,
    avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
    role: randomFromArray<UserRole>(['user', 'admin', 'manager']),
    permissions: generatePermissions(),
    emailVerified: randomBoolean(0.8),
    createdAt: randomDate(new Date(2020, 0, 1), new Date()),
    updatedAt: randomDate(new Date(2023, 0, 1), new Date()),
    ...overrides,
  };
}

export function generateUserProfile(user?: User): UserProfile {
  const baseUser = user || generateUser();
  const phone = randomBoolean(0.6) ? `+1${randomNumber(1000000000, 9999999999)}` : undefined;

  const profile: UserProfile = {
    ...baseUser,
    timezone: randomFromArray(['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London']),
    language: randomFromArray(['en', 'es', 'fr', 'de']),
    preferences: {
      theme: randomFromArray(['light', 'dark', 'system']),
      notifications: {
        email: randomBoolean(0.8),
        push: randomBoolean(0.6),
        sms: randomBoolean(0.3),
      },
      privacy: {
        profileVisible: randomBoolean(0.7),
        showActivity: randomBoolean(0.5),
      },
    },
  };

  if (phone) {
    profile.phone = phone;
  }

  return profile;
}

export function generateAuthTokens(): AuthTokens {
  return {
    accessToken: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.${btoa(
      JSON.stringify({
        sub: randomId(),
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
        iat: Math.floor(Date.now() / 1000),
      })
    )}.${'x'.repeat(43)}`,
    refreshToken: randomId() + randomId(),
    expiresIn: 3600, // 1 hour in seconds
    tokenType: 'Bearer' as const,
  };
}

export function generateActiveSession(): ActiveSession {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Android 11; Mobile; rv:89.0) Gecko/89.0 Firefox/89.0',
  ];

  const locations = [
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Houston, TX',
    'London, UK',
    'Paris, France',
    'Tokyo, Japan',
    'Sydney, Australia',
  ];

  return {
    id: randomId(),
    deviceId: randomId(),
    userAgent: randomFromArray(userAgents),
    ipAddress: `${randomNumber(1, 255)}.${randomNumber(1, 255)}.${randomNumber(1, 255)}.${randomNumber(1, 255)}`,
    location: randomFromArray(locations),
    lastActivity: randomDate(new Date(Date.now() - 24 * 60 * 60 * 1000), new Date()),
    isCurrent: randomBoolean(0.1),
    createdAt: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
  };
}

function generatePermissions(): Permission[] {
  const allPermissions: Permission[] = [
    'users.read',
    'users.write',
    'users.delete',
    'admin.access',
    'reports.read',
    'reports.write',
    'settings.read',
    'settings.write',
  ];

  const numPermissions = randomNumber(1, allPermissions.length);
  const shuffled = [...allPermissions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numPermissions);
}

// ================================
// App Data Generators
// ================================

export function generateNotification(): Notification {
  const types = ['info', 'success', 'warning', 'error'] as const;
  const titles = [
    'Welcome!',
    'Update Available',
    'Security Alert',
    'New Feature',
    'Maintenance Notice',
    'Payment Reminder',
    'Profile Updated',
    'Login Alert',
  ];
  const messages = [
    'Your account has been successfully created.',
    'A new version of the app is available for download.',
    'Suspicious activity detected on your account.',
    'Check out our new dashboard features.',
    'Scheduled maintenance tonight from 2-4 AM.',
    'Your subscription expires in 7 days.',
    'Your profile information has been updated.',
    'New login detected from unknown device.',
  ];

  const notification: Notification = {
    id: randomId(),
    title: randomFromArray(titles),
    message: randomFromArray(messages),
    type: randomFromArray(types),
    read: randomBoolean(0.3),
    createdAt: randomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()),
  };

  if (randomBoolean(0.3)) {
    notification.data = { extra: 'Some additional data' };
  }

  return notification;
}

export function generateAnalyticsData(): AnalyticsData {
  return {
    pageViews: {
      total: randomNumber(10000, 100000),
      unique: randomNumber(5000, 50000),
      trend: randomNumber(-20, 30),
    },
    users: {
      total: randomNumber(1000, 10000),
      active: randomNumber(100, 1000),
      new: randomNumber(10, 100),
      trend: randomNumber(-10, 25),
    },
    sessions: {
      total: randomNumber(5000, 25000),
      avgDuration: randomNumber(120, 600), // seconds
      bounceRate: randomNumber(20, 80), // percentage
    },
  };
}

export function generateAppSettings(): AppSettings {
  return {
    general: {
      siteName: 'Frontend Template',
      siteDescription: 'A modern React template with TypeScript',
      contactEmail: 'contact@example.com',
      supportEmail: 'support@example.com',
    },
    features: {
      registration: true,
      emailVerification: true,
      twoFactorAuth: false,
      socialLogin: true,
    },
    security: {
      passwordMinLength: 8,
      passwordRequireSpecialChar: true,
      sessionTimeout: 3600, // seconds
      maxLoginAttempts: 5,
    },
    notifications: {
      emailEnabled: true,
      pushEnabled: true,
      smsEnabled: false,
    },
  };
}

export function generateUploadResponse(): UploadResponse {
  const fileTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
  const extensions = ['jpg', 'png', 'gif', 'pdf', 'txt'];

  const type = randomFromArray(fileTypes);
  const extension = extensions[fileTypes.indexOf(type)];
  const filename = `file_${randomId()}.${extension}`;

  return {
    id: randomId(),
    url: `https://cdn.example.com/uploads/${filename}`,
    filename,
    size: randomNumber(1024, 10 * 1024 * 1024), // 1KB to 10MB
    type,
  };
}

// ================================
// Data Collections
// ================================

export function generateUsers(count: number): User[] {
  return Array.from({ length: count }, () => generateUser());
}

export function generateNotifications(count: number): Notification[] {
  return Array.from({ length: count }, () => generateNotification());
}

export function generateSessions(count: number): ActiveSession[] {
  const sessions = Array.from({ length: count }, () => generateActiveSession());
  // Ensure one session is marked as current
  if (sessions.length > 0) {
    sessions[0]!.isCurrent = true;
    sessions.slice(1).forEach((session) => {
      session.isCurrent = false;
    });
  }
  return sessions;
}

// ================================
// Random Error Generator
// ================================

export function generateRandomError(): Error {
  const errors = [
    'Network connection failed',
    'Server temporarily unavailable',
    'Invalid request parameters',
    'Authentication failed',
    'Insufficient permissions',
    'Resource not found',
    'Rate limit exceeded',
    'Internal server error',
  ];

  return new Error(randomFromArray(errors));
}

// ================================
// Delay Utilities
// ================================

export function randomDelay(min = 200, max = 1000): Promise<void> {
  const delay = randomNumber(min, max);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export async function withRandomDelay<T>(value: T, minDelay = 200, maxDelay = 1000): Promise<T> {
  await randomDelay(minDelay, maxDelay);
  return value;
}

export async function withRandomError<T>(
  value: T,
  errorRate = 0.1,
  minDelay = 200,
  maxDelay = 1000
): Promise<T> {
  await randomDelay(minDelay, maxDelay);

  if (Math.random() < errorRate) {
    throw generateRandomError();
  }

  return value;
}
