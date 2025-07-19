import { test as base, expect } from '@playwright/test';
import { ComponentsPage } from '../pages/components.page';
import { DashboardPage } from '../pages/dashboard.page';
import { LoginPage } from '../pages/login.page';

// Test data for common scenarios
export const TEST_USERS = {
  valid: {
    email: 'test@example.com',
    password: 'Test123!@#',
  },
  invalid: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
  },
} as const;

// Extend basic test by providing page object models as fixtures
type TestFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  componentsPage: ComponentsPage;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  componentsPage: async ({ page }, use) => {
    await use(new ComponentsPage(page));
  },
});

// Helper function to authenticate user
export async function authenticateUser(page: any, user = TEST_USERS.valid) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(user.email, user.password);

  // Wait for navigation to dashboard
  await page.waitForURL('**/dashboard');
}

// Helper function to setup mock API responses
export async function setupMockAPI(page: any) {
  // Mock successful authentication
  await page.route('**/api/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: { id: '1', email: 'test@example.com', name: 'Test User' },
        token: 'mock-jwt-token',
      }),
    });
  });

  // Mock user profile
  await page.route('**/api/user/profile', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        avatar: null,
      }),
    });
  });

  // Mock dashboard data
  await page.route('**/api/dashboard', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        stats: {
          totalUsers: 1234,
          totalRevenue: 56789,
          totalOrders: 890,
        },
      }),
    });
  });
}

// Re-export expect for convenience
export { expect };
