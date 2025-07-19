import { type Locator, type Page } from '@playwright/test';

export class ComponentsPage {
  readonly page: Page;
  readonly buttonShowcase: Locator;
  readonly inputShowcase: Locator;
  readonly cardShowcase: Locator;
  readonly themeToggle: Locator;
  readonly primaryButton: Locator;
  readonly secondaryButton: Locator;
  readonly sampleInput: Locator;
  readonly sampleCard: Locator;

  constructor(page: Page) {
    this.page = page;
    this.buttonShowcase = page.getByTestId('button-showcase');
    this.inputShowcase = page.getByTestId('input-showcase');
    this.cardShowcase = page.getByTestId('card-showcase');
    this.themeToggle = page.getByRole('button', { name: /toggle theme/i });
    this.primaryButton = page.getByRole('button', { name: /primary/i }).first();
    this.secondaryButton = page.getByRole('button', { name: /secondary/i }).first();
    this.sampleInput = page.getByRole('textbox').first();
    this.sampleCard = page.locator('[data-testid="sample-card"]').first();
  }

  async goto() {
    await this.page.goto('/components');
  }

  async testButtonInteraction() {
    await this.primaryButton.click();
    await this.secondaryButton.click();
  }

  async testInputInteraction(text: string) {
    await this.sampleInput.fill(text);
    await this.sampleInput.press('Enter');
  }

  async toggleTheme() {
    await this.themeToggle.click();
  }

  async expectThemeChange() {
    // Wait for theme transition
    await this.page.waitForTimeout(300);

    // Check if dark mode class is applied
    const bodyClass = await this.page.locator('body').getAttribute('class');
    return bodyClass?.includes('dark') || bodyClass?.includes('theme-dark');
  }
}
