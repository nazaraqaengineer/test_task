/**
 * E2E tests for CivicFlow Demo authentication: sign-in validation, errors, and logout.
 */
import { APPLICANT_CREDENTIALS } from '../../pages/LoginPage';
import { expect, test } from '../fixtures/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page, loginPage }) => {
    await page.addInitScript(() => localStorage.clear());
    await loginPage.goto();
  });

  test('successfully logs in with valid credentials', async ({ loginPage }) => {
    await test.step('Submit valid applicant credentials', async () => {
      await loginPage.signIn(
        APPLICANT_CREDENTIALS.email,
        APPLICANT_CREDENTIALS.password,
      );
    });

    await test.step('Verify applicant dashboard is displayed', async () => {
      await expect(
        loginPage.getDashboardHeading(),
        'dashboard heading should be visible after successful login',
      ).toBeVisible();
    });
  });

  test('shows error "Invalid email or password." with wrong password', async ({
    loginPage,
  }) => {
    await test.step('Submit valid email with incorrect password', async () => {
      await loginPage.signIn(APPLICANT_CREDENTIALS.email, 'WrongPassword1!');
    });

    await test.step('Verify invalid credentials error message', async () => {
      await expect(
        loginPage.getError(),
        'login error should describe invalid credentials',
      ).toHaveText('Invalid email or password.');
    });
  });

  test('shows error "Invalid email or password." with wrong email', async ({
    loginPage,
  }) => {
    await test.step('Submit unknown email with valid password', async () => {
      await loginPage.signIn('wrong@example.com', APPLICANT_CREDENTIALS.password);
    });

    await test.step('Verify invalid credentials error message', async () => {
      await expect(
        loginPage.getError(),
        'login error should describe invalid credentials',
      ).toHaveText('Invalid email or password.');
    });
  });

  test('shows error "Email is required." when email field is empty', async ({
    loginPage,
  }) => {
    await test.step('Submit form with password only', async () => {
      await loginPage.fillPassword(APPLICANT_CREDENTIALS.password);
      await loginPage.submit();
    });

    await test.step('Verify email required validation message', async () => {
      await expect(
        loginPage.getError(),
        'login error should require email',
      ).toHaveText('Email is required.');
    });
  });

  test('shows error "Password is required." when password field is empty', async ({
    loginPage,
  }) => {
    await test.step('Submit form with email only', async () => {
      await loginPage.fillEmail(APPLICANT_CREDENTIALS.email);
      await loginPage.submit();
    });

    await test.step('Verify password required validation message', async () => {
      await expect(
        loginPage.getError(),
        'login error should require password',
      ).toHaveText('Password is required.');
    });
  });

  test('shows error "Enter a valid email address." with invalid email format', async ({
    loginPage,
  }) => {
    await test.step('Submit malformed email address', async () => {
      await loginPage.signIn('not-an-email', APPLICANT_CREDENTIALS.password);
    });

    await test.step('Verify email format validation message', async () => {
      await expect(
        loginPage.getError(),
        'login error should reject invalid email format',
      ).toHaveText('Enter a valid email address.');
    });
  });

  test('redirects to login page after logout', async ({ loginPage }) => {
    await test.step('Sign in as applicant', async () => {
      await loginPage.signIn(
        APPLICANT_CREDENTIALS.email,
        APPLICANT_CREDENTIALS.password,
      );
      await expect(
        loginPage.getDashboardHeading(),
        'user should reach dashboard before logout',
      ).toBeVisible();
    });

    await test.step('Log out from sidebar', async () => {
      await loginPage.logout();
    });

    await test.step('Verify login form is shown again', async () => {
      await expect(
        loginPage.getEmailInput(),
        'email field should be visible on login page',
      ).toBeVisible();
      await expect(
        loginPage.getPasswordInput(),
        'password field should be visible on login page',
      ).toBeVisible();
    });
  });
});
