import { expect, setupMockAPI, test, TEST_USERS } from '../utils/test-utils';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAPI(page);
  });

  test('should login with valid credentials', async ({ page, loginPage, dashboardPage }) => {
    await loginPage.goto();

    // Fill login form
    await loginPage.login(TEST_USERS.valid.email, TEST_USERS.valid.password);

    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard/);
    await dashboardPage.expectWelcomeMessage();
  });

  test('should show error with invalid credentials', async ({ page, loginPage }) => {
    // Mock failed authentication
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Invalid credentials',
        }),
      });
    });

    await loginPage.goto();
    await loginPage.login(TEST_USERS.invalid.email, TEST_USERS.invalid.password);

    // Should show error message
    await loginPage.expectErrorMessage('Invalid credentials');

    // Should stay on login page
    await expect(page).toHaveURL(/login/);
  });

  test('should logout successfully', async ({ page, loginPage, dashboardPage }) => {
    // Login first
    await loginPage.goto();
    await loginPage.login(TEST_USERS.valid.email, TEST_USERS.valid.password);
    await expect(page).toHaveURL(/dashboard/);

    // Logout
    await dashboardPage.logout();

    // Should redirect to login
    await expect(page).toHaveURL(/login/);
  });

  test('should navigate to register page', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.goToRegister();

    await expect(page).toHaveURL(/register/);
  });

  test('should require authentication for protected routes', async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto('/dashboard');

    // Should redirect to login
    await expect(page).toHaveURL(/login/);
  });
});
