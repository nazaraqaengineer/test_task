/** Page Object for the Projects list, sidebar navigation, and project cards. */
import type { Locator, Page } from '@playwright/test';

export class ProjectsPage {
  private readonly sidebarProjectsLink: Locator;
  private readonly projectsPageRoot: Locator;
  private readonly projectCards: Locator;
  private readonly createProjectButton: Locator;
  private readonly pageHeading: Locator;

  constructor(private readonly page: Page) {
    this.sidebarProjectsLink = page.getByTestId('sidebar-projects');
    this.projectsPageRoot = page.getByTestId('projects-page');
    this.projectCards = page.getByTestId('project-card');
    this.createProjectButton = page.getByTestId('create-project-button');
    this.pageHeading = page.getByRole('heading', {
      name: 'My Project Templates',
    });
  }

  async navigate(): Promise<void> {
    await this.sidebarProjectsLink.click();
  }

  getProjectsPageRoot(): Locator {
    return this.projectsPageRoot;
  }

  getPageHeading(): Locator {
    return this.pageHeading;
  }

  getProjectCards(): Locator {
    return this.projectCards;
  }

  async clickCreateProject(): Promise<void> {
    await this.createProjectButton.first().click();
  }

  getProjectCardByName(name: string): Locator {
    return this.projectCards.filter({
      has: this.page.getByRole('heading', { name, exact: true }),
    });
  }

  getProjectCardText(name: string, text: string): Locator {
    return this.getProjectCardByName(name).getByText(text);
  }
}
