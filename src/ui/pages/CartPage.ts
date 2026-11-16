import type { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly itemNames: Locator;
  readonly cartBadge: Locator;
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.itemNames = page.getByTestId('inventory-item-name');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.checkoutButton = page.getByTestId('checkout');
  }

  card(productName: string): Locator {
    return this.page.getByTestId('inventory-item').filter({
      has: this.page.getByTestId('inventory-item-name').getByText(productName, { exact: true }),
    });
  }

  async remove(productName: string): Promise<void> {
    await this.card(productName).getByRole('button', { name: 'Remove' }).click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
