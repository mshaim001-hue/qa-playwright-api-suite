import type { Locator, Page } from '@playwright/test';

export type CheckoutCustomer = {
  firstName?: string;
  lastName?: string;
  postalCode?: string;
};

export class CheckoutInfoPage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.error = page.getByTestId('error');
  }

  async enterCustomer(customer: CheckoutCustomer): Promise<void> {
    if (customer.firstName !== undefined) {
      await this.firstName.fill(customer.firstName);
    }
    if (customer.lastName !== undefined) {
      await this.lastName.fill(customer.lastName);
    }
    if (customer.postalCode !== undefined) {
      await this.postalCode.fill(customer.postalCode);
    }
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }
}
