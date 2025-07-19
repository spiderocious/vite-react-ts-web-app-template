import { type Locator, type Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly welcomeMessage: Locator;
  readonly userMenu: Locator;
  readonly logoutButton: Locator;
  readonly navigationMenu: Locator;
  readonly profileLink: Locator;
  readonly settingsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeMessage = page.getByRole('heading', { name: /welcome/i });
    this.userMenu = page.getByRole('button', { name: /user menu/i });
    this.logoutButton = page.getByRole('menuitem', { name: /logout/i });
    this.navigationMenu = page.getByRole('navigation');
    this.profileLink = page.getByRole('link', { name: /profile/i });
    this.settingsLink = page.getByRole('link', { name: /settings/i });
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async logout() {
    await this.userMenu.click();
    await this.logoutButton.click();
  }

  async goToProfile() {
    await this.profileLink.click();
  }

  async goToSettings() {
    await this.settingsLink.click();
  }

  async expectWelcomeMessage() {
    await this.welcomeMessage.waitFor({ state: 'visible' });
  }
}
