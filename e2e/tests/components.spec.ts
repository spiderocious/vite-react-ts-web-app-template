import { expect, test } from '../utils/test-utils';

test.describe('Component Showcase', () => {
  test.beforeEach(async ({ page }) => {
    // Note: This assumes components page is publicly accessible
    // If it requires auth, add: await authenticateUser(page);
  });

  test('should display all component sections', async ({ page, componentsPage }) => {
    await componentsPage.goto();

    // Check for component showcase sections
    await expect(componentsPage.buttonShowcase).toBeVisible();
    await expect(componentsPage.inputShowcase).toBeVisible();
    await expect(componentsPage.cardShowcase).toBeVisible();
  });

  test('should interact with buttons', async ({ page, componentsPage }) => {
    await componentsPage.goto();

    // Test button interactions
    await componentsPage.testButtonInteraction();

    // Verify buttons are clickable and responsive
    await expect(componentsPage.primaryButton).toBeVisible();
    await expect(componentsPage.secondaryButton).toBeVisible();
  });

  test('should interact with input fields', async ({ page, componentsPage }) => {
    await componentsPage.goto();

    const testText = 'Hello, Playwright!';
    await componentsPage.testInputInteraction(testText);

    // Verify input has the text
    await expect(componentsPage.sampleInput).toHaveValue(testText);
  });

  test('should toggle theme', async ({ page, componentsPage }) => {
    await componentsPage.goto();

    // Get initial theme state
    const initialBodyClass = await page.locator('body').getAttribute('class');

    // Toggle theme
    await componentsPage.toggleTheme();

    // Wait for theme change
    await page.waitForTimeout(500);

    // Verify theme changed
    const newBodyClass = await page.locator('body').getAttribute('class');
    expect(newBodyClass).not.toBe(initialBodyClass);
  });

  test('should be responsive on mobile', async ({ page, componentsPage }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await componentsPage.goto();

    // Components should still be visible and functional on mobile
    await expect(componentsPage.buttonShowcase).toBeVisible();
    await expect(componentsPage.inputShowcase).toBeVisible();

    // Test mobile interactions
    await componentsPage.testButtonInteraction();
  });

  test('should handle keyboard navigation', async ({ page, componentsPage }) => {
    await componentsPage.goto();

    // Test Tab navigation through interactive elements
    await page.keyboard.press('Tab');

    // First focusable element should be focused
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Test Enter key on buttons
    await page.keyboard.press('Enter');
  });
});
