/** Page Object for the Create Custom Project form. */
import type { Locator, Page } from '@playwright/test';

export class NewProjectPage {
  private readonly jurisdictionSelect: Locator;
  private readonly nameInput: Locator;
  private readonly addressInput: Locator;
  private readonly unitInput: Locator;
  private readonly descriptionInput: Locator;
  private readonly submitButton: Locator;
  private readonly errorMessage: Locator;
  private readonly cancelButton: Locator;

  constructor(private readonly page: Page) {
    this.jurisdictionSelect = page.getByTestId('project-jurisdiction');
    this.nameInput = page.getByTestId('project-name');
    this.addressInput = page.getByTestId('project-address');
    this.unitInput = page.getByTestId('project-unit');
    this.descriptionInput = page.getByTestId('project-description');
    this.submitButton = page.getByTestId('project-submit');
    this.errorMessage = page.getByTestId('project-form-error');
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async fillName(name: string): Promise<void> {
    await this.nameInput.fill(name);
  }

  async fillJurisdiction(jurisdiction: string): Promise<void> {
    await this.jurisdictionSelect.selectOption(jurisdiction);
  }

  async fillAddress(address: string): Promise<void> {
    await this.addressInput.fill(address);
  }

  async fillUnit(unit: string): Promise<void> {
    await this.unitInput.fill(unit);
  }

  async fillDescription(description: string): Promise<void> {
    await this.descriptionInput.fill(description);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getError(): Locator {
    return this.errorMessage;
  }
}
