import { authenticateUser, expect, test } from '../utils/test-utils';

test.describe('Dashboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await authenticateUser(page);
  });

  test('should display dashboard content', async ({ page, dashboardPage }) => {
    await dashboardPage.goto();

    // Check for main dashboard elements
    await dashboardPage.expectWelcomeMessage();
    await expect(dashboardPage.navigationMenu).toBeVisible();
    await expect(dashboardPage.userMenu).toBeVisible();
  });

  test('should navigate to profile page', async ({ page, dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.goToProfile();

    await expect(page).toHaveURL(/profile/);
  });

  test('should navigate to settings page', async ({ page, dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.goToSettings();

    await expect(page).toHaveURL(/settings/);
  });

  test('should navigate to components page', async ({ page }) => {
    await page.goto('/dashboard');

    // Navigate to components showcase
    await page.getByRole('link', { name: /components/i }).click();

    await expect(page).toHaveURL(/components/);
  });
});
