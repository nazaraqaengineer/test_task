/**
 * E2E tests for CivicFlow Demo Projects: navigation, creation, validation, and cancel flow.
 */
import { APPLICANT_CREDENTIALS } from '../../pages/LoginPage';
import { expect, test } from '../fixtures/test';

test.describe('Projects', () => {
  test.beforeEach(async ({ page, loginPage }) => {
    await page.addInitScript(() => localStorage.clear());
    await loginPage.goto();
    await loginPage.signIn(
      APPLICANT_CREDENTIALS.email,
      APPLICANT_CREDENTIALS.password,
    );
    await expect(
      loginPage.getDashboardHeading(),
      'authenticated session should start on dashboard',
    ).toBeVisible();
  });

  test('navigates to Projects page via sidebar', async ({ projectsPage }) => {
    await test.step('Open Projects from sidebar', async () => {
      await projectsPage.navigate();
    });

    await test.step('Verify Projects page content', async () => {
      await expect(
        projectsPage.getProjectsPageRoot(),
        'projects page wrapper should be visible',
      ).toBeVisible();
      await expect(
        projectsPage.getPageHeading(),
        'projects page heading should be visible',
      ).toBeVisible();
    });
  });

  test('creates project with required fields only and shows it in the list', async ({
    projectsPage,
    newProjectPage,
  }) => {
    const projectName = `E2E Required ${Date.now()}`;

    await test.step('Open new project form', async () => {
      await projectsPage.navigate();
      await projectsPage.clickCreateProject();
    });

    await test.step('Fill and submit required fields', async () => {
      await newProjectPage.fillName(projectName);
      await newProjectPage.fillJurisdiction('Sample City');
      await newProjectPage.fillAddress('200 Test Boulevard');
      await newProjectPage.submit();
    });

    await test.step('Verify project appears in list', async () => {
      await expect(
        projectsPage.getProjectsPageRoot(),
        'should return to projects list after creation',
      ).toBeVisible();
      await expect(
        projectsPage.getProjectCardByName(projectName),
        'new project card should be visible',
      ).toBeVisible();
      await expect(
        projectsPage.getProjectCardText(projectName, 'Sample City'),
        'project card should show jurisdiction',
      ).toBeVisible();
    });
  });

  test('creates project with all fields including optional and shows description in card', async ({
    projectsPage,
    newProjectPage,
  }) => {
    const projectName = `E2E Full ${Date.now()}`;
    const description = 'Optional description for automated test coverage.';

    await test.step('Open new project form', async () => {
      await projectsPage.navigate();
      await projectsPage.clickCreateProject();
    });

    await test.step('Fill all fields including optional', async () => {
      await newProjectPage.fillJurisdiction('Example County');
      await newProjectPage.fillName(projectName);
      await newProjectPage.fillAddress('300 Optional Lane');
      await newProjectPage.fillUnit('Suite 12');
      await newProjectPage.fillDescription(description);
      await newProjectPage.submit();
    });

    await test.step('Verify optional fields on project card', async () => {
      await expect(
        projectsPage.getProjectCardByName(projectName),
        'created project card should be visible',
      ).toBeVisible();
      await expect(
        projectsPage.getProjectCardText(projectName, description),
        'project card should show description',
      ).toBeVisible();
      await expect(
        projectsPage.getProjectCardText(projectName, '300 Optional Lane, Suite 12'),
        'project card should show address with unit',
      ).toBeVisible();
    });
  });

  test('shows error "Project name is required." when name is empty', async ({
    projectsPage,
    newProjectPage,
  }) => {
    await test.step('Submit form without project name', async () => {
      await projectsPage.navigate();
      await projectsPage.clickCreateProject();
      await newProjectPage.fillJurisdiction('Demo Township');
      await newProjectPage.fillAddress('400 Validation Road');
      await newProjectPage.submit();
    });

    await test.step('Verify name validation error', async () => {
      await expect(
        newProjectPage.getError(),
        'form should require project name',
      ).toHaveText('Project name is required.');
    });
  });

  test('shows error "Jurisdiction is required." when jurisdiction is not selected', async ({
    projectsPage,
    newProjectPage,
  }) => {
    await test.step('Submit form without jurisdiction', async () => {
      await projectsPage.navigate();
      await projectsPage.clickCreateProject();
      await newProjectPage.fillName('Jurisdiction Missing Project');
      await newProjectPage.fillAddress('500 Missing Jurisdiction Ave');
      await newProjectPage.submit();
    });

    await test.step('Verify jurisdiction validation error', async () => {
      await expect(
        newProjectPage.getError(),
        'form should require jurisdiction',
      ).toHaveText('Jurisdiction is required.');
    });
  });

  test('shows error "Address line is required." when address is empty', async ({
    projectsPage,
    newProjectPage,
  }) => {
    await test.step('Submit form without address', async () => {
      await projectsPage.navigate();
      await projectsPage.clickCreateProject();
      await newProjectPage.fillName('Address Missing Project');
      await newProjectPage.fillJurisdiction('Sample City');
      await newProjectPage.submit();
    });

    await test.step('Verify address validation error', async () => {
      await expect(
        newProjectPage.getError(),
        'form should require address line',
      ).toHaveText('Address line is required.');
    });
  });

  test('shows error "Project name already exists." for duplicate name', async ({
    projectsPage,
    newProjectPage,
  }) => {
    await test.step('Attempt to create duplicate seeded project', async () => {
      await projectsPage.navigate();
      await projectsPage.clickCreateProject();
      await newProjectPage.fillName('Garage Addition');
      await newProjectPage.fillJurisdiction('Sample City');
      await newProjectPage.fillAddress('999 Duplicate Street');
      await newProjectPage.submit();
    });

    await test.step('Verify duplicate name error', async () => {
      await expect(
        newProjectPage.getError(),
        'form should reject duplicate project name',
      ).toHaveText('Project name already exists.');
    });
  });

  test('returns to projects list when Cancel is clicked', async ({
    projectsPage,
    newProjectPage,
  }) => {
    await test.step('Open form and cancel', async () => {
      await projectsPage.navigate();
      await projectsPage.clickCreateProject();
      await newProjectPage.cancel();
    });

    await test.step('Verify projects list is shown', async () => {
      await expect(
        projectsPage.getProjectsPageRoot(),
        'projects page should be visible after cancel',
      ).toBeVisible();
      await expect(
        projectsPage.getPageHeading(),
        'projects heading should be visible after cancel',
      ).toBeVisible();
    });
  });
});
