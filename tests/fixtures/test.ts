/**
 * Extended Playwright test with auto browser monitoring, localStorage reset,
 * and shared page object fixtures for E2E specs.
 */
import dotenv from 'dotenv';
import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { NewProjectPage } from '../../pages/NewProjectPage';
import { ProjectsPage } from '../../pages/ProjectsPage';
import { BrowserMonitor } from './browser-monitor';

dotenv.config();

export const test = base.extend<{
  browserMonitor: BrowserMonitor;
  loginPage: LoginPage;
  projectsPage: ProjectsPage;
  newProjectPage: NewProjectPage;
}>({
  browserMonitor: [
    async ({ page }, use, testInfo) => {
      await page.addInitScript(() => localStorage.clear());
      const monitor = new BrowserMonitor();
      monitor.attach(page);
      await use(monitor);
      await monitor.flush(testInfo);
    },
    { auto: true },
  ],

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  projectsPage: async ({ page }, use) => {
    await use(new ProjectsPage(page));
  },

  newProjectPage: async ({ page }, use) => {
    await use(new NewProjectPage(page));
  },
});

export { expect };
