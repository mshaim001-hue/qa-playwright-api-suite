import type { Locator, Page } from '@playwright/test';

export class CheckoutOverviewPage {
  readonly itemNames: Locator;
  readonly payment: Locator;
  readonly shipping: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    this.itemNames = page.getByTestId('inventory-item-name');
    this.payment = page.getByTestId('payment-info-value');
    this.shipping = page.getByTestId('shipping-info-value');
    this.subtotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
