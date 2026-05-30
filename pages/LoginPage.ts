/** Page Object for the CivicFlow Demo sign-in screen and session logout. */
import type { Locator, Page } from '@playwright/test';

export const TEST_EMAIL =
  process.env.TEST_EMAIL ?? 'applicant@example.com';
export const TEST_PASSWORD =
  process.env.TEST_PASSWORD ?? 'Password123!';

export const APPLICANT_CREDENTIALS = {
  email: TEST_EMAIL,
  password: TEST_PASSWORD,
};

export class LoginPage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;
  private readonly errorMessage: Locator;
  private readonly logoutButton: Locator;
  private readonly dashboardHeading: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByTestId('login-email');
    this.passwordInput = page.getByTestId('login-password');
    this.submitButton = page.getByTestId('login-submit');
    this.errorMessage = page.getByTestId('login-error');
    this.logoutButton = page.getByTestId('logout-button');
    this.dashboardHeading = page.getByRole('heading', {
      name: 'Applicant dashboard',
    });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async signIn(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  getError(): Locator {
    return this.errorMessage;
  }

  getEmailInput(): Locator {
    return this.emailInput;
  }

  getPasswordInput(): Locator {
    return this.passwordInput;
  }

  getDashboardHeading(): Locator {
    return this.dashboardHeading;
  }
}
