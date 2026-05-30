/** Collects browser console errors and failed network requests for Playwright reports. */
import type { Page, TestInfo } from '@playwright/test';

export interface BrowserIssueReport {
  consoleErrors: string[];
  failedRequests: string[];
}

export class BrowserMonitor {
  private readonly consoleErrors: string[] = [];
  private readonly failedRequests: string[] = [];

  attach(page: Page): void {
    page.on('console', (message) => {
      if (message.type() === 'error') {
        this.consoleErrors.push(message.text());
      }
    });

    page.on('requestfailed', (request) => {
      const failure = request.failure();
      this.failedRequests.push(
        `${request.method()} ${request.url()} — ${failure?.errorText ?? 'unknown failure'}`,
      );
    });
  }

  getReport(): BrowserIssueReport {
    return {
      consoleErrors: [...this.consoleErrors],
      failedRequests: [...this.failedRequests],
    };
  }

  hasIssues(): boolean {
    return this.consoleErrors.length > 0 || this.failedRequests.length > 0;
  }

  async flush(testInfo: TestInfo): Promise<void> {
    if (!this.hasIssues()) {
      return;
    }

    const report = this.getReport();

    await testInfo.attach('browser-console-and-network-issues.json', {
      body: JSON.stringify(report, null, 2),
      contentType: 'application/json',
    });

    if (report.consoleErrors.length > 0) {
      testInfo.annotations.push({
        type: 'console-errors',
        description: `${report.consoleErrors.length} console error(s) — see attachment`,
      });
    }

    if (report.failedRequests.length > 0) {
      testInfo.annotations.push({
        type: 'failed-requests',
        description: `${report.failedRequests.length} failed request(s) — see attachment`,
      });
    }
  }
}
