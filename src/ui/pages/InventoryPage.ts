import type { Locator, Page } from '@playwright/test';
import type { SortOption } from '../data/catalog';
import { parsePrice } from '../domain/checkoutTotals';

export class InventoryPage {
  readonly title: Locator;
  readonly itemNames: Locator;
  readonly sort: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.sort = page.getByRole('combobox', { name: 'Sort products' });
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  card(productName: string): Locator {
    return this.page.getByTestId('inventory-item').filter({
      has: this.page.getByTestId('inventory-item-name').getByText(productName, { exact: true }),
    });
  }

  async add(productName: string): Promise<void> {
    await this.card(productName).getByRole('button', { name: 'Add to cart' }).click();
  }

  async remove(productName: string): Promise<void> {
    await this.card(productName).getByRole('button', { name: 'Remove' }).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sort.selectOption(option);
  }

  async prices(): Promise<number[]> {
    const texts = await this.page.getByTestId('inventory-item-price').allTextContents();
    return texts.map((text) => parsePrice(text));
  }
}
